import "dotenv/config";
import mongoose from "mongoose";
import { createClerkClient } from "@clerk/backend";
import User from "../models/User.js";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function migrate() {
  await mongoose.connect(process.env.MONGO_URL);

  const users = await User.find({
    clerkId: { $exists: false },
    password: { $exists: true, $ne: null },
  });

  console.log(`Found ${users.length} users to migrate`);

  for (const user of users) {
    try {
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
        firstName: user.name,
        lastName: user.lastname,
        passwordDigest: user.password,   // your existing bcrypt hash
        passwordHasher: "bcrypt",
        skipPasswordChecks: true,
      });
      user.clerkId = clerkUser.id;
      await user.save();
      console.log(`✅ Migrated ${user.email} -> ${clerkUser.id}`);
    } catch (err) {
      console.error(`❌ Failed ${user.email}:`, err.errors || err.message);
    }
  }

  console.log("Migration complete");
  process.exit(0);
}

migrate();