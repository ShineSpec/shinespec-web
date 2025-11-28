import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  signup, 
  verifyAccount, 
  login, 
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
  cancelBooking
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import Worker from "../models/Worker.js";
import User from "../models/User.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads/workers");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ dest: "uploads/" });

router.post("/signup", signup);
router.post("/verify", verifyAccount);
router.post("/login", login);
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

// POST /api/workers/apply
router.post(
  "/apply",
  verifyToken,
  (req, res, next) => {
    upload.fields([
      { name: "idDocument", maxCount: 1 },
      { name: "photoDocument", maxCount: 1 },
      { name: "proofOfAddress", maxCount: 1 },
      { name: "workPermit", maxCount: 1 },
      { name: "refugeeId", maxCount: 1 },
    ])(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  applyAsWorker
);

router.get("/my-status", verifyToken, async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(404).json({ message: "No worker application found" });
    }
    res.json({ status: worker.status, worker });
  } catch (error) {
    console.error("Status fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
