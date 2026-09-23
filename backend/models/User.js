import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  street: String,
  unitNumber: String,
  city: String,
  province: String,
  country: String,
  postalCode: String,
  formattedAddress: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, sparse: true, index: true }, // NEW
  name: String,
  lastname: String,
  email: { type: String, unique: true },
  password: { type: String, required: false }, // CHANGED: no longer required
  phone: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: null
  },
  savedAddresses: [addressSchema],
  defaultAddressId: { type: String },
  isVerified: { type: Boolean, default: true },
  verificationCode: String,
  verificationCodeExpires: Date,
  verificationMethod: { type: String, enum: ['email', 'sms'], default: 'sms' },
  verificationAttempts: { type: Number, default: 0 },
  receiveNewsletter: { type: Boolean, default: false },
  companyName: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  appliedAsWorker: { type: Boolean, default: false, index: true },
  workerApplicationDate: { type: Date, default: null },
  referredBy: { type: String, default: null },
  referredByAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "Referral", default: null },
  referralBookingsCount: { type: Number, default: 0 },
  passwordResetCode: String,
  passwordResetCodeExpires: Date,
  passwordResetRequestedAt: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);