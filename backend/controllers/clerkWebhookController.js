import { Webhook } from "svix";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

export const clerkWebhook = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ message: "Missing svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
      evt = wh.verify(req.body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ message: "Invalid signature" });
    }

    await connectDB();
    const { type, data } = evt;

    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.find(
        (e) => e.id === data.primary_email_address_id
      )?.email_address;
      const phone = data.phone_numbers?.[0]?.phone_number || "";

      const existing = await User.findOne({ clerkId: data.id });
      if (existing) {
        existing.name = data.first_name || existing.name;
        existing.lastname = data.last_name || existing.lastname;
        if (email) existing.email = email;
        if (phone) existing.phone = phone;
        await existing.save();
      } else {
        const legacyUser = email ? await User.findOne({ email }) : null;
        if (legacyUser && !legacyUser.clerkId) {
          legacyUser.clerkId = data.id;
          legacyUser.name = data.first_name || legacyUser.name;
          legacyUser.lastname = data.last_name || legacyUser.lastname;
          await legacyUser.save();
        } else {
          await User.create({
            clerkId: data.id,
            name: data.first_name || "",
            lastname: data.last_name || "",
            email: email || "",
            phone,
            isVerified: true,
          });
        }
      }
    }

    // Optional: decide what deletion means for you — unlinking vs deleting bookings history.
    if (type === "user.deleted") {
      await User.findOneAndUpdate({ clerkId: data.id }, { clerkId: null });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    res.status(500).json({ message: "Webhook handler failed" });
  }
};