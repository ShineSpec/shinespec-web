import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import { connectDB } from "../lib/db.js";
import { processReferralCommission } from "./authController.js";

// Set PAYFAST_SANDBOX=true in env only when testing against the PayFast sandbox.
const PAYFAST_HOST =
  process.env.PAYFAST_SANDBOX === "true" ? "sandbox.payfast.co.za" : "www.payfast.co.za";

const VALID_METHODS = ["credit_card", "instant_eft", "snapscan", "samsung_pay"];

// ─────────────────────────────────────────────────────────────
// Signature helpers
// ─────────────────────────────────────────────────────────────
// >>> helpers
// Matches PHP urlencode(), which is what PayFast uses to build signatures.
const pfEncode = (value) =>
  encodeURIComponent(String(value).trim())
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%20/g, "+");

const md5 = (str) => crypto.createHash("md5").update(str).digest("hex");

// Checkout signature: fields in the order they are posted, blanks skipped.
const generateCheckoutSignature = (data, passphrase = "") => {
  let str = Object.keys(data)
    .filter((k) => k !== "signature" && data[k] !== "" && data[k] !== null && data[k] !== undefined)
    .map((k) => `${k}=${pfEncode(data[k])}`)
    .join("&");
  if (passphrase) str += `&passphrase=${pfEncode(passphrase)}`;
  return md5(str);
};

// ITN parameter string: every field in the order received, blanks INCLUDED,
// stopping at "signature". No passphrase here (see below where it is added).
const buildItnParamString = (data) => {
  const parts = [];
  for (const key of Object.keys(data)) {
    if (key === "signature") break;
    parts.push(`${key}=${pfEncode(data[key] ?? "")}`);
  }
  return parts.join("&");
};

const safeEqual = (a, b) => {
  const A = Buffer.from(String(a || ""));
  const B = Buffer.from(String(b || ""));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};
// <<< helpers

// PayFast posts ITNs as application/x-www-form-urlencoded. The route parses it,
// this is a fallback in case the body arrives as a raw string/Buffer.
const parseItnBody = (req) => {
  const b = req.body;
  if (b && typeof b === "object" && !Buffer.isBuffer(b) && Object.keys(b).length) return b;
  const raw = Buffer.isBuffer(b) ? b.toString("utf8") : typeof b === "string" ? b : "";
  return raw ? Object.fromEntries(new URLSearchParams(raw)) : {};
};

// Ask PayFast to confirm the ITN really came from them.
const confirmWithPayFast = async (paramString) => {
  const { data } = await axios.post(`https://${PAYFAST_HOST}/eng/query/validate`, paramString, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 8000
  });
  return String(data).trim() === "VALID";
};

// ─────────────────────────────────────────────────────────────
// Payment methods
// ─────────────────────────────────────────────────────────────
export const getPaymentMethods = async (req, res) => {
  try {
    res.json({
      success: true,
      methods: [
        {
          id: "credit_card",
          name: "Credit / Debit Card",
          description: "Visa, Mastercard, Debit/Credit Card",
          icon: "/card.png",
          enabled: true
        },
        {
          id: "instant_eft",
          name: "Instant EFT",
          description: "Pay directly from your bank account - Instant verification",
          icon: "/eft.png",
          enabled: true
        },
        {
          id: "snapscan",
          name: "SnapScan",
          description: "Scan QR to pay",
          icon: "/snapscan.png",
          enabled: true
        },
        {
          id: "samsung_pay",
          name: "Samsung Pay",
          description: "Quick payment",
          icon: "/samsung-pay.png",
          enabled: true
        }
      ]
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const mapPaymentMethod = (method) =>
  ({ credit_card: "cc", instant_eft: "eft", snapscan: "ss", samsung_pay: "sp" }[method] || "cc");

// ─────────────────────────────────────────────────────────────
// Initialize payment (checkout)
// ─────────────────────────────────────────────────────────────
export const initializePayfastPayment = async (req, res) => {
  try {
    await connectDB();

    const { bookingId, email, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!bookingId || !email || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, email, and payment method are required"
      });
    }

    if (!VALID_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Unsupported payment method" });
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;

    if (!merchantId || !merchantKey) {
      console.error("Missing PayFast credentials");
      return res.status(500).json({ success: false, message: "Payment service not configured" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.payment?.status === "paid") {
      return res.status(400).json({ success: false, message: "Payment already completed" });
    }

    const totalCost = booking.totalCost || 0;
    if (totalCost <= 0) {
      return res.status(400).json({ success: false, message: "Invalid booking amount" });
    }

    const amountInRands = parseFloat(totalCost).toFixed(2);
    const reference = `booking_${bookingId}_${Date.now()}`;

    const frontendUrl = (process.env.FRONTEND_URL || "").startsWith("http")
      ? process.env.FRONTEND_URL
      : `https://${process.env.FRONTEND_URL}`;

    const apiUrl = (process.env.API_BASE_URL || "").startsWith("http")
      ? process.env.API_BASE_URL
      : `https://${process.env.API_BASE_URL}`;

    const dataForSignature = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
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

    // Wallets (Samsung Pay etc.) are auto-detected by PayFast, so only send a
    // payment_method for card / instant EFT.
    if (paymentMethod === "credit_card" || paymentMethod === "instant_eft") {
      dataForSignature.payment_method = mapPaymentMethod(paymentMethod);
    }

    const signature = generateCheckoutSignature(dataForSignature, process.env.PAYFAST_PASSPHRASE || "");
    const paymentData = { ...dataForSignature, signature };

    booking.payment = {
      status: "pending",
      transactionId: reference,
      method: paymentMethod,
      paidAt: null
    };
    await booking.save();

    console.log("[PAYFAST INIT]", { bookingId, reference, amount: amountInRands, paymentMethod });

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

// ─────────────────────────────────────────────────────────────
// Payment status (READ-ONLY)
// Called by the success page. It never marks anything as paid; only the
// signed, PayFast-confirmed ITN webhook below can do that.
// ─────────────────────────────────────────────────────────────
export const verifyPayfastPayment = async (req, res) => {
  try {
    await connectDB();

    const { reference } = req.query;
    const bookingId =
      typeof reference === "string" && reference.startsWith("booking_") ? reference.split("_")[1] : null;

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, status: "invalid", message: "Invalid payment reference" });
    }

    const booking = await Booking.findById(bookingId)
      .populate({ path: "assignedWorker", model: Worker, select: "fullName" })
      .lean();

    if (!booking) {
      return res.status(404).json({ success: false, status: "invalid", message: "Booking not found" });
    }

    // Only the owner (or an admin) may look at this booking
    if (booking.userId.toString() !== req.user.id) {
      const requester = await User.findById(req.user.id).select("role").lean();
      if (requester?.role !== "admin") {
        return res.status(403).json({ success: false, status: "invalid", message: "Unauthorized" });
      }
    }

    const status = booking.payment?.status || "pending";
    const paid = status === "paid";

    res.status(200).json({
      success: paid,
      status,
      message: paid
        ? "Payment confirmed"
        : status === "failed"
        ? "Payment failed"
        : "Payment not confirmed yet",
      booking
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// PayFast ITN webhook: the ONLY place a booking becomes "paid"
// ─────────────────────────────────────────────────────────────
export const payfastWebhook = async (req, res) => {
  const ack = () => res.status(200).json({ received: true });

  try {
    const itn = parseItnBody(req);

    if (!itn.payment_status || !itn.signature) {
      console.error("[ITN] empty or malformed body. content-type:", req.headers["content-type"]);
      return ack();
    }

    console.log("[ITN] received", {
      payment_status: itn.payment_status,
      m_payment_id: itn.m_payment_id,
      pf_payment_id: itn.pf_payment_id,
      amount_gross: itn.amount_gross
    });

    // Check 1: signature
    const paramString = buildItnParamString(itn);
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const expected = md5(passphrase ? `${paramString}&passphrase=${pfEncode(passphrase)}` : paramString);

    if (!safeEqual(itn.signature, expected)) {
      console.error("[ITN] invalid signature for", itn.m_payment_id);
      return ack();
    }

    // Check 2: it is addressed to our merchant account
    if (String(itn.merchant_id) !== String(process.env.PAYFAST_MERCHANT_ID)) {
      console.error("[ITN] merchant_id mismatch for", itn.m_payment_id);
      return ack();
    }

    // Check 3: PayFast confirms it sent this ITN.
    // A network error here throws, we return 500 below so the failure is visible and can be retried.
    const valid = await confirmWithPayFast(paramString);
    if (!valid) {
      console.error("[ITN] PayFast did not confirm this ITN:", itn.m_payment_id);
      return ack();
    }

    await connectDB();

    // custom_str1 is covered by the signature, so it can be trusted now
    let bookingId = itn.custom_str1;
    if (!bookingId && itn.m_payment_id?.startsWith("booking_")) {
      bookingId = itn.m_payment_id.split("_")[1];
    }
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      console.error("[ITN] no valid booking id", { custom_str1: itn.custom_str1, m_payment_id: itn.m_payment_id });
      return ack();
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error("[ITN] booking not found:", bookingId);
      return ack();
    }

    if (itn.payment_status === "FAILED") {
      await Booking.updateOne(
        { _id: booking._id, "payment.status": "pending" },
        { $set: { "payment.status": "failed" } }
      );
      console.log("[ITN] payment failed for booking", bookingId);
      return ack();
    }

    if (itn.payment_status !== "COMPLETE") {
      console.log("[ITN] ignoring status", itn.payment_status);
      return ack();
    }

    // Check 4: amount matches what we asked for
    const gross = Number.parseFloat(itn.amount_gross);
    if (!Number.isFinite(gross) || Math.abs(gross - Number(booking.totalCost)) > 0.01) {
      console.error("[ITN] AMOUNT MISMATCH, not marking paid", {
        bookingId,
        expected: booking.totalCost,
        received: itn.amount_gross
      });
      return ack();
    }

    // Atomic + idempotent: only the first ITN flips pending -> paid
    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id, "payment.status": { $ne: "paid" } },
      {
        $set: {
          "payment.status": "paid",
          "payment.transactionId": itn.m_payment_id,
          "payment.m_payment_id": itn.m_payment_id,
          "payment.paidAt": new Date(),
          "payment.webhookConfirmed": true,
          "payment.paymentData": {
            pf_payment_id: itn.pf_payment_id,
            payment_status: itn.payment_status,
            amount_gross: itn.amount_gross,
            amount_fee: itn.amount_fee,
            amount_net: itn.amount_net
          }
        }
      },
      { new: true }
    );

    if (!updated) {
      console.log("[ITN] already processed:", bookingId);
      return ack();
    }

    // Confirm, but never resurrect a booking that was cancelled in the meantime
    await Booking.updateOne({ _id: updated._id, status: "pending" }, { $set: { status: "confirmed" } });

    // Assign a worker if none yet
    let assignedWorker = updated.assignedWorker;
    if (!assignedWorker) {
      assignedWorker = updated.preferredProvider || (await findBestWorker(updated.serviceType))?._id;
      if (assignedWorker) {
        await Booking.updateOne({ _id: updated._id }, { $set: { assignedWorker } });
      }
    }

    console.log("[ITN] booking paid and confirmed:", bookingId);

    // Side effects must not undo the payment if they fail
    try {
      await processReferralCommission(updated.userId.toString(), updated.totalCost, updated._id);
    } catch (err) {
      console.error("[ITN] referral commission failed for booking", bookingId, err.message);
    }

    if (assignedWorker) {
      await notifyWorker({ ...updated.toObject(), assignedWorker });
    }

    return ack();
  } catch (error) {
    // Genuine failure (DB down, PayFast unreachable). Not a 200, so it shows up
    // in the logs and PayFast knows we did not process it.
    console.error("[ITN] webhook error:", error);
    return res.status(500).json({ received: false });
  }
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
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

const findBestWorker = async (serviceType) => {
  try {
    await connectDB();
    const serviceTypeMapping = {
      "Indoor Services": ["Indoor Cleaning"],
      "Outdoor Services": ["Outdoor Cleaning", "Gardening"],
      "Office Cleaning": ["Office Cleaning"],
      "Moving Cleaning": ["Indoor Cleaning"],
      "Laundry & Ironing": ["Laundry & Ironing"],
      "Mom's Helper": ["Child Care", "Cooking"],
      "Elder Care": ["Elder Care"],
      "Event Cleaning": ["Indoor Cleaning", "Outdoor Cleaning"],
      "Express Cleaning": ["Indoor Cleaning"]
    };

    const requiredServices = serviceTypeMapping[serviceType] || [];
    if (requiredServices.length === 0) return null;

    const worker = await Worker.findOne({
      serviceTypes: { $in: requiredServices },
      status: "approved",
      isActive: { $ne: false } // matches workers where the field is true OR missing
    })
      .sort({ rating: -1, jobsCompleted: -1 })
      .lean();

    return worker || null;
  } catch (error) {
    console.error("Error finding best worker:", error.message);
    return null;
  }
};