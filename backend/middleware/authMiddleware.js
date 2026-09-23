import { verifyToken as clerkVerifyToken, createClerkClient } from "@clerk/backend";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }
    const token = authHeader.substring(7);

    let payload;
    try {
      payload = await clerkVerifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }

    await connectDB();
    let user = await User.findOne({ clerkId: payload.sub });

    // Fallback: webhook hasn't fired yet — provision the Mongo user on the fly
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const email = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      const existingByEmail = email ? await User.findOne({ email }) : null;

      if (existingByEmail) {
        existingByEmail.clerkId = payload.sub;
        await existingByEmail.save();
        user = existingByEmail;
      } else {
        user = await User.create({
          clerkId: payload.sub,
          name: clerkUser.firstName || "",
          lastname: clerkUser.lastName || "",
          email: email || "",
          phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
          isVerified: true,
        });
      }
    }

    req.user = { id: user._id.toString(), email: user.email, clerkId: payload.sub };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};