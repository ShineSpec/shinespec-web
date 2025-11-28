import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, lastname, email, password, phone } = req.body;

    if (!name || !lastname || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

    const user = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone,
      verificationCode,
    });
    await user.save();

    console.log(`Verification code for ${email}: ${verificationCode}`);

    res.status(201).json({
      message: "Signup successful! Please verify your account.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: "Invalid verification code" });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.lastname = req.body.lastname || user.lastname;
    user.phone = req.body.phone || user.phone;
    user.receiveNewsletter = req.body.receiveNewsletter ?? user.receiveNewsletter;
    user.companyName = req.body.companyName || user.companyName;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SAVE NEW ADDRESS
export const saveAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { formattedAddress, unitNumber } = req.body;

    if (!formattedAddress) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If this is the first address, make it default
    const isFirstAddress = user.savedAddresses.length === 0;

    user.savedAddresses.push({
      formattedAddress,
      unitNumber: unitNumber || "",
      isDefault: isFirstAddress,
    });

    await user.save();

    res.json({
      message: "Address saved successfully",
      addresses: user.savedAddresses,
    });
  } catch (error) {
    console.error("Save address error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL ADDRESSES
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user.savedAddresses || []);
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// EDIT ADDRESS
export const editAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.savedAddresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Update fields
    if (updates.formattedAddress !== undefined) address.formattedAddress = updates.formattedAddress;
    if (updates.unitNumber !== undefined) address.unitNumber = updates.unitNumber;

    await user.save();

    res.json({ 
      message: "Address updated successfully", 
      address,
      addresses: user.savedAddresses 
    });
  } catch (err) {
    console.error("Edit address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressToDelete = user.savedAddresses.id(addressId);
    if (!addressToDelete) return res.status(404).json({ message: "Address not found" });

    const wasDefault = addressToDelete.isDefault;

    // Remove the address
    user.savedAddresses = user.savedAddresses.filter(
      (a) => a._id.toString() !== addressId
    );

    // If we deleted the default address and there are still addresses left, make the first one default
    if (wasDefault && user.savedAddresses.length > 0) {
      user.savedAddresses[0].isDefault = true;
    }

    await user.save();

    res.json({ 
      message: "Address deleted successfully", 
      addresses: user.savedAddresses 
    });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SET DEFAULT ADDRESS
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if address exists
    const addressExists = user.savedAddresses.some(
      (addr) => addr._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Set all to false, then set the target to true
    user.savedAddresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    res.json({ 
      message: "Default address updated successfully", 
      addresses: user.savedAddresses 
    });
  } catch (err) {
    console.error("Set default error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE NEW BOOKING
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      serviceType,
      address,
      customTasks,
      hoursNeeded,
      frequency,
      recurringDays,
      preferredTimeSlot,
      preferredProvider,
      totalCost,
      scheduledDate,
      scheduledTime,
      notes
    } = req.body;

    if (!serviceType || !address || !hoursNeeded || !frequency) {
      return res.status(400).json({ 
        message: "Service type, address, hours, and frequency are required" 
      });
    }

    // Import Booking model dynamically (add at top of file: import Booking from "../models/Booking.js";)
    const Booking = (await import("../models/Booking.js")).default;

    const newBooking = new Booking({
      userId,
      serviceType,
      address,
      customTasks: customTasks || [],
      hoursNeeded,
      frequency,
      recurringDays: recurringDays || [],
      preferredTimeSlot: preferredTimeSlot || "",
      preferredProvider: preferredProvider || "auto-assign",
      totalCost,
      scheduledDate,
      scheduledTime,
      notes: notes || "",
      status: "pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const Booking = (await import("../models/Booking.js")).default;
    
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("assignedWorker", "fullName phone email");

    res.json(bookings || []);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE BOOKING
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const Booking = (await import("../models/Booking.js")).default;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    }).populate("assignedWorker", "fullName phone email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Get booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;
    const Booking = (await import("../models/Booking.js")).default;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only allow updating certain fields
    const allowedUpdates = [
      "customTasks",
      "hoursNeeded",
      "preferredTimeSlot",
      "scheduledDate",
      "scheduledTime",
      "notes"
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        booking[field] = updates[field];
      }
    });

    await booking.save();

    res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const Booking = (await import("../models/Booking.js")).default;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ 
        message: "Cannot cancel a completed booking" 
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// WORKER APPLICATION
export const applyAsWorker = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      fullName,
      nationality,
      idNumber,
      phone,
      email,
      country,
      province,
      city,
      streetAddress,
      suburb,
      postalCode,
      serviceTypes,
      workExperience,
      skills,
      qualifications,
      references,
      availability,
    } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ message: "Full name, phone, and email are required" });
    }

    const existingWorker = await Worker.findOne({ userId });
    if (existingWorker) {
      return res.status(400).json({ message: "You have already applied as a worker" });
    }

    const idDocument = req.files?.idDocument?.[0]?.path || "";
    const photoDocument = req.files?.photoDocument?.[0]?.path || "";
    const proofOfAddress = req.files?.proofOfAddress?.[0]?.path || "";
    const workPermit = req.files?.workPermit?.[0]?.path || "";
    const refugeeId = req.files?.refugeeId?.[0]?.path || "";

    const newWorker = new Worker({
      userId,
      fullName,
      nationality,
      idNumber,
      phone,
      email,
      country,
      province,
      city,
      streetAddress,
      suburb,
      postalCode,
      serviceTypes: serviceTypes ? JSON.parse(serviceTypes) : [],
      idDocument,
      photoDocument,
      proofOfAddress,
      workPermit,
      refugeeId,
      workExperience,
      skills,
      qualifications,
      references,
      availability: availability ? JSON.parse(availability) : [],
    });

    await newWorker.save();

    res.status(201).json({
      message: "Worker application submitted successfully",
      workerId: newWorker._id,
    });
  } catch (error) {
    console.error("Worker apply error:", error);
    res.status(500).json({ message: "Server error" });
  }
};