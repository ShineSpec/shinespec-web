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
  name: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  savedAddresses: [addressSchema],
  defaultAddressId: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
