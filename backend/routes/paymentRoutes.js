import express from "express";
import {
  initializePayfastPayment,
  verifyPayfastPayment,
  payfastWebhook,
  getPaymentMethods
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/methods", getPaymentMethods);

// Authenticated
router.post("/payfast/initialize", verifyToken, initializePayfastPayment);
router.get("/payfast/verify", verifyToken, verifyPayfastPayment); // read-only status check

// Webhook: no auth (PayFast calls it). PayFast posts form-encoded data, so the
// urlencoded parser is attached to this route directly instead of relying on
// what the app registered globally.
router.post("/payfast/webhook", express.urlencoded({ extended: false }), payfastWebhook);

export default router;