import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  signup, 
  //verifyAccount, 
  login, 
  //resendVerificationCode,
  getUserProfile, 
  updateUserProfile, 
  applyAsWorker, 
  saveAddress, 
  getAddresses, 
  editAddress, 
  deleteAddress, 
  setDefaultAddress,
  createBooking,
  getUserBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  generateWorkerExplanation,
  aiServiceMatch,
  chatbotQuery,
  getWorkerProfile,
  getWorkerBookings,
  updateBookingStatus,
  updateWorkerProfile,
  updateWorkerAvailability,
  getWorkerStats,
  submitServiceApplication,
  getUserApplications,
  requestPasswordReset,
  verifyPasswordReset,
  getPasswordResetRequests,
  submitReferral,
  getMyReferral,
  processReferralCommission,
  attachReferral
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import Worker from "../models/Worker.js";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

// Configure multer to use memory storage (files stored in RAM as Buffer)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false);
    }
  }
});


router.post("/signup", signup);
{/*router.post("/resend-code", resendVerificationCode);*/}
{/*router.post("/verify", verifyAccount);*/}
router.post("/login", login);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/verify-password-reset", verifyPasswordReset);
router.get("/me", verifyToken, getUserProfile);
router.put("/update-profile", verifyToken, updateUserProfile);
router.post("/save-address", verifyToken, saveAddress);
router.get("/addresses", verifyToken, getAddresses);
router.put("/edit-address/:addressId", verifyToken, editAddress);
router.delete("/delete-address/:addressId", verifyToken, deleteAddress);
router.put("/set-default/:addressId", verifyToken, setDefaultAddress);

// Create new booking
router.post("/bookings", verifyToken, createBooking);

// Get all user bookings
router.get("/bookings", verifyToken, getUserBookings);

// Get single booking
router.get("/bookings/:bookingId", verifyToken, getBookingById);

// Update booking
router.put("/bookings/:bookingId", verifyToken, updateBooking);

// Cancel booking
router.put("/bookings/:bookingId/cancel", verifyToken, cancelBooking);


router.put("/address/:addressId", verifyToken, async (req, res) => {
  try {
    await connectDB(); 
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addr = user.savedAddresses.id(addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    addr.street = req.body.street ?? addr.street;
    addr.unitNumber = req.body.unitNumber ?? addr.unitNumber;
    addr.city = req.body.city ?? addr.city;
    addr.province = req.body.province ?? addr.province;
    addr.country = req.body.country ?? addr.country;
    addr.postalCode = req.body.postalCode ?? addr.postalCode;
    addr.formattedAddress = req.body.formattedAddress ?? addr.formattedAddress;

    await user.save();

    res.json({ message: "Address updated", address: addr });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Worker routes
router.get("/my-profile", verifyToken, getWorkerProfile);
router.get("/my-bookings", verifyToken, getWorkerBookings);
router.patch("/booking/:bookingId/status", verifyToken, updateBookingStatus);
router.patch("/update-profile", verifyToken, updateWorkerProfile);
router.patch("/update-availability", verifyToken, updateWorkerAvailability);
router.get("/stats", verifyToken, getWorkerStats);
router.post("/ai-explanation", verifyToken, generateWorkerExplanation);

// POST /api/workers/apply
router.post(
  "/apply",
  verifyToken,
  upload.fields([
    { name: "idDocument", maxCount: 1 },
    { name: "photoDocument", maxCount: 1 },
    { name: "proofOfAddress", maxCount: 1 },
    { name: "workPermit", maxCount: 1 },
    { name: "refugeeId", maxCount: 1 },
    { name: "qualificationsDocuments", maxCount: 10 },
  ]),
  applyAsWorker
);

// Replace the existing /approved route in authRoutes.js with this:

router.get("/approved", verifyToken, async (req, res) => {
  try {
    await connectDB(); 
    const workers = await Worker.find({ status: "approved" })
      .select(
        'fullName rating serviceTypes city province suburb streetAddress photoDocument reviews availability jobsCompleted featured'
      )
      .sort({ rating: -1 })
      .lean();

    console.log(`📦 Fetched ${workers.length} approved workers`);
    
    // Log location data for debugging
    if (workers.length > 0) {
      console.log('Sample worker locations:');
      workers.slice(0, 3).forEach(w => {
        console.log(`  - ${w.fullName}: Suburb="${w.suburb || 'N/A'}", City="${w.city || 'N/A'}", Province="${w.province || 'N/A'}"`);
      });
    }

    const formattedWorkers = workers.map(worker => ({
      ...worker,
      photoDocument: worker.photoDocument ? (
        typeof worker.photoDocument === 'string' 
          ? worker.photoDocument 
          : worker.photoDocument.url || worker.photoDocument
      ) : null,
      // CRITICAL: Ensure location fields are explicitly set (not undefined)
      suburb: worker.suburb || '',
      city: worker.city || '',
      province: worker.province || '',
      streetAddress: worker.streetAddress || ''
    }));
    
    res.json(formattedWorkers);
  } catch (error) {
    console.error("Fetch approved workers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/workers/ai-explanation - Generate AI explanation for worker selection
router.post("/ai-explanation", verifyToken, generateWorkerExplanation);

router.post("/service-applications", submitServiceApplication); // No verifyToken for guest access
router.post("/ai-service-match", aiServiceMatch); // No auth required - can be used by guests
router.post("/chatbot", chatbotQuery); // No auth required - can be used by guests
router.get("/service-applications", verifyToken, getUserApplications);

router.post("/referral-signup", verifyToken, submitReferral);
router.get("/my-referral", verifyToken, getMyReferral);

router.post("/attach-referral", verifyToken, attachReferral);

export default router;
