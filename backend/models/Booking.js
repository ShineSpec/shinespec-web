import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    address: {
      formattedAddress: {
        type: String,
        required: true,
      },
      unitNumber: String,
      addressId: mongoose.Schema.Types.ObjectId,
    },
    customTasks: [String],
    hoursNeeded: {
      type: Number,
      required: true,
      min: 2,
      max: 8,
    },
    frequency: {
      type: String,
      enum: ["one-time", "2-5-weekly", "weekly", "bi-weekly"],
      required: true,
    },
    recurringDays: [String],
    preferredTimeSlot: String,
    preferredProvider: {
      type: String,
      default: "auto-assign",
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    scheduledDate: Date,
    scheduledTime: String,
    notes: String,
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "refunded"],
        default: "pending",
      },
      method: String,
      transactionId: String,
      paidAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ assignedWorker: 1 });
bookingSchema.index({ createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);