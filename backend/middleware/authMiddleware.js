import { verifyToken as verifyClerkToken, createClerkClient } from "@clerk/backend";
import { connectDB } from "../lib/db.js";
import User from "../models/User.js";

// Needs CLERK_SECRET_KEY in the backend env. CLERK_JWT_KEY (the PEM public key from
// Clerk Dashboard → API keys) is optional and makes verification networkless/faster.
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Origins allowed to have minted the token. Same list as your CORS config.
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://shinespec.com",
  "https://www.shinespec.com",
  ...(process.env.CLERK_AUTHORIZED_PARTIES ? process.env.CLERK_AUTHORIZED_PARTIES.split(",") : [])
];

// clerkId -> mongo _id (this mapping never changes, so no expiry needed)
const idCache = new Map();

const readBearer = (req) => {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  return t && t !== "null" && t !== "undefined" ? t : null;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Find the Mongo user for a Clerk user. Creates or links one if the Clerk webhook
// hasn't run (or was missed), so a valid Clerk login never ends in "user not found".
const resolveUser = async (clerkId) => {
  await connectDB();

  let user = await User.findOne({ clerkId }).select("_id role");
  if (user) return user;

  const cu = await clerk.users.getUser(clerkId);
  const primary =
    cu.emailAddresses.find((e) => e.id === cu.primaryEmailAddressId) || cu.emailAddresses[0];
  const email = primary?.emailAddress?.toLowerCase();
  const emailVerified = primary?.verification?.status === "verified";
  const phone = (cu.phoneNumbers.find((p) => p.id === cu.primaryPhoneNumberId) || cu.phoneNumbers[0])
    ?.phoneNumber;

  if (!email || !emailVerified) {
    const err = new Error("Account needs a verified email address");
    err.status = 403;
    throw err;
  }

  // Existing (pre-Clerk) account with the same email -> link it. Only safe because the
  // email is verified by Clerk.
  const existing = await User.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, "i") }).select(
    "_id role clerkId"
  );
  if (existing) {
    if (existing.clerkId && existing.clerkId !== clerkId) {
      const err = new Error("This email is linked to a different login");
      err.status = 403;
      throw err;
    }
    existing.clerkId = clerkId;
    await existing.save();
    return existing;
  }

  try {
    return await User.create({
      clerkId,
      email,
      name: cu.firstName || "",
      lastname: cu.lastName || "",
      phone: phone || "",
      isVerified: true
    });
  } catch (e) {
    if (e?.code === 11000) {
      // the Clerk webhook (or a parallel request) created it first
      const again = await User.findOne({ clerkId }).select("_id role");
      if (again) return again;
    }
    throw e;
  }
};

export const verifyToken = async (req, res, next) => {
  const token = readBearer(req);
  if (!token) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  let claims;
  try {
    const out = await verifyClerkToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      ...(process.env.CLERK_JWT_KEY ? { jwtKey: process.env.CLERK_JWT_KEY } : {})
    });
    // Different @clerk/backend versions return the payload, {data}, or throw
    if (out?.errors?.length || out?.error) throw out.errors?.[0] || out.error;
    claims = out?.data ?? out?.result ?? out;
    if (!claims?.sub) throw new Error("Token has no subject");

    // JWT-template tokens may not carry `azp`; session tokens do. Enforce it when present.
    if (claims.azp && !ALLOWED_ORIGINS.includes(claims.azp)) {
      throw Object.assign(new Error("Token not issued for this app"), { reason: "azp-not-allowed" });
    }
  } catch (err) {
    const expired = /expired/i.test(String(err?.reason || err?.message || ""));
    return res.status(401).json({ message: expired ? "Token expired" : "Invalid token. Please log in again." });
  }

  try {
    let mongoId = idCache.get(claims.sub);
    let role;
    if (!mongoId) {
      const user = await resolveUser(claims.sub);
      mongoId = String(user._id);
      role = user.role;
      idCache.set(claims.sub, mongoId);
    }

    // `id` is the Mongo _id, which is what every controller already expects.
    // Role is deliberately not trusted from the cache; verifyAdmin re-reads it from the DB.
    req.user = { id: mongoId, clerkId: claims.sub, role };
    req.auth = claims;
    return next();
  } catch (err) {
    console.error("Auth user resolution error:", err.message);
    return res
      .status(err.status || 500)
      .json({ message: err.status ? err.message : "Server error during authentication" });
  }
};