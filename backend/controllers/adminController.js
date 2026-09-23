import { connectDB } from "../lib/db.js";
import Booking from "../models/Booking.js";
import Worker from "../models/Worker.js";
import User from "../models/User.js";
import Referral from "../models/Referral.js";

// GET ALL BOOKINGS (Admin)
export const getAllBookings = async (req, res) => {
  try {
    await connectDB();
    
    const { status, needsProvider, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    // Filter bookings that need a provider assigned
    if (needsProvider === 'true') {
      query.assignedWorker = null;
      // Only show pending or confirmed bookings that need a provider
      if (!status) {
        query.status = { $in: ['pending', 'confirmed'] };
      }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const bookings = await Booking.find(query)
      .populate('userId', 'name lastname email phone')
      .populate('assignedWorker', 'fullName phone email rating')
      .populate('preferredProvider', 'fullName phone email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE BOOKING (Admin)
export const getBookingById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('userId', 'name lastname email phone')
      .populate('assignedWorker', 'fullName phone email rating photoDocument')
      .populate('preferredProvider', 'fullName phone email')
      .lean();
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE BOOKING (Admin)
export const updateBooking = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const updates = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('userId', 'name lastname email phone')
      .populate('assignedWorker', 'fullName phone email')
      .populate('preferredProvider', 'fullName phone email');
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL WORKERS (Admin)
export const getAllWorkers = async (req, res) => {
  try {
    await connectDB();
    
    const { status, search, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // ADD SEARCH FUNCTIONALITY
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { province: { $regex: search, $options: 'i' } },
        { suburb: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const workers = await Worker.find(query)
      .populate('userId', 'name lastname email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Worker.countDocuments(query);
    
    res.json({
      workers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get all workers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE WORKER WITH DOCUMENTS (Admin)
export const getWorkerById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    const worker = await Worker.findById(id)
      .populate('userId', 'name lastname email phone')
      .lean();
    
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    
    res.json(worker);
  } catch (error) {
    console.error("Get worker by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE/REJECT WORKER (Admin)
export const updateWorkerStatus = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    const worker = await Worker.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'name lastname email phone');
    
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    
    res.json({ message: `Worker ${status} successfully`, worker });
  } catch (error) {
    console.error("Update worker status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TOGGLE WORKER FEATURED STATUS (Admin)
export const toggleWorkerFeatured = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    
    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    
    worker.featured = !worker.featured;
    await worker.save();
    
    res.json({ 
      message: `Worker ${worker.featured ? 'featured' : 'unfeatured'} successfully`, 
      worker 
    });
  } catch (error) {
    console.error("Toggle worker featured error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS (Admin)
export const getAllUsers = async (req, res) => {
  try {
    await connectDB();
    
    const { page = 1, limit = 50, search } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password -verificationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER (Admin)
export const updateUser = async (req, res) => {
  try {
    await connectDB();
    
    const { userId } = req.params;
    const { gender, name, lastname, phone, email } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update allowed fields
    if (gender !== undefined) user.gender = gender || null;
    if (name !== undefined) user.name = name;
    if (lastname !== undefined) user.lastname = lastname;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;
    
    await user.save();
    
    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET DASHBOARD STATS (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    await connectDB();
    
    const [
      totalUsers,
      totalWorkers,
      pendingWorkers,
      totalBookings,
      pendingBookings,
      completedBookings,
      bookingsNeedingProvider,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Worker.countDocuments({ status: 'pending' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ assignedWorker: null, status: { $in: ['pending', 'confirmed'] } }),
      Booking.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } }
      ])
    ]);
    
    const revenue = totalRevenue[0]?.total || 0;
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name lastname email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    res.json({
      stats: {
        totalUsers,
        totalWorkers,
        pendingWorkers,
        totalBookings,
        pendingBookings,
        completedBookings,
        bookingsNeedingProvider,
        totalRevenue: revenue
      },
      recentBookings
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ASSIGN WORKER TO BOOKING (Admin)
export const assignWorkerToBooking = async (req, res) => {
  try {
    await connectDB();
    const { bookingId, workerId } = req.body;
    
    if (!bookingId || !workerId) {
      return res.status(400).json({ message: "Booking ID and Worker ID are required" });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }
    
    if (worker.status !== 'approved') {
      return res.status(400).json({ message: "Worker must be approved to be assigned" });
    }
    
    booking.assignedWorker = workerId;
    booking.preferredProvider = workerId;
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
    }
    
    await booking.save();
    
    const updatedBooking = await Booking.findById(bookingId)
      .populate('userId', 'name lastname email phone')
      .populate('assignedWorker', 'fullName phone email rating')
      .populate('preferredProvider', 'fullName phone email');
    
    res.json({ message: "Worker assigned successfully", booking: updatedBooking });
  } catch (error) {
    console.error("Assign worker to booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllReferrals = async (req, res) => {
  try {
    await connectDB();
 
    const { status, page = 1, limit = 50 } = req.query;
 
    const query = {};
    if (status) query.status = status;
 
    const skip = (parseInt(page) - 1) * parseInt(limit);
 
    const referrals = await Referral.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
 
    const total = await Referral.countDocuments(query);
 
    res.json({
      referrals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get all referrals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
 
export const markCommissionPaid = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { commissionIndex } = req.body;

    const referral = await Referral.findById(id);
    if (!referral) return res.status(404).json({ message: "Referral not found" });

    const commission = referral.commissions?.[commissionIndex];
    if (!commission) return res.status(400).json({ message: "Invalid commission index" });

    commission.paid = true;
    commission.paidAt = new Date();
    await referral.save();

    res.json({ message: "Commission marked as paid", referral });
  } catch (error) {
    console.error("Mark commission paid error:", error);
    res.status(500).json({ message: "Server error" });
  }
};