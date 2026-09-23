// ─────────────────────────────────────────────────────────────────────────
// ADD THIS to authController.js (public-facing submission)
// ─────────────────────────────────────────────────────────────────────────
import { connectDB } from "../lib/db.js";
import Referral from "../models/Referral.js";
import crypto from "crypto";

export const submitReferral = async (req, res) => {
  try {
    await connectDB();

    const { fullName, email, phone, agencyName, payoutPreference, message } = req.body;

    if (!fullName || !email || !phone || !agencyName) {
      return res.status(400).json({
        message: "Full name, email, phone, and agency name are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingReferral = await Referral.findOne({ email: email.toLowerCase() });
    if (existingReferral) {
      return res.status(400).json({
        message: "This email is already registered in the referral program",
      });
    }

    // Short, shareable code e.g. "AGT-7F3K9A"
    const referralCode = `AGT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const newReferral = new Referral({
      fullName,
      email,
      phone,
      agencyName,
      payoutPreference: payoutPreference || "cash",
      message: message || "",
      referralCode,
    });

    await newReferral.save();

    console.log(`✅ New referral partner signed up: ${agencyName} (${email})`);

    res.status(201).json({
      message: "Referral signup successful",
      referralId: newReferral._id,
      referralCode: newReferral.referralCode,
    });
  } catch (error) {
    console.error("Referral signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// ADD THIS to adminController.js (admin listing, follows getAllUsers pattern)
// ─────────────────────────────────────────────────────────────────────────

export const getAllReferrals = async (req, res) => {
  try {
    await connectDB();

    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const referrals = await Referral.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Referral.countDocuments(query);

    res.json({
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all referrals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};