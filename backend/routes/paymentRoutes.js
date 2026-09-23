import express from "express";
import { 
  initializePayfastPayment,
  verifyPayfastPayment,
  payfastWebhook,
  getPaymentMethods
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoint - no auth needed
router.get("/methods", getPaymentMethods);

// Protected endpoints - require auth
router.post("/payfast/initialize", verifyToken, initializePayfastPayment);
router.get("/payfast/verify", verifyToken, verifyPayfastPayment);

// Webhook - NO AUTHENTICATION (PayFast needs to post to this)
router.post("/payfast/webhook", payfastWebhook);

export default router;
