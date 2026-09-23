import mongoose from "mongoose";

const serviceApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: null // Allow null for guest applications
  },
  
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: String,
  postalCode: String,
  
  // Service Details
  serviceType: { 
    type: String, 
    required: true,
    enum: ['carer', 'housekeeper', 'nanny']
  },
  startDate: { type: Date, required: true },
  preferredSchedule: String,
  hoursPerWeek: String,
  
  // Carer-specific fields
  recipientAge: Number,
  recipientCondition: [String],
  recipientMobility: String,
  careLevels: [String],
  specializedCare: [String],
  medicationManagement: Boolean,
  medicalEquipment: String,
  liveIn: Boolean,
  homeSize: String,
  numBedroomsAvailable: String,
  accessibilityNeeds: String,
  careExperience: String,
  certifications: String,
  languages: String,
  
  // Housekeeper-specific fields
  numRooms: String,
  specialServices: [String],
  pets: Boolean,
  childrenInHome: Boolean,
  experience: String,
  references: String,
  
  // Nanny-specific fields
  numChildren: Number,
  childrenAges: String,
  specialNeeds: Boolean,
  specialNeedsDetails: String,
  careActivities: [String],
  educationalSupport: Boolean,
  languagesSpoken: String,
  activities: [String],
  cprCertified: Boolean,
  firstAidCertified: Boolean,
  dietaryRestrictions: String,
  foodAllergies: String,
  
  // Common fields
  budgetRange: String,
  additionalNotes: String,
  agreeTerms: { type: Boolean, required: true },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin notes
  adminNotes: String,
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  
}, { timestamps: true });

export default mongoose.model("ServiceApplication", serviceApplicationSchema);