import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // List of emails to make admin (try both with and without .com)
    const adminEmails = [
      "cephas@shinespec.com",
      "thabo@shinespec.com",
      "cephas@shinespec",
      "thabo@shinespec"
    ];

    for (const email of adminEmails) {
      const user = await User.findOne({ email });

      if (!user) {
        console.log(`❌ User with email ${email} not found`);
        continue;
      }

      // Update user role to admin
      user.role = "admin";
      await user.save();

      console.log(`✅ Updated ${email} to admin`);
    }

    console.log("\n✅ All users updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

makeAdmin();

