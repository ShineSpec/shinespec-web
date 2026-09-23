import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    agencyName: { type: String, required: true, trim: true },
    payoutPreference: {
  type: String,
  enum: ["quick-cash", "commission"],
  default: "quick-cash",
},
    message: { type: String, default: "" },
    referralCode: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    totalReferrals: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    commissions: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookingCost: Number,
    commissionAmount: Number,
    type: { type: String, enum: ["quick-cash", "commission-10pct"] },
    date: { type: Date, default: Date.now },
    paid: { type: Boolean, default: false }, // admin marks this when they pay out
  }
],
processedBookingIds: [{ type: mongoose.Schema.Types.ObjectId }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Referral", referralSchema);