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
      formattedAddress: String,
      unitNumber: String,
      addressId: mongoose.Schema.Types.ObjectId,
    },
    customTasks: [String],
    hoursNeeded: Number,
    frequency: String,
    preferredProvider: mongoose.Schema.Types.ObjectId,
    assignedWorker: mongoose.Schema.Types.ObjectId,
    totalCost: {
      type: Number,
      required: true,
    },
    scheduledDate: Date,
    scheduledTime: String,
    notes: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    // UPDATED: Enhanced payment tracking for PayFast
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      method: {
        type: String,
        enum: [
          "payfast",
          "credit_card",
          "instant_eft",
          "snapscan",
          "apple_pay",
          "samsung_pay",
          "paypal",
        ],
        default: "payfast",
      },
      transactionId: String,
      m_payment_id: String, // PayFast transaction ID
      paidAt: Date,
      webhookConfirmed: {
        type: Boolean,
        default: false,
      },
      // Store payment data for audit trail
      paymentData: mongoose.Schema.Types.Mixed,
    },
    // Service-specific fields
    laundryBundle: String,
    eventSize: String,
    eventGuestCount: String,
    eventCleaningScope: String,
    eventPackage: String,
    officeSpecialRequests: {
      extraProviders: Boolean,
      highRiskAreas: Boolean,
      earlyMorning: Boolean,
      afterHours: Boolean,
      biohazard: Boolean,
      customRequest: String,
    },
    completedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

// Index for faster queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ "payment.status": 1 });

export default mongoose.model("Booking", bookingSchema);
