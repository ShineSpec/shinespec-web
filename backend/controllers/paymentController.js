import axios from "axios";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import { connectDB } from "../lib/db.js";
import { processReferralCommission } from "./authController.js";

// PayFast Configuration
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_API_URL = process.env.PAYFAST_API_URL || "https://api.payfast.co.za";

// ✅ Get available payment methods
export const getPaymentMethods = async (req, res) => {
  try {
    res.json({
      success: true,
      methods: [
        {
          id: 'credit_card',
          name: 'Credit / Debit Card',
          description: 'Visa, Mastercard, Debit/Credit Card',
          icon: '/card.png',
          enabled: true
        },
        {
          id: 'instant_eft',
          name: 'Instant EFT',
          description: 'Pay directly from your bank account - Instant verification',
          icon: '/eft.png',
          enabled: true
        },
        {
          id: 'snapscan',
          name: 'SnapScan',
          description: 'Scan QR to pay',
          icon: '/snapscan.png',
          enabled: true
        },
        {
          id: 'samsung_pay',
          name: 'Samsung Pay',
          description: 'Quick payment',
          icon: '/samsung-pay.png',
          enabled: true
        }
      ]
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const generatePayFastSignature = (data, passphrase) => {
  // Create parameter string
  let pfOutput = "";
  
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`;
      }
    }
  }
  
  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  
  // Add passphrase as LAST parameter (not URL encoded)
  if (passphrase !== null && passphrase !== "") {
    getString += `&passphrase=${passphrase.trim()}`;
  }
  
  console.log("🔐 PAYFAST SIGNATURE DEBUG:");
  console.log("  - Parameter string:", getString);
  
  const signature = crypto.createHash("md5").update(getString).digest("hex");
  console.log("  - Generated signature:", signature);
  
  return signature;
};

// ✅ Map booking payment method to PayFast gateway method
const mapPaymentMethod = (method) => {
  const methodMap = {
    'credit_card': 'cc',
    'instant_eft': 'eft',
    'snapscan': 'ss',
    'samsung_pay': 'sp'
  };
  return methodMap[method] || 'cc';
};
// ✅ Initialize PayFast Payment

export const initializePayfastPayment = async (req, res) => {
  try {
    await connectDB();

    const { bookingId, email, paymentMethod } = req.body;
    const userId = req.user.id;

    console.log('Payment init request:', { bookingId, email, paymentMethod, userId });

    if (!bookingId || !email || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, email, and payment method are required"
      });
    }

    const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
    const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;

    if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY) {
      console.error('Missing PayFast credentials');
      return res.status(500).json({
        success: false,
        message: "Payment service not configured"
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.payment?.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed"
      });
    }

    const totalCost = booking.totalCost || 0;
    
    if (totalCost <= 0) {
      console.error('Invalid total cost:', totalCost);
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount"
      });
    }

    const amountInRands = parseFloat(totalCost).toFixed(2);
    const reference = `booking_${bookingId}_${Date.now()}`;

    console.log('Payment details:', { totalCost, amountInRands, reference, paymentMethod });

    const frontendUrl = (process.env.FRONTEND_URL || '').startsWith('http') 
      ? process.env.FRONTEND_URL 
      : `https://${process.env.FRONTEND_URL}`;

    const apiUrl = (process.env.API_BASE_URL || '').startsWith('http')
      ? process.env.API_BASE_URL
      : `https://${process.env.API_BASE_URL}`;

    // ✅ Base payment data (ALWAYS include these)
    const dataForSignature = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${frontendUrl}/payment/success?reference=${reference}`,
      cancel_url: `${frontendUrl}/payment/cancel`,
      notify_url: `${apiUrl}/api/payments/payfast/webhook`,
      name_first: "Customer",
      email_address: email,
      m_payment_id: reference,
      amount: amountInRands,
      item_name: "Booking Payment",
      custom_int1: String(Date.now()),
      custom_str1: bookingId.toString()
    };

    // ✅ ONLY add payment_method for specific methods (NOT for Apple/Samsung Pay)
    const mappedMethod = mapPaymentMethod(paymentMethod);
    
    // Only include payment_method if it's credit card or instant EFT
    // Samsung Pay is detected automatically by PayFast
    if (paymentMethod === 'credit_card' || paymentMethod === 'instant_eft') {
      dataForSignature.payment_method = mappedMethod;
    }
    
    console.log('Payment data for signature:', {
      ...dataForSignature,
      payment_method: dataForSignature.payment_method || 'auto-detect (wallet)'
    });

    // Generate signature
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const signature = generatePayFastSignature(dataForSignature, passphrase);
    
    // Create final payment data with signature
    const paymentData = {
      ...dataForSignature,
      signature: signature
    };

    console.log('Final payment data:', {
      merchant_id: paymentData.merchant_id,
      amount: paymentData.amount,
      m_payment_id: paymentData.m_payment_id,
      payment_method: paymentData.payment_method || 'not specified',
      signature: paymentData.signature
    });

    // Update booking with pending payment
    booking.payment = {
      status: "pending",
      transactionId: reference,
      method: paymentMethod,
      paidAt: null
    };

    await booking.save();

    res.status(200).json({
      success: true,
      paymentData,
      amount: amountInRands,
      reference,
      paymentMethod
    });

  } catch (error) {
    console.error("PayFast init error:", error);
    res.status(500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.message
    });
  }
};

// ✅ Verify PayFast Payment
export const verifyPayfastPayment = async (req, res) => {
  try {
    await connectDB();

    const { reference } = req.query;
    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment reference required" 
      });
    }

    // Extract booking ID from reference (format: booking_ID_timestamp)
    const bookingId = reference.split('_')[1];
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // Check if payment is already verified
    if (booking.payment?.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        booking
      });
    }

    // Query PayFast API
    const verifyData = {
      merchant_id: String(PAYFAST_MERCHANT_ID),
      merchant_key: String(PAYFAST_MERCHANT_KEY),
      return_url: `${process.env.FRONTEND_URL}/payment/success`
    };

    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    verifyData.signature = generatePayFastSignature(verifyData, passphrase);

    try {
      const response = await axios.post(
        `${PAYFAST_API_URL}/eng/query/validate`,
        new URLSearchParams({
          ...verifyData,
          payment_id: reference
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      // Update booking with payment confirmation - ENSURE ALL FIELDS ARE SET
      booking.payment.status = "paid";
      booking.payment.transactionId = reference;
      booking.payment.m_payment_id = reference;
      booking.payment.paidAt = new Date();
      booking.payment.webhookConfirmed = true;
      booking.payment.method = booking.payment.method || 'payfast'; // Ensure method is preserved
      booking.status = "confirmed";

      // Assign worker if not already assigned
      if (booking.preferredProvider && booking.preferredProvider !== "auto-assign") {
        booking.assignedWorker = booking.preferredProvider;
      } else if (!booking.assignedWorker) {
        const worker = await findBestWorker(booking.serviceType);
        if (worker) booking.assignedWorker = worker._id;
      }

      await booking.save();
      await processReferralCommission(booking.userId.toString(), booking.totalCost, booking._id);

      console.log(`✅ Payment verified for booking: ${bookingId}`);
      console.log(`   Payment status: ${booking.payment.status}`);
      console.log(`   Booking status: ${booking.status}`);

      if (booking.assignedWorker) {
        await notifyWorker(booking);
      }

      res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed",
        booking
      });

    } catch (apiError) {
      console.error("PayFast API error:", apiError.message);
      
      // Even if API fails, update booking if we have the reference
      booking.payment.status = "paid";
      booking.payment.transactionId = reference;
      booking.payment.m_payment_id = reference;
      booking.payment.paidAt = new Date();
      booking.payment.webhookConfirmed = false; // Mark as not webhook confirmed
      booking.payment.method = booking.payment.method || 'payfast';
      booking.status = "confirmed";

      if (booking.preferredProvider && booking.preferredProvider !== "auto-assign") {
        booking.assignedWorker = booking.preferredProvider;
      } else if (!booking.assignedWorker) {
        const worker = await findBestWorker(booking.serviceType);
        if (worker) booking.assignedWorker = worker._id;
      }

      await booking.save();

      res.status(200).json({
        success: true,
        message: "Payment verified and booking confirmed",
        booking
      });
    }

  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ✅ PayFast Webhook Handler - FIXED to use custom_str1
export const payfastWebhook = async (req, res) => {
  try {
    await connectDB();

    const webhookData = req.body;

    console.log('Webhook received:', { 
      payment_status: webhookData.payment_status,
      custom_int1: webhookData.custom_int1,
      custom_str1: webhookData.custom_str1,
      m_payment_id: webhookData.m_payment_id
    });

    // Verify signature
    const signature = webhookData.signature;
    const checkData = { ...webhookData };
    delete checkData.signature;

    const calculatedSignature = generatePayFastSignature(checkData);

    if (signature !== calculatedSignature) {
      console.error("Invalid PayFast webhook signature");
      console.error("Expected:", calculatedSignature);
      console.error("Received:", signature);
      return res.status(200).json({ received: true });
    }

    if (webhookData.payment_status !== "COMPLETE") {
      console.log('Payment status not complete:', webhookData.payment_status);
      return res.status(200).json({ received: true });
    }

    // FIXED: Use custom_str1 for booking ID (as set in initialization)
    // Fallback to extracting from m_payment_id if custom_str1 is not available
    let bookingId = webhookData.custom_str1;
    
    // Fallback: Extract booking ID from m_payment_id format: booking_ID_timestamp
    if (!bookingId && webhookData.m_payment_id) {
      const parts = webhookData.m_payment_id.split('_');
      if (parts.length >= 2 && parts[0] === 'booking') {
        bookingId = parts[1];
      }
    }
    
    const m_payment_id = webhookData.m_payment_id;

    if (!bookingId) {
      console.warn('No booking ID in webhook', {
        custom_str1: webhookData.custom_str1,
        m_payment_id: webhookData.m_payment_id
      });
      return res.status(200).json({ received: true });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.warn('Booking not found:', bookingId);
      return res.status(200).json({ received: true });
    }

    if (booking.payment?.status === "paid") {
      console.log('Payment already processed for booking:', bookingId);
      return res.status(200).json({ received: true });
    }

    // Update booking with payment confirmation
    booking.payment.status = "paid";
    booking.payment.transactionId = m_payment_id;
    booking.payment.m_payment_id = m_payment_id;
    booking.payment.paidAt = new Date();
    booking.payment.webhookConfirmed = true;
    booking.payment.method = booking.payment.method || 'payfast'; // Ensure method is set
    booking.status = "confirmed";

    // Assign worker if not already assigned
    if (booking.preferredProvider && booking.preferredProvider !== "auto-assign") {
      booking.assignedWorker = booking.preferredProvider;
    } else if (!booking.assignedWorker) {
      const worker = await findBestWorker(booking.serviceType);
      if (worker) booking.assignedWorker = worker._id;
    }

    await booking.save();
    await processReferralCommission(booking.userId.toString(), booking.totalCost, booking._id);

    console.log(`✅ Webhook confirmed payment for booking: ${bookingId}`);
    console.log(`   Payment status: ${booking.payment.status}`);
    console.log(`   Booking status: ${booking.status}`);
    console.log(`   Transaction ID: ${m_payment_id}`);

    if (booking.assignedWorker) {
      await notifyWorker(booking);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    res.status(200).json({ received: true });
  }
};

// Helper: Notify worker
const notifyWorker = async (booking) => {
  try {
    await connectDB();
    const worker = await Worker.findById(booking.assignedWorker);
    const user = await User.findById(booking.userId);

    if (!worker || !user) {
      console.warn("Worker or User not found for notification");
      return;
    }

    console.log(`✓ Worker ${worker.fullName} assigned to booking ${booking._id}`);
  } catch (error) {
    console.error("Worker notification error:", error.message);
  }
};

// Helper: Find best worker
const findBestWorker = async (serviceType) => {
  try {
    await connectDB();
    const serviceTypeMapping = {
      'Indoor Services': ['Indoor Cleaning'],
      'Outdoor Services': ['Outdoor Cleaning', 'Gardening'],
      'Office Cleaning': ['Office Cleaning'],
      'Moving Cleaning': ['Indoor Cleaning'],
      'Laundry & Ironing': ['Laundry & Ironing'],
      'Mom\'s Helper': ['Child Care', 'Cooking'],
      'Elder Care': ['Elder Care'],
      'Express Cleaning': ['Indoor Cleaning']
    };

    const requiredServices = serviceTypeMapping[serviceType] || [];
    if (requiredServices.length === 0) return null;

    const worker = await Worker.findOne({
      serviceTypes: { $in: requiredServices },
      status: 'approved',
      isActive: true
    })
    .sort({ rating: -1, jobsCompleted: -1 })
    .lean();

    return worker || null;
  } catch (error) {
    console.error('Error finding best worker:', error.message);
    return null;
  }
};