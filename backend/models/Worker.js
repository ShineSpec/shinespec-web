import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String },
  date: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
  text: { type: String }
}, { _id: false });

const workerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: null
    },
    nationality: { type: String, default: "South African" },
    idNumber: { type: String },
    workPermit: { type: String },
    refugeeId: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, default: "South Africa" },
    province: { type: String, index: true }, // ADD INDEX
    city: { type: String, index: true }, // ADD INDEX
    streetAddress: { type: String },
    suburb: { type: String, index: true }, // ADD INDEX
    postalCode: { type: String },
    serviceTypes: [{ type: String }],
    idDocument: { type: String },
    photoDocument: { type: String },
    proofOfAddress: { type: String },
    workExperience: { type: String },
    skills: { type: String },
    qualifications: { type: String },
    qualificationsDocuments: [{ type: String }],
    references: { type: String },
    availability: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true // ADD INDEX for status queries
    },
    rating: { 
      type: Number, 
      default: 95,
      min: 0,
      max: 100,
      index: true // ADD INDEX for sorting
    },
    jobsCompleted: { 
      type: Number, 
      default: 0,
      index: true // ADD INDEX for sorting
    },
    featured: {
      type: Boolean,
      default: false,
      index: true // ADD INDEX for sorting
    },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

// CREATE COMPOUND INDEX for location-based queries
workerSchema.index({ suburb: 1, city: 1, province: 1 });
workerSchema.index({ status: 1, rating: -1 });

export default mongoose.model("Worker", workerSchema);