import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllBookings,
  getBookingById,
  updateBooking,
  getAllWorkers,
  getWorkerById,
  updateWorkerStatus,
  toggleWorkerFeatured,
  getAllUsers,
  updateUser,
  getDashboardStats,
  assignWorkerToBooking,
  getAllReferrals
} from "../controllers/adminController.js";
import { getPasswordResetRequests } from "../controllers/authController.js";
import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(verifyAdmin);

// Dashboard stats
router.get("/dashboard/stats", getDashboardStats);

// Bookings routes
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.put("/bookings/:id", updateBooking);
router.post("/bookings/assign-worker", assignWorkerToBooking);

// Workers routes
router.get("/workers", getAllWorkers);
router.get("/workers/:id", getWorkerById);
// More specific routes must come before general routes
router.put("/workers/:id/status", updateWorkerStatus);
router.put("/workers/:id/featured", toggleWorkerFeatured);
// Update worker details (general route - must come after specific routes)
router.put('/workers/:workerId', async (req, res) => {
  try {
    await connectDB();
    
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    const { workerId } = req.params;
    const updates = req.body;
    
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    
    // Update allowed fields
    const allowedFields = [
      'fullName', 'email', 'phone', 'nationality', 'idNumber',
      'city', 'province', 'streetAddress', 'suburb', 'postalCode',
      'skills', 'workExperience', 'serviceTypes', 'gender'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        worker[field] = updates[field];
      }
    });
    
    await worker.save();
    
    res.json({
      message: "Worker updated successfully",
      worker
    });
    
  } catch (error) {
    console.error("Update worker error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/register-worker', verifyToken, async (req, res) => {
  try {
    await connectDB();
    
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const {
      userId,
      fullName,
      email,
      phone,
      nationality,
      idNumber,
      country,
      province,
      city,
      streetAddress,
      suburb,
      postalCode,
      serviceTypes,
      skills,
      workExperience
    } = req.body;

    // Check if worker already exists
    const existingWorker = await Worker.findOne({ userId });
    if (existingWorker) {
      return res.status(400).json({ message: "User is already registered as a worker" });
    }

    // Create worker profile
    const newWorker = new Worker({
      userId,
      fullName,
      email,
      phone,
      nationality: nationality || 'South African',
      idNumber: idNumber || '',
      country: country || 'South Africa',
      province,
      city,
      streetAddress,
      suburb,
      postalCode,
      serviceTypes: JSON.parse(serviceTypes || '[]'),
      skills: skills || '',
      workExperience: workExperience || 'No work experience provided',
      status: 'approved' // Admin-registered workers are auto-approved
    });

    await newWorker.save();

    // Update user to mark as worker
    await User.findByIdAndUpdate(userId, {
      appliedAsWorker: true,
      workerApplicationDate: new Date()
    });

    res.status(201).json({
      message: "Worker registered successfully",
      workerId: newWorker._id
    });

  } catch (error) {
    console.error("Register worker error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Users routes
router.get("/users", getAllUsers);
router.put("/users/:userId", updateUser);

// Password reset requests (Admin only)
router.get("/password-reset-requests", getPasswordResetRequests);

router.get("/referrals", getAllReferrals);

router.put("/referrals/:referralId/mark-paid", async (req, res) => {
  try {
    await connectDB();
    const { referralId } = req.params;
    // Accept either { commissionIndexes: [0,1,2] } or the old { commissionIndex: 0 }
    const indexes = Array.isArray(req.body.commissionIndexes)
      ? req.body.commissionIndexes
      : req.body.commissionIndex !== undefined
      ? [req.body.commissionIndex]
      : [];
 
    const referral = await Referral.findById(referralId);
    if (!referral) return res.status(404).json({ message: "Referral not found" });
 
    let changed = 0;
    for (const i of indexes) {
      const c = referral.commissions?.[i];
      if (c && !c.paid) {
        c.paid = true;
        c.paidAt = new Date();
        changed += 1;
      }
    }
    if (changed === 0) return res.status(400).json({ message: "No unpaid commissions matched" });
 
    await referral.save();
    res.json({ message: `Marked ${changed} commission(s) as paid`, referral });
  } catch (error) {
    console.error("Mark paid error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
 


export default router;

