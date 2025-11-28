import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    nationality: { type: String, default: "South African" },
    idNumber: { type: String },
    workPermit: { type: String },
    refugeeId: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, default: "South Africa" },
    province: { type: String },
    city: { type: String },
    streetAddress: { type: String },
    suburb: { type: String },
    postalCode: { type: String },
    serviceTypes: [{ type: String }],
    idDocument: { type: String },
    photoDocument: { type: String },
    proofOfAddress: { type: String },
    workExperience: { type: String },
    skills: { type: String },
    qualifications: { type: String },
    references: { type: String },
    availability: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Worker", workerSchema);
