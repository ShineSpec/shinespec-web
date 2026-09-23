import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import { uploadToS3, deleteFromS3 } from "../config/s3Config.js";
import { connectDB } from "../lib/db.js";
import ServiceApplication from "../models/ServiceApplication.js";
import { sendWhatsAppMessage, generateVerificationCode } from "../services/whatsappService.js";
import Referral from "../models/Referral.js";
 

export const signup = async (req, res) => {
  try {
    await connectDB();

    const { name, lastname, email, password, phone, referralCode } = req.body;

    if (!name || !lastname || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // SMS VERIFICATION DISABLED - User is automatically verified
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone,
      // verificationCode: undefined, // Not needed
      // verificationCodeExpires: undefined, // Not needed
      // verificationMethod: 'sms', // Not needed
      isVerified: true, // Auto-verified since SMS is disabled
    });

    try {
      // SMS CODE DISABLED - Directly save user without SMS verification
      await newUser.save();

      // ── Link referral if user came via an agent's referral link ──
      if (req.body.referralCode) {
  try {
    console.log("🔍 Looking up referral code:", req.body.referralCode);

    const referral = await Referral.findOne({
      referralCode: req.body.referralCode,
      status: { $in: ["active", "pending"] },
    });

    console.log("🔍 Referral found:", referral ? `YES — status: ${referral.status}` : "NO — not found");

          if (referral) {
            newUser.referredBy = req.body.referralCode;
            newUser.referredByAgentId = referral._id;
            await newUser.save();

            referral.totalReferrals = (referral.totalReferrals || 0) + 1;
            await referral.save();

            console.log(
              `✅ User ${email} referred by agent ${referral.fullName} (${req.body.referralCode})`
            );
          }
        } catch (refError) {
          // Never block signup if referral linking fails
          console.error("Referral linking error:", refError.message);
        }
      }
      // ─────────────────────────────────────────────────────────────

      console.log(`✅ User created and auto-verified: ${email}`);

      res.status(201).json({
        message: "Signup successful! Your account is ready to use.",
        userId: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: true,
      });
    } catch (error) {
      console.error("User creation error:", error.message);
      return res.status(500).json({ 
        message: `Failed to create account. ${error.message}`,
        error: error.message 
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const login = async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // SMS VERIFICATION DISABLED - No verification check needed
    // All users are auto-verified at signup

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "14d" }
    );

    // Log token expiration for debugging
    const decoded = jwt.decode(token);
    console.log(`✅ Token issued with expiration: ${decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A'} (14 days from now)`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role || 'user',
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
    await connectDB();

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
    await connectDB();

    const userId = req.user.id;
    const { formattedAddress, unitNumber } = req.body;

    if (!formattedAddress) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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
    await connectDB();

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
    await connectDB();
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.savedAddresses.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

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
    await connectDB();
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressToDelete = user.savedAddresses.id(addressId);
    if (!addressToDelete) return res.status(404).json({ message: "Address not found" });

    const wasDefault = addressToDelete.isDefault;

    user.savedAddresses = user.savedAddresses.filter(
      (a) => a._id.toString() !== addressId
    );

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
    await connectDB();
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressExists = user.savedAddresses.some(
      (addr) => addr._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({ message: "Address not found" });
    }

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
    await connectDB();
    const userId = req.user.id;
    const {
      serviceType,
      address,
      customTasks,
      hoursNeeded,
      frequency,
      preferredProvider,
      totalCost, // FIX: Changed from totalAmount
      scheduledDate,
      scheduledTime,
      notes,
      payment,
      officeSpecialRequests,
      laundryBundle,
      eventSize,
      eventGuestCount,
      eventCleaningScope,
      eventPackage
    } = req.body;

    // Validation
    if (!serviceType || !address || !frequency) {
      return res.status(400).json({ 
        message: "Service type, address, and frequency are required" 
      });
    }

    // Hours are required for most services, but not for Event Cleaning and Laundry & Ironing
    if (serviceType !== 'Event Cleaning' && serviceType !== 'Laundry & Ironing' && !hoursNeeded) {
      return res.status(400).json({ 
        message: "Hours are required for this service type" 
      });
    }

    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({ 
        message: "Scheduled date and time are required" 
      });
    }

    // FIX: Validate totalCost
    if (!totalCost || totalCost <= 0) {
      return res.status(400).json({ 
        message: "Invalid booking cost" 
      });
    }

    const Booking = (await import("../models/Booking.js")).default;

    // Validate hours only if provided and not Event Cleaning/Laundry
    if (hoursNeeded && serviceType !== 'Event Cleaning' && serviceType !== 'Laundry & Ironing') {
    const hours = parseFloat(hoursNeeded);
    if (hours < 2 || hours > 8) {
      return res.status(400).json({ 
        message: "Hours must be between 2 and 8" 
      });
      }
    }

    // Determine worker assignment
    let assignedWorkerId = null;
    let preferredProviderValue = null; // Set to null instead of 'auto-assign'
    
    if (preferredProvider && preferredProvider !== 'auto-assign' && preferredProvider !== null) {
      const worker = await Worker.findById(preferredProvider);
      if (worker && worker.status === 'approved') {
        assignedWorkerId = preferredProvider;
        preferredProviderValue = preferredProvider;
      }
    }

    // Build address object
    const addressObject = {
      formattedAddress: address.formattedAddress,
      unitNumber: address.unitNumber || '',
    };
    
    if (address.addressId && /^[0-9a-f]{24}$/i.test(address.addressId)) {
      addressObject.addressId = address.addressId;
    } else {
      addressObject.addressId = null;
    }

    const newBooking = new Booking({
      userId,
      serviceType,
      address: addressObject,
      customTasks: customTasks || [],
      hoursNeeded: (serviceType === 'Event Cleaning' || serviceType === 'Laundry & Ironing') ? null : (hoursNeeded ? parseFloat(hoursNeeded) : null),
      frequency: frequency || 'one-time',
      preferredProvider: preferredProviderValue,
      assignedWorker: assignedWorkerId,
      totalCost: totalCost, // FIX: Use totalCost
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      notes: notes || "",
      status: "pending",
      laundryBundle: serviceType === 'Laundry & Ironing' ? laundryBundle : null,
      eventSize: serviceType === 'Event Cleaning' ? eventSize : null,
      eventGuestCount: serviceType === 'Event Cleaning' ? eventGuestCount : null,
      eventCleaningScope: serviceType === 'Event Cleaning' ? eventCleaningScope : null,
      eventPackage: serviceType === 'Event Cleaning' ? eventPackage : null,
      officeSpecialRequests: serviceType === 'Office Cleaning' ? {
        extraProviders: officeSpecialRequests?.extraProviders || false,
        highRiskAreas: officeSpecialRequests?.highRiskAreas || false,
        earlyMorning: officeSpecialRequests?.earlyMorning || false,
        afterHours: officeSpecialRequests?.afterHours || false,
        biohazard: officeSpecialRequests?.biohazard || false,
        customRequest: officeSpecialRequests?.customRequest || ''
      } : undefined,
      payment: {
        status: payment?.status || 'pending',
        method: payment?.method || 'payfast',
        transactionId: payment?.transactionId || null,
        paidAt: null
      }      
    });

    await newBooking.save();

    // Populate worker information if assigned
    let populatedBooking = newBooking;
    if (assignedWorkerId) {
      populatedBooking = await newBooking.populate([
        { path: 'assignedWorker', select: 'fullName phone email rating jobsCompleted photoDocument city province serviceTypes' },
        { path: 'preferredProvider', select: 'fullName phone email rating' }
      ]);
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    await connectDB();
    const Booking = (await import("../models/Booking.js")).default;
    
    const bookings = await Booking.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate(
        "preferredProvider", 
        "fullName phone email rating jobsCompleted photoDocument"
      )
      .lean();

    res.json(bookings || []);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE BOOKING
export const getBookingById = async (req, res) => {
  try {
    await connectDB();
    const { bookingId } = req.params;
    const Booking = (await import("../models/Booking.js")).default;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    })
      .populate("preferredProvider", "fullName phone email rating jobsCompleted photoDocument")
      .lean();

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
    await connectDB();
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

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ 
        message: `Cannot update a ${booking.status} booking` 
      });
    }

    const allowedUpdates = [
      "customTasks",
      "hoursNeeded",
      "preferredTimeSlot",
      "scheduledDate",
      "scheduledTime",
      "notes",
      "frequency"
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        if (field === 'hoursNeeded') {
          const hours = parseFloat(updates[field]);
          if (hours >= 2 && hours <= 8) {
            booking[field] = hours;
          }
        } else if (field === 'scheduledDate') {
          booking[field] = new Date(updates[field]);
        } else {
          booking[field] = updates[field];
        }
      }
    });

    await booking.save();

    const updatedBooking = await booking.populate(
      "preferredProvider",
      "fullName phone email rating"
    );

    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    await connectDB();
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

// WORKER APPLICATION WITH S3 UPLOAD
export const applyAsWorker = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user?.id;

    const {
      fullName,
      gender,
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
      workExperiences,
      selectedSkills,
      additionalSkills,
      availability,
    } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({ message: "Full name, phone, and email are required" });
    }

    const existingWorker = await Worker.findOne({ userId });
    if (existingWorker) {
      return res.status(400).json({ message: "You have already applied as a worker" });
    }

    let idDocumentUrl = "";
    let photoDocumentUrl = "";
    let proofOfAddressUrl = "";
    let workPermitUrl = "";
    let refugeeIdUrl = "";
    let qualificationsDocumentUrls = [];

    try {
      if (req.files?.idDocument?.[0]) {
        const file = req.files.idDocument[0];
        idDocumentUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files?.photoDocument?.[0]) {
        const file = req.files.photoDocument[0];
        photoDocumentUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files?.proofOfAddress?.[0]) {
        const file = req.files.proofOfAddress[0];
        proofOfAddressUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files?.workPermit?.[0]) {
        const file = req.files.workPermit[0];
        workPermitUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files?.refugeeId?.[0]) {
        const file = req.files.refugeeId[0];
        refugeeIdUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);
      }

      if (req.files?.qualificationsDocuments && req.files.qualificationsDocuments.length > 0) {
        for (const file of req.files.qualificationsDocuments) {
          const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
          qualificationsDocumentUrls.push(url);
        }
      }
    } catch (uploadError) {
      console.error("S3 upload error:", uploadError);
      return res.status(500).json({ message: "Failed to upload documents" });
    }

    const parsedWorkExperiences = workExperiences ? JSON.parse(workExperiences) : [];
    const formattedWorkExperience = parsedWorkExperiences
      .map((exp, index) => {
        let expText = `${index + 1}. ${exp.jobTitle || "Position"} at ${exp.employer || "Employer"} (${exp.duration || "Duration not specified"})\n   Responsibilities: ${exp.responsibilities || "Not specified"}`;
        if (exp.reference && (exp.reference.name || exp.reference.phone)) {
          expText += `\n   Reference: ${exp.reference.name || ""}${exp.reference.relationship ? ` (${exp.reference.relationship})` : ""}${exp.reference.phone ? ` - ${exp.reference.phone}` : ""}${exp.reference.email ? ` - ${exp.reference.email}` : ""}`;
        }
        return expText;
      })
      .join("\n\n");

    const referencesList = parsedWorkExperiences
      .filter(exp => exp.reference && (exp.reference.name || exp.reference.phone))
      .map((exp, index) => {
        const ref = exp.reference;
        return `Reference ${index + 1}: ${ref.name || ""}${ref.relationship ? ` (${ref.relationship})` : ""}${ref.phone ? ` - ${ref.phone}` : ""}${ref.email ? ` - ${ref.email}` : ""}`;
      });
    const references = referencesList.length > 0 ? referencesList.join("\n") : "No references provided";

    const parsedSelectedSkills = selectedSkills ? JSON.parse(selectedSkills) : [];
    const allSkills = additionalSkills 
      ? [...parsedSelectedSkills, additionalSkills].join(", ")
      : parsedSelectedSkills.join(", ");

    const newWorker = new Worker({
      userId,
      fullName,
      gender: gender || null,
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
      idDocument: idDocumentUrl,
      photoDocument: photoDocumentUrl,
      proofOfAddress: proofOfAddressUrl,
      workPermit: workPermitUrl,
      refugeeId: refugeeIdUrl,
      workExperience: formattedWorkExperience || "No work experience provided",
      skills: allSkills,
      qualificationsDocuments: qualificationsDocumentUrls,
      references,
      availability: availability ? JSON.parse(availability) : [],
    });

    await newWorker.save();

    await User.findByIdAndUpdate(
      userId,
      {
        appliedAsWorker: true,
        workerApplicationDate: new Date(),
        gender: gender || undefined // Update user's gender if provided
      },
      { new: true }
    );

    console.log(`✅ User marked as applied and worker created: ${email}`);

    res.status(201).json({
      message: "Worker application submitted successfully",
      workerId: newWorker._id,
    });
  } catch (error) {
    console.error("Worker apply error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkerApplicationStats = async (req, res) => {
  try {
    await connectDB();
    
    const totalUsers = await User.countDocuments({});
    const appliedUsers = await User.countDocuments({ appliedAsWorker: true });
    const notAppliedUsers = totalUsers - appliedUsers;
    
    res.json({
      totalUsers,
      appliedUsers,
      notAppliedUsers,
      appliedPercentage: ((appliedUsers / totalUsers) * 100).toFixed(2) + '%'
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsersWhoAppliedAsWorker = async (req, res) => {
  try {
    await connectDB();
    
    const users = await User.find({ appliedAsWorker: true })
      .select("name lastname email phone appliedAsWorker workerApplicationDate")
      .sort({ workerApplicationDate: -1 })
      .lean();
    
    res.json(users);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsersWhoHaventApplied = async (req, res) => {
  try {
    await connectDB();
    
    const users = await User.find({ appliedAsWorker: false })
      .select("name lastname email phone appliedAsWorker createdAt")
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(users);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET WORKER PROFILE
export const getWorkerProfile = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;
    const worker = await Worker.findOne({ userId });
    
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }
    
    res.json(worker);
  } catch (error) {
    console.error("Get worker profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET WORKER BOOKINGS
export const getWorkerBookings = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;
    const worker = await Worker.findOne({ userId });
    
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const Booking = (await import("../models/Booking.js")).default;
    
    // Find bookings assigned to this worker
    const bookings = await Booking.find({
      $or: [
        { assignedWorker: worker._id },
        { preferredProvider: worker._id }
      ]
    })
    .sort({ scheduledDate: 1 })
    .populate("userId", "name lastname phone email")
    .lean();

    res.json(bookings);
  } catch (error) {
    console.error("Get worker bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE BOOKING STATUS
export const updateBookingStatus = async (req, res) => {
  try {
    await connectDB();
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const Booking = (await import("../models/Booking.js")).default;
    
    const booking = await Booking.findOne({
      _id: bookingId,
      $or: [
        { assignedWorker: worker._id },
        { preferredProvider: worker._id }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    // Validate status transitions
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["in-progress", "cancelled"],
      "in-progress": ["completed", "cancelled"],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${booking.status} to ${status}` 
      });
    }

    booking.status = status;
    if (status === "completed") {
      booking.completedAt = new Date();
    }
    
    await booking.save();

    res.json({
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE WORKER PROFILE
export const updateWorkerProfile = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;
    const { fullName, phone, email, city, province, streetAddress, skills } = req.body;

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Update allowed fields only
    if (fullName) worker.fullName = fullName;
    if (phone) worker.phone = phone;
    if (email) worker.email = email;
    if (city) worker.city = city;
    if (province) worker.province = province;
    if (streetAddress) worker.streetAddress = streetAddress;
    if (skills) worker.skills = skills;

    await worker.save();

    res.json({
      message: "Worker profile updated successfully",
      worker
    });
  } catch (error) {
    console.error("Update worker profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE WORKER AVAILABILITY
export const updateWorkerAvailability = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: "Availability must be an array" });
    }

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.availability = availability;
    await worker.save();

    res.json({
      message: "Availability updated successfully",
      availability: worker.availability
    });
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET WORKER STATS
export const getWorkerStats = async (req, res) => {
  try {
    await connectDB();
    const userId = req.user.id;
    const worker = await Worker.findOne({ userId });
    
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const Booking = (await import("../models/Booking.js")).default;
    
    // Calculate stats
    const totalBookings = await Booking.countDocuments({
      $or: [
        { assignedWorker: worker._id },
        { preferredProvider: worker._id }
      ]
    });

    const completedBookings = await Booking.countDocuments({
      $or: [
        { assignedWorker: worker._id },
        { preferredProvider: worker._id }
      ],
      status: "completed"
    });

    const pendingBookings = await Booking.countDocuments({
      $or: [
        { assignedWorker: worker._id },
        { preferredProvider: worker._id }
      ],
      status: { $in: ["pending", "confirmed"] }
    });

    res.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      rating: worker.rating,
      jobsCompleted: worker.jobsCompleted,
      reviewsCount: worker.reviews?.length || 0,
      serviceTypes: worker.serviceTypes
    });
  } catch (error) {
    console.error("Get worker stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to clean and format AI explanation
const cleanAndFormatExplanation = (text) => {
  // Remove markdown formatting
  let cleaned = text
    // Remove bold markers (**text**)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove italic markers (*text*)
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove numbered lists (1., 2., etc.)
    .replace(/^\d+\.\s+/gm, '')
    // Remove heading markers (###, ##, #)
    .replace(/^#+\s+/gm, '')
    // Remove bullet points (-, •, *)
    .replace(/^[-•*]\s+/gm, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned;
};


// AI EXPLANATION FOR WORKER SELECTION
export const generateWorkerExplanation = async (req, res) => {
  try {
    await connectDB();
    const { workerData, bookingDetails } = req.body;

    if (!workerData || !bookingDetails) {
      return res.status(400).json({
        message: "Worker data and booking details are required",
      });
    }

    // Replace OpenAI with Mistral
    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    let explanation = "";

    if (MISTRAL_API_KEY) {
      try {
        const prompt = `You are a helpful assistant for a service booking platform. Explain why ${workerData.fullName} is the perfect service provider for this booking request.

Worker Information:
- Name: ${workerData.fullName}
- Rating: ${workerData.rating}% (out of 100%)
- Jobs Completed: ${workerData.jobsCompleted || 0} successful jobs
- Services Offered: ${workerData.serviceTypes?.join(", ") || "N/A"}
- Location: ${workerData.city || "N/A"}, ${workerData.province || "N/A"}
- Skills & Expertise: ${workerData.skills || "Professional skills"}
- Client Reviews: ${workerData.reviews?.length || 0} ${
          workerData.reviews?.length === 1 ? "review" : "reviews"
        }
${
  workerData.reviews && workerData.reviews.length > 0
    ? `- Sample Review: "${
        workerData.reviews[0]?.text || "Positive feedback"
      }"`
    : ""
}

Booking Details:
- Service Type Requested: ${bookingDetails.serviceType}
- Hours Needed: ${bookingDetails.hoursNeeded} hours
- Scheduled Date: ${bookingDetails.scheduledDate || "Not specified"}
- Scheduled Time: ${bookingDetails.scheduledTime || "Not specified"}
- Service Location: ${bookingDetails.address || "Not specified"}${
          bookingDetails.city ? `, ${bookingDetails.city}` : ""
        }${
          bookingDetails.province ? `, ${bookingDetails.province}` : ""
        }

Provide a comprehensive, friendly explanation (4–6 sentences) explaining why ${
          workerData.fullName
        } is the perfect service provider for this ${bookingDetails.serviceType} booking. 

Requirements:
- Start with a warm, personalized greeting
- Highlight their ${workerData.rating}% rating and ${
          workerData.jobsCompleted || 0
        } completed jobs to show reliability
- Explain how their services (${workerData.serviceTypes?.join(", ") || "professional services"}) specifically match this ${bookingDetails.serviceType} request
- Mention location convenience: they're based in ${workerData.city || "your area"}${bookingDetails.city && bookingDetails.city !== workerData.city ? `, close to your service location in ${bookingDetails.city}` : ""}
- Reference their expertise: ${workerData.skills || "professional skills"}
- If available, mention their ${workerData.reviews?.length || 0} ${workerData.reviews?.length === 1 ? "review" : "reviews"} showing client satisfaction
- End with confidence that they'll deliver excellent service for this ${bookingDetails.hoursNeeded || ""} hour booking

Write naturally, as if you're personally recommending this worker to a friend. Be specific about why they're perfect for THIS particular booking.`;

        // Mistral API structure
        const response = await axios.post(
          "https://api.mistral.ai/v1/chat/completions",
          {
            model: "mistral-large-latest", // Mistral's best model
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that explains worker selections for a service booking platform. Be concise, friendly, and professional. Write in a conversational, persuasive tone that helps users understand why this worker is perfect for their specific booking.",
              },
              { role: "user", content: prompt },
            ],
            max_tokens: 300,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${MISTRAL_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Extract explanation from API response
        const aiExplanation = response.data?.choices?.[0]?.message?.content || "";
        explanation = cleanAndFormatExplanation(aiExplanation);
      } catch (aiError) {
        console.error("Mistral API error:", aiError.message);

        explanation = generateRuleBasedExplanation(workerData, bookingDetails);
      }
    } else {
      explanation = generateRuleBasedExplanation(workerData, bookingDetails);
    }

    // Ensure we always return an explanation
    if (!explanation || explanation.trim().length === 0) {
      explanation = generateRuleBasedExplanation(workerData, bookingDetails);
    }

    res.json({ explanation });
  } catch (error) {
    console.error("Generate explanation error:", error);
    // Always return a fallback explanation even on error
    try {
      const fallbackExplanation = generateRuleBasedExplanation(
        req.body.workerData || {},
        req.body.bookingDetails || {}
      );
      res.json({ explanation: fallbackExplanation });
    } catch (fallbackError) {
      console.error("Fallback explanation error:", fallbackError);
      res.status(500).json({ 
        message: "Server error",
        explanation: "We've selected this worker based on their qualifications and experience. They're ready to provide excellent service for your booking."
      });
    }
  }
};



// AI SERVICE MATCHER - Match user description to service details
export const aiServiceMatch = async (req, res) => {
  try {
    await connectDB();
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    if (!MISTRAL_API_KEY) {
      // Fallback: basic rule-based matching
      const matchResult = generateRuleBasedServiceMatch(description);
      return res.json(matchResult);
    }

    try {
      // Get current date for context
      const currentDate = new Date();
      const todayStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const tomorrowDate = new Date(currentDate);
      tomorrowDate.setDate(currentDate.getDate() + 1);
      const tomorrowStr = tomorrowDate.toISOString().split('T')[0]; // YYYY-MM-DD

      const prompt = `Analyze this customer request for a cleaning service and extract the following information in JSON format:
1. serviceType: One of these exact values - "Indoor Services", "Outdoor Services", "Office Cleaning", "Event Cleaning", "Moving Cleaning", "Laundry & Ironing"
2. hoursNeeded: A number between 2 and 8 representing estimated hours needed
3. urgency: One of "urgent", "normal", or "flexible" based on keywords like "urgent", "asap", "soon", etc.
4. location: Extract any location/area mentioned, or null if not mentioned
5. scheduledDate: Extract date mentioned. IMPORTANT: Today is ${todayStr} (${currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}). If user says "today", return "${todayStr}". If user says "tomorrow", return "${tomorrowStr}". For day names (Monday, Tuesday, etc.), calculate the next occurrence from today. For specific dates like "December 28", use current year (${currentDate.getFullYear()}) unless year is mentioned. Return as YYYY-MM-DD format or null if not mentioned.
6. scheduledTime: Extract time mentioned (format: "HH:MM - HH:MM" like "09:00 - 09:30", "14:00 - 14:30") or null if not mentioned. Look for: "morning" (use "09:00 - 09:30"), "afternoon" (use "14:00 - 14:30"), "evening" (use "11:30 - 12:00"), "9am" (use "09:00 - 09:30"), "2pm" (use "14:00 - 14:30"), etc. Must match one of these exact formats: "07:00 - 07:30", "07:30 - 08:00", "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00"
7. extraTasks: Array of task IDs mentioned. Common tasks: "windows", "laundry", "oven", "inside-fridge", "inside-cabinets", "beds", "ironing", etc. Return empty array [] if none mentioned.

Customer request: "${description}"

Respond ONLY with valid JSON in this exact format:
{
  "serviceType": "Indoor Services",
  "hoursNeeded": 4,
  "urgency": "normal",
  "location": null,
  "scheduledDate": null,
  "scheduledTime": null,
  "extraTasks": []
}

Guidelines:
- serviceType: "Indoor Services" for general home cleaning, "Outdoor Services" for gardening/yard work/pool cleaning/exterior cleaning, "Office Cleaning" for workplaces, "Event Cleaning" for parties/events, "Moving Cleaning" for moving in/out, "Laundry & Ironing" for laundry services.
- hoursNeeded: Estimate based on context. Small spaces = 2-3 hours, medium = 4-5 hours, large = 6-8 hours. Party cleanup or deep cleaning usually needs more hours.
- urgency: "urgent" if words like urgent, asap, immediately, today, right away. "normal" for standard requests. "flexible" if they mention flexibility.
- location: Extract city, area, or neighborhood if mentioned, otherwise null.
- scheduledDate: Use the current date context provided above. Today is ${todayStr}, tomorrow is ${tomorrowStr}. Return as YYYY-MM-DD or null if unclear.
- scheduledTime: Parse time mentions and map to available time slots. "morning" = "09:00 - 09:30", "afternoon" = "14:00 - 14:30", "evening" = "11:30 - 12:00". "9am" = "09:00 - 09:30", "2pm" = "14:00 - 14:30". Must be one of the exact formats listed above. Return null if unclear.
- extraTasks: Match mentioned tasks to common IDs: windows=windows, laundry/ironing=laundry, oven=oven, fridge=inside-fridge, cabinets=inside-cabinets, bed/beds=beds, ironing=ironing, etc. Return array of matching IDs or empty array.

Return ONLY the JSON object, no additional text.`;

      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-large-latest",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that analyzes customer service requests and extracts structured booking information. Always respond with valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 200,
          temperature: 0.3, // Lower temperature for more consistent structured output
        },
        {
          headers: {
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data?.choices?.[0]?.message?.content || "";
      
      // Try to extract JSON from the response
      let matchResult;
      try {
        // Remove markdown code blocks if present
        const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        matchResult = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        // Fallback to rule-based matching
        matchResult = generateRuleBasedServiceMatch(description);
      }

      // Validate and sanitize the response
      const validServiceTypes = ['Indoor Services', 'Outdoor Services', 'Office Cleaning', 'Event Cleaning', 'Moving Cleaning', 'Laundry & Ironing'];
      const validUrgency = ['urgent', 'normal', 'flexible'];

      // Check description for service type hints if AI didn't match correctly
      let serviceType = validServiceTypes.includes(matchResult.serviceType) 
        ? matchResult.serviceType 
        : 'Indoor Services';
      
      // Override service type based on keywords in description (more reliable for specific services)
      const descriptionLower = description.toLowerCase();
      if (descriptionLower.includes('garden') || descriptionLower.includes('gardener') || descriptionLower.includes('yard') || 
          descriptionLower.includes('pool') || descriptionLower.includes('outdoor') || descriptionLower.includes('exterior') ||
          descriptionLower.includes('patio') || descriptionLower.includes('driveway') || descriptionLower.includes('fence')) {
        serviceType = 'Outdoor Services';
      } else if (descriptionLower.includes('office') || descriptionLower.includes('workplace') || descriptionLower.includes('business')) {
        serviceType = 'Office Cleaning';
      } else if (descriptionLower.includes('event') || descriptionLower.includes('party') || descriptionLower.includes('wedding') || descriptionLower.includes('celebration')) {
        serviceType = 'Event Cleaning';
      } else if (descriptionLower.includes('moving') || descriptionLower.includes('move in') || descriptionLower.includes('move out')) {
        serviceType = 'Moving Cleaning';
      } else if (descriptionLower.includes('laundry') || descriptionLower.includes('ironing') || descriptionLower.includes('washing')) {
        serviceType = 'Laundry & Ironing';
      }

      let hoursNeeded = parseInt(matchResult.hoursNeeded) || 4;
      if (hoursNeeded < 2) hoursNeeded = 2;
      if (hoursNeeded > 8) hoursNeeded = 8;

      const urgency = validUrgency.includes(matchResult.urgency) 
        ? matchResult.urgency 
        : 'normal';

      const location = matchResult.location || null;
      
      // Parse date if provided - handle "today", "tomorrow", and validate date is reasonable
      let scheduledDate = null;
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // Normalize to start of day
      
      if (matchResult.scheduledDate) {
        try {
          // Check if it's a relative date keyword that needs server-side calculation
          const dateStr = matchResult.scheduledDate.toLowerCase().trim();
          
          if (dateStr === 'today' || dateStr === todayDate.toISOString().split('T')[0]) {
            scheduledDate = todayDate.toISOString().split('T')[0];
          } else if (dateStr === 'tomorrow') {
            const tomorrowCalc = new Date(todayDate);
            tomorrowCalc.setDate(todayDate.getDate() + 1);
            scheduledDate = tomorrowCalc.toISOString().split('T')[0];
          } else {
            // Parse the date string
            const date = new Date(matchResult.scheduledDate);
            if (!isNaN(date.getTime())) {
              const parsedDateStr = date.toISOString().split('T')[0];
              
              // Validate the date is not too far in the past (more than 1 day old)
              const oneDayAgo = new Date(todayDate);
              oneDayAgo.setDate(todayDate.getDate() - 1);
              
              if (date >= oneDayAgo) {
                scheduledDate = parsedDateStr;
              } else {
                console.error('Date is too far in the past, ignoring:', parsedDateStr);
                scheduledDate = null;
              }
            }
          }
        } catch (e) {
          console.error('Date parsing error:', e);
        }
      }
      
      // Also check description for relative dates and override if needed (more reliable)
      if (!scheduledDate) {
        if (descriptionLower.includes('tomorrow')) {
          const tomorrowCalc = new Date(todayDate);
          tomorrowCalc.setDate(todayDate.getDate() + 1);
          scheduledDate = tomorrowCalc.toISOString().split('T')[0];
        } else if (descriptionLower.includes('today')) {
          scheduledDate = todayDate.toISOString().split('T')[0];
        }
      } else if (descriptionLower.includes('tomorrow')) {
        // Double-check if description says tomorrow, recalculate to be sure
        const tomorrowCalc = new Date(todayDate);
        tomorrowCalc.setDate(todayDate.getDate() + 1);
        scheduledDate = tomorrowCalc.toISOString().split('T')[0];
      }
      
      // Parse time if provided (ensure it matches available time slot format)
      let scheduledTime = null;
      if (matchResult.scheduledTime) {
        // Validate time format matches available slots: "HH:MM - HH:MM"
        const validTimeSlots = [
          '07:00 - 07:30', '07:30 - 08:00', '08:00 - 08:30', '08:30 - 09:00',
          '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
          '11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30', '12:30 - 13:00'
        ];
        // Check if it's already in correct format
        if (validTimeSlots.includes(matchResult.scheduledTime)) {
          scheduledTime = matchResult.scheduledTime;
        } else {
          // Try to map to closest slot if in simple format (e.g., "09:00")
          const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (timePattern.test(matchResult.scheduledTime)) {
            // Find closest matching slot
            const [hours, mins] = matchResult.scheduledTime.split(':').map(Number);
            const targetMinutes = hours * 60 + mins;
            let closestSlot = validTimeSlots[0];
            let minDiff = Infinity;
            validTimeSlots.forEach(slot => {
              const [start] = slot.split(' - ');
              const [slotHours, slotMins] = start.split(':').map(Number);
              const slotMinutes = slotHours * 60 + slotMins;
              const diff = Math.abs(targetMinutes - slotMinutes);
              if (diff < minDiff) {
                minDiff = diff;
                closestSlot = slot;
              }
            });
            scheduledTime = closestSlot;
          }
        }
      }
      
      // Validate extra tasks array
      const extraTasks = Array.isArray(matchResult.extraTasks) ? matchResult.extraTasks : [];

      res.json({
        serviceType,
        hoursNeeded,
        urgency,
        location,
        scheduledDate,
        scheduledTime,
        extraTasks,
      });
    } catch (aiError) {
      console.error("Mistral API error:", aiError.message);
      // Fallback to rule-based matching
      const matchResult = generateRuleBasedServiceMatch(description);
      res.json(matchResult);
    }
  } catch (error) {
    console.error("AI Service Match error:", error);
    // Always return a fallback response
    res.json({
      serviceType: 'Indoor Services',
      hoursNeeded: 4,
      urgency: 'normal',
      location: null,
      scheduledDate: null,
      scheduledTime: null,
      extraTasks: [],
    });
  }
};

// Rule-based service matching (fallback)
const generateRuleBasedServiceMatch = (description) => {
  const desc = description.toLowerCase();
  
  let serviceType = 'Indoor Services';
  let hoursNeeded = 4;
  let urgency = 'normal';
  let location = null;

  // Detect service type - check for outdoor/gardening services first (more specific)
  if (desc.includes('garden') || desc.includes('gardener') || desc.includes('yard') || 
      desc.includes('pool') || desc.includes('outdoor') || desc.includes('exterior') ||
      desc.includes('patio') || desc.includes('driveway') || desc.includes('fence')) {
    serviceType = 'Outdoor Services';
  } else if (desc.includes('office') || desc.includes('workplace') || desc.includes('business')) {
    serviceType = 'Office Cleaning';
  } else if (desc.includes('event') || desc.includes('party') || desc.includes('wedding') || desc.includes('celebration')) {
    serviceType = 'Event Cleaning';
  } else if (desc.includes('moving') || desc.includes('move in') || desc.includes('move out')) {
    serviceType = 'Moving Cleaning';
  } else if (desc.includes('laundry') || desc.includes('ironing') || desc.includes('washing')) {
    serviceType = 'Laundry & Ironing';
  }

  // Detect urgency
  if (desc.includes('urgent') || desc.includes('asap') || desc.includes('immediately') || desc.includes('today') || desc.includes('right away')) {
    urgency = 'urgent';
  } else if (desc.includes('flexible') || desc.includes('whenever') || desc.includes('no rush')) {
    urgency = 'flexible';
  }

  // Estimate hours based on keywords
  if (desc.includes('small') || desc.includes('apartment') || desc.includes('studio')) {
    hoursNeeded = 3;
  } else if (desc.includes('large') || desc.includes('big') || desc.includes('deep clean') || desc.includes('thorough')) {
    hoursNeeded = 6;
  } else if (desc.includes('party') || desc.includes('messy') || desc.includes('very messy')) {
    hoursNeeded = 5;
  }

  // Try to extract location (basic - could be improved)
  const locationKeywords = ['johannesburg', 'joburg', 'sandton', 'pretoria', 'cape town', 'durban'];
  for (const keyword of locationKeywords) {
    if (desc.includes(keyword)) {
      location = keyword;
      break;
    }
  }

  // Extract date (basic parsing)
  let scheduledDate = null;
  const today = new Date();
  if (desc.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    scheduledDate = tomorrow.toISOString().split('T')[0];
  } else if (desc.includes('today')) {
    scheduledDate = today.toISOString().split('T')[0];
  }

  // Extract time (basic parsing) - match to available time slots
  let scheduledTime = null;
  if (desc.includes('morning') || desc.match(/\b(9|10|11)\s*(am|:00)/)) {
    scheduledTime = '09:00 - 09:30'; // Default to first morning slot
  } else if (desc.includes('afternoon') || desc.match(/\b(1|2|3|13|14|15)\s*(pm|:00)/)) {
    scheduledTime = '12:00 - 12:30'; // Default to closest afternoon slot (since 14:00 not available, use 12:00)
  } else if (desc.includes('evening') || desc.match(/\b(5|6|17|18)\s*(pm|:00)/)) {
    scheduledTime = '12:30 - 13:00'; // Default to latest available slot (evening slots not available)
  }

  // Extract extra tasks
  const extraTasks = [];
  if (desc.includes('window')) extraTasks.push('windows');
  if (desc.includes('laundry') || desc.includes('washing')) extraTasks.push('laundry');
  if (desc.includes('oven')) extraTasks.push('oven');
  if (desc.includes('fridge') || desc.includes('refrigerator')) extraTasks.push('inside-fridge');
  if (desc.includes('cabinet')) extraTasks.push('inside-cabinets');
  if (desc.includes('bed')) extraTasks.push('beds');
  if (desc.includes('iron')) extraTasks.push('ironing');

  return {
    serviceType,
    hoursNeeded,
    urgency,
    location,
    scheduledDate,
    scheduledTime,
    extraTasks,
  };
};

// Chatbot general questions handler
export const chatbotQuery = async (req, res) => {
  try {
    await connectDB();
    const { question, conversationHistory } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

    if (!MISTRAL_API_KEY) {
      // Fallback response without AI
      return res.json({
        answer: "I'm currently unable to process your question. Please contact our support team for assistance.",
      });
    }

    try {
      // Build conversation context
      const systemMessage = `You are a helpful customer service assistant for ShineSpec, a professional cleaning and home services platform. 

About ShineSpec:
- ShineSpec is a service booking platform that connects customers with trusted service providers
- Services offered include: Indoor Services (home cleaning), Outdoor Services (gardening, pool cleaning), Office Cleaning, Event Cleaning, Moving Cleaning, Laundry & Ironing, Mom's Helper, and Elder Care
- ShineSpec focuses on quality, reliability, and customer satisfaction
- Service providers are vetted and rated by customers
- The platform offers flexible booking options and various payment methods

IMPORTANT CONTACT INFORMATION - USE THESE EXACT DETAILS:
- Booking page URL: www.shinespec.com/services (NOT https://shinespec.com/book)
- Phone number: +27 62 145 7460
- Support email: support@shinespec.com

Your role:
- Answer questions about ShineSpec's services, booking process, pricing, and policies
- Be friendly, helpful, and professional
- If asked about booking or creating a booking, ALWAYS direct users to: https://www.shinespec.com/services
- If asked about contact information, ALWAYS provide: Phone: +27 62 145 7460, Email: support@shinespec.com
- If you don't know something, admit it and suggest contacting support at support@shinespec.com or +27 62 145 7460
- Keep responses concise but informative
- Use a conversational, warm tone

FORMATTING RULES - CRITICAL:
- Write in plain text only - NO markdown formatting whatsoever
- DO NOT use asterisks (*), underscores (_), hashtags (#), or any markdown syntax
- DO NOT use bold text (**text**), italics (*text*), or markdown bullet points (- or *)
- Write naturally as if speaking to someone in person
- Use simple line breaks (press Enter) to separate paragraphs, not markdown
- If listing items, write them naturally in sentences, not as bullet lists
- Example CORRECT format: "Our pricing starts at R290 for a 3-hour indoor cleaning service. For larger spaces, we offer 4-8 hour options with prices ranging from R305 to R365. Would you like to book a service?"
- Example INCORRECT format: "Our pricing: **R290** (basic) or - **R365** (premium)" - this is wrong, use plain text
- Always write in plain, natural language without any special formatting characters

FORMATTING RULES - CRITICAL:
- Write in plain text only - NO markdown formatting
- DO NOT use asterisks (*), underscores (_), hashtags (#), or any markdown syntax
- DO NOT use bold text, italics, or bullet points with markdown
- Use simple line breaks and natural text formatting
- Write naturally as if speaking to a friend, but keep it professional
- If listing items, use simple numbered or lettered lists in plain text (1. 2. 3. or a. b. c.)
- Never use ** for bold or - for bullets - just write normally
- Example of CORRECT format: "Our pricing starts at R290 for a 3-hour indoor cleaning service. For larger spaces, we offer 4-8 hour options with prices ranging from R305 to R365. Would you like to book a service?"
- Example of INCORRECT format: "Our pricing: **$45** (basic) or - **$75** (deep clean)" - this is wrong, use plain text

CRITICAL SECURITY AND CONFIDENTIALITY RULES:
- NEVER share confidential information including:
  * Internal company processes, strategies, or business plans
  * Employee personal information, salaries, or internal communications
  * Customer personal data, booking details, or payment information
  * Internal system architecture, database structures, or technical implementation details
  * API keys, passwords, security tokens, or authentication mechanisms
  * Financial data, revenue figures, or proprietary business metrics
  * Legal agreements, contracts, or sensitive business relationships
  * Any information not publicly available on the website
- If asked about confidential information, politely decline and say: "I don't have access to that information. Please contact our support team for assistance."
- Only share information that is publicly available or appropriate for customer service inquiries
- Never make up or guess confidential information
- Redirect sensitive requests to appropriate support channels`;

      const messages = [
        { role: "system", content: systemMessage },
      ];

      // Add conversation history if provided
      if (conversationHistory && Array.isArray(conversationHistory)) {
        conversationHistory.slice(-10).forEach((msg) => {
          if (msg.sender === 'user') {
            messages.push({ role: "user", content: msg.text });
          } else if (msg.sender === 'bot') {
            messages.push({ role: "assistant", content: msg.text });
          }
        });
      }

      // Add current question
      messages.push({ role: "user", content: question });

      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-large-latest",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let aiResponse = response.data?.choices?.[0]?.message?.content || "";
      
      // Clean markdown formatting from response to ensure plain text
      aiResponse = aiResponse
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(?!\*)([^*]+?)(?<!\*)\*/g, '$1') // Remove italic *text* (but not **)
        .replace(/__(.*?)__/g, '$1') // Remove bold __text__
        .replace(/_(.*?)_/g, '$1') // Remove italic _text_
        .replace(/^[-*+]\s+/gm, '') // Remove markdown bullet points at start of line
        .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
        .replace(/^#+\s+/gm, '') // Remove markdown headers
        .replace(/`([^`]+)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
        .trim();
      
      res.json({
        answer: aiResponse,
      });
    } catch (aiError) {
      console.error("Mistral API error:", aiError.message);
      res.json({
        answer: "I'm having trouble processing your question right now. Please try again later or contact our support team.",
      });
    }
  } catch (error) {
    console.error("Chatbot query error:", error);
    res.status(500).json({
      message: "Server error",
      answer: "I'm experiencing technical difficulties. Please try again later.",
    });
  }
};

// Rule-based explanation generator (fallback)
const generateRuleBasedExplanation = (workerData, bookingDetails) => {
  const reasons = [];
  const locationMatch = [];
  
  // Rating-based reasons
  if (workerData.rating >= 95) {
    reasons.push(`an exceptional ${workerData.rating}% rating`);
  } else if (workerData.rating >= 90) {
    reasons.push(`a strong ${workerData.rating}% rating`);
  } else if (workerData.rating >= 85) {
    reasons.push(`a good ${workerData.rating}% rating`);
  }
  
  // Experience-based reasons
  if (workerData.jobsCompleted > 100) {
    reasons.push(`extensive experience with over ${workerData.jobsCompleted} successfully completed jobs`);
  } else if (workerData.jobsCompleted > 50) {
    reasons.push(`a solid track record with ${workerData.jobsCompleted} completed jobs`);
  } else if (workerData.jobsCompleted > 20) {
    reasons.push(`proven experience with ${workerData.jobsCompleted} completed jobs`);
  } else if (workerData.jobsCompleted > 0) {
    reasons.push(`experience with ${workerData.jobsCompleted} completed ${workerData.jobsCompleted === 1 ? 'job' : 'jobs'}`);
  }
  
  // Service match reasons
  const workerServices = workerData.serviceTypes || [];
  const requiredService = bookingDetails.serviceType || '';
  if (workerServices.length > 0) {
    const matchingServices = workerServices.filter(s => 
      requiredService.toLowerCase().includes(s.toLowerCase().split(' ')[0]) ||
      s.toLowerCase().includes(requiredService.toLowerCase().split(' ')[0])
    );
    if (matchingServices.length > 0) {
      reasons.push(`specialized expertise in ${matchingServices.slice(0, 2).join(' and ')}`);
    } else {
      reasons.push(`expertise in ${workerServices.slice(0, 2).join(' and ')}`);
    }
  }
  
  // Skills-based reasons
  if (workerData.skills && workerData.skills.length > 20) {
    const skillsList = workerData.skills.split(',').slice(0, 3).join(', ');
    reasons.push(`relevant skills including ${skillsList}`);
  }
  
  // Location-based reasons
  if (workerData.city && workerData.province) {
    if (bookingDetails.city && bookingDetails.city.toLowerCase() === workerData.city.toLowerCase()) {
      locationMatch.push(`conveniently located in the same city (${workerData.city})`);
    } else if (bookingDetails.province && bookingDetails.province.toLowerCase() === workerData.province.toLowerCase()) {
      locationMatch.push(`located in the same province (${workerData.province})`);
    } else {
      locationMatch.push(`serving the ${workerData.city}, ${workerData.province} area`);
    }
  }
  
  // Review-based reasons
  if (workerData.reviews && workerData.reviews.length > 10) {
    reasons.push(`consistently positive feedback from ${workerData.reviews.length} satisfied clients`);
  } else if (workerData.reviews && workerData.reviews.length > 0) {
    reasons.push(`positive reviews from ${workerData.reviews.length} ${workerData.reviews.length === 1 ? 'client' : 'clients'}`);
  }
  
  // Build comprehensive explanation
  let explanation = `We selected ${workerData.fullName} as your perfect service provider because they have `;
  
  if (reasons.length > 0) {
    if (reasons.length === 1) {
      explanation += reasons[0];
    } else if (reasons.length === 2) {
      explanation += `${reasons[0]} and ${reasons[1]}`;
    } else {
      explanation += `${reasons.slice(0, -1).join(', ')}, and ${reasons[reasons.length - 1]}`;
    }
  }
  
  if (locationMatch.length > 0) {
    explanation += `. ${locationMatch[0]}`;
  }
  
  explanation += `. They're perfectly matched for your ${requiredService} booking and have a proven track record of delivering quality service.`;
  
  if (reasons.length === 0 && locationMatch.length === 0) {
    explanation = `We selected ${workerData.fullName} because they are a qualified professional ready to provide excellent service for your ${requiredService} needs.`;
  }
  
  return explanation;
};

export const submitServiceApplication = async (req, res) => {
  try {
    await connectDB();
    
    const userId = req.user?.id || null; // Allow guest applications
    const applicationData = req.body;
    
    // Validate required fields
    const { firstName, lastName, email, phone, serviceType, startDate, agreeTerms } = applicationData;
    
    if (!firstName || !lastName || !email || !phone || !serviceType || !startDate) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }
    
    if (!agreeTerms) {
      return res.status(400).json({ 
        message: "You must agree to terms and conditions" 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Create new application
    const newApplication = new ServiceApplication({
      userId,
      ...applicationData,
      startDate: new Date(startDate),
      status: 'pending'
    });
    
    await newApplication.save();
    
    console.log(`✅ Service application submitted: ${serviceType} - ${email}`);
    
    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: newApplication._id,
      serviceType: newApplication.serviceType,
      status: newApplication.status
    });
    
  } catch (error) {
    console.error("Service application error:", error);
    res.status(500).json({ 
      message: "Server error. Please try again later.",
      error: error.message 
    });
  }
};

// Optional: Get user's applications
export const getUserApplications = async (req, res) => {
  try {
    await connectDB();
    
    const applications = await ServiceApplication.find({ 
      userId: req.user.id 
    })
    .sort({ createdAt: -1 })
    .lean();
    
    res.json(applications);
    
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerWorkerAsAdmin = async (req, res) => {
  try {
    await connectDB();
    const adminId = req.user?.id;

    // Verify admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    const {
      userId, // existing user ID or leave empty for new user
      fullName,
      gender,
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
      workExperiences,
      additionalSkills,
      availability,
    } = req.body;

    let targetUserId = userId;

    // If creating new user
    if (!userId) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({
        name: fullName.split(' ')[0],
        lastname: fullName.split(' ').slice(1).join(' '),
        email,
        phone,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
        isVerified: true,
        appliedAsWorker: true,
        workerApplicationDate: new Date(),
        gender: gender || undefined
      });

      await newUser.save();
      targetUserId = newUser._id;
    } else {
      // Update existing user
      await User.findByIdAndUpdate(targetUserId, {
        appliedAsWorker: true,
        workerApplicationDate: new Date(),
        ...(gender && { gender: gender }) // Update gender if provided
      });
    }

    // Upload files if provided
    let idDocumentUrl = "";
    let photoDocumentUrl = "";
    let proofOfAddressUrl = "";
    let workPermitUrl = "";
    let refugeeIdUrl = "";
    let qualificationsDocumentUrls = [];

    if (req.files?.idDocument?.[0]) {
      idDocumentUrl = await uploadToS3(
        req.files.idDocument[0].buffer,
        req.files.idDocument[0].originalname,
        req.files.idDocument[0].mimetype
      );
    }

    if (req.files?.photoDocument?.[0]) {
      photoDocumentUrl = await uploadToS3(
        req.files.photoDocument[0].buffer,
        req.files.photoDocument[0].originalname,
        req.files.photoDocument[0].mimetype
      );
    }

    if (req.files?.proofOfAddress?.[0]) {
      proofOfAddressUrl = await uploadToS3(
        req.files.proofOfAddress[0].buffer,
        req.files.proofOfAddress[0].originalname,
        req.files.proofOfAddress[0].mimetype
      );
    }

    if (req.files?.workPermit?.[0]) {
      workPermitUrl = await uploadToS3(
        req.files.workPermit[0].buffer,
        req.files.workPermit[0].originalname,
        req.files.workPermit[0].mimetype
      );
    }

    if (req.files?.refugeeId?.[0]) {
      refugeeIdUrl = await uploadToS3(
        req.files.refugeeId[0].buffer,
        req.files.refugeeId[0].originalname,
        req.files.refugeeId[0].mimetype
      );
    }

    if (req.files?.qualificationsDocuments && req.files.qualificationsDocuments.length > 0) {
      for (const file of req.files.qualificationsDocuments) {
        const url = await uploadToS3(file.buffer, file.originalname, file.mimetype);
        qualificationsDocumentUrls.push(url);
      }
    }

    // Format work experience
    const parsedWorkExperiences = Array.isArray(workExperiences) ? workExperiences : JSON.parse(workExperiences || '[]');
    const formattedWorkExperience = parsedWorkExperiences
      .map((exp, index) => {
        let expText = `${index + 1}. ${exp.jobTitle || "Position"} at ${exp.employer || "Employer"} (${exp.duration || "Duration not specified"})\n   Responsibilities: ${exp.responsibilities || "Not specified"}`;
        if (exp.reference && (exp.reference.name || exp.reference.phone)) {
          expText += `\n   Reference: ${exp.reference.name || ""}${exp.reference.relationship ? ` (${exp.reference.relationship})` : ""}${exp.reference.phone ? ` - ${exp.reference.phone}` : ""}${exp.reference.email ? ` - ${exp.reference.email}` : ""}`;
        }
        return expText;
      })
      .join("\n\n");

    const referencesList = parsedWorkExperiences
      .filter(exp => exp.reference && (exp.reference.name || exp.reference.phone))
      .map((exp, index) => {
        const ref = exp.reference;
        return `Reference ${index + 1}: ${ref.name || ""}${ref.relationship ? ` (${ref.relationship})` : ""}${ref.phone ? ` - ${ref.phone}` : ""}${ref.email ? ` - ${ref.email}` : ""}`;
      });

    const allSkills = additionalSkills ? (Array.isArray(additionalSkills) ? additionalSkills.join(", ") : additionalSkills) : "";

    // Create worker profile
    const newWorker = new Worker({
      userId: targetUserId,
      fullName,
      gender: gender || null,
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
      serviceTypes: Array.isArray(serviceTypes) ? serviceTypes : JSON.parse(serviceTypes || '[]'),
      idDocument: idDocumentUrl,
      photoDocument: photoDocumentUrl,
      proofOfAddress: proofOfAddressUrl,
      workPermit: workPermitUrl,
      refugeeId: refugeeIdUrl,
      workExperience: formattedWorkExperience || "No work experience provided",
      skills: allSkills,
      qualificationsDocuments: qualificationsDocumentUrls,
      references: referencesList.length > 0 ? referencesList.join("\n") : "No references provided",
      availability: Array.isArray(availability) ? availability : JSON.parse(availability || '[]'),
      status: 'approved' // Admin can approve directly
    });

    await newWorker.save();

    res.status(201).json({
      message: "Worker registered successfully by admin",
      workerId: newWorker._id,
      userId: targetUserId,
      fullName: newWorker.fullName
    });
  } catch (error) {
    console.error("Admin register worker error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Request password reset - sends code to admin
export const requestPasswordReset = async (req, res) => {
  try {
    await connectDB();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        message: "If an account with that email exists, you will receive a verification code from our support team shortly.",
      });
    }

    // Generate 6-digit verification code
    const resetCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

    // Save reset code to user
    user.passwordResetCode = resetCode;
    user.passwordResetCodeExpires = expiresAt;
    user.passwordResetRequestedAt = new Date();
    await user.save();

    // Find all admins to send them the code
    const admins = await User.find({ role: "admin" }).select("name email phone");

    if (admins.length > 0) {
      // Send WhatsApp message to all admins
      const adminMessage = `🔐 Password Reset Request\n\nUser: ${user.name} ${user.lastname}\nEmail: ${user.email}\nPhone: ${user.phone || "N/A"}\n\nVerification Code: ${resetCode}\n\nThis code expires in 15 minutes.\n\nPlease send this code to the user via WhatsApp.`;

      // Send to all admins who have phone numbers
      const adminPhones = admins.filter(admin => admin.phone).map(admin => admin.phone);
      
      if (adminPhones.length > 0) {
        for (const adminPhone of adminPhones) {
          try {
            await sendWhatsAppMessage(adminPhone, adminMessage);
            console.log(`✅ Password reset code sent to admin at ${adminPhone}`);
          } catch (whatsappError) {
            console.error(`Failed to send to admin ${adminPhone}:`, whatsappError);
            // Continue to next admin even if one fails
          }
        }
      } else {
        // If no admin phones, log to console
        console.log("📱 Password Reset Code for Admin:");
        console.log(adminMessage);
        console.log("\n⚠️  No admin phone numbers found. Code is available in admin dashboard.");
      }
    } else {
      // No admins found, log to console
      console.log("📱 Password Reset Code for Admin:");
      console.log(`User: ${user.name} ${user.lastname} (${user.email})`);
      console.log(`Code: ${resetCode}`);
      console.log(`Expires: ${expiresAt.toLocaleString()}`);
    }

    res.status(200).json({
      message: "If an account with that email exists, you will receive a verification code from our support team shortly.",
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Verify code and reset password
export const verifyPasswordReset = async (req, res) => {
  try {
    await connectDB();

    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, verification code, and new password are required",
      });
    }

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if code exists and matches
    if (!user.passwordResetCode || user.passwordResetCode !== code) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Check if code has expired
    if (!user.passwordResetCodeExpires || new Date() > user.passwordResetCodeExpires) {
      // Clear expired code
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code
    user.password = hashedPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for ${user.email}`);

    res.status(200).json({
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Verify password reset error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all password reset requests (Admin only)
export const getPasswordResetRequests = async (req, res) => {
  try {
    await connectDB();

    // Verify admin
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Find all users with pending password reset requests
    const users = await User.find({
      passwordResetCode: { $exists: true, $ne: null },
      passwordResetRequestedAt: { $exists: true },
    })
      .select("name lastname email phone passwordResetCode passwordResetRequestedAt passwordResetCodeExpires")
      .sort({ passwordResetRequestedAt: -1 })
      .lean();

    // Filter out expired requests
    const activeRequests = users.filter((user) => {
      if (!user.passwordResetCodeExpires) return false;
      return new Date() <= new Date(user.passwordResetCodeExpires);
    });

    // Format response - include the code so admin can send it to user
    const formattedRequests = activeRequests.map((user) => ({
      userId: user._id,
      name: `${user.name || ""} ${user.lastname || ""}`.trim(),
      email: user.email,
      phone: user.phone,
      code: user.passwordResetCode, // Include code for admin to send to user
      requestedAt: user.passwordResetRequestedAt,
      expiresAt: user.passwordResetCodeExpires,
      isExpired: new Date() > new Date(user.passwordResetCodeExpires),
    }));

    res.json({
      requests: formattedRequests,
      total: formattedRequests.length,
    });
  } catch (error) {
    console.error("Get password reset requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitReferral = async (req, res) => {
  try {
    await connectDB();
 
    const { fullName, email, phone, agencyName, payoutPreference, message } = req.body;
 
    if (!fullName || !email || !phone || !agencyName) {
      return res.status(400).json({
        message: "Full name, email, phone, and agency name are required",
      });
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
 
    const existingReferral = await Referral.findOne({ email: email.toLowerCase() });
    if (existingReferral) {
      return res.status(400).json({
        message: "This email is already registered in the referral program",
      });
    }
 
    // Short, shareable code e.g. "AGT-7F3K9A"
    const referralCode = `AGT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
 
    const newReferral = new Referral({
      userId: req.user?.id || null,
      fullName,
      email,
      phone,
      agencyName,
      payoutPreference: payoutPreference || "cash",
      message: message || "",
      referralCode,
    });
 
    await newReferral.save();
 
    console.log(`✅ New referral partner signed up: ${agencyName} (${email})`);
 
    res.status(201).json({
      message: "Referral signup successful",
      referralId: newReferral._id,
      referralCode: newReferral.referralCode,
    });
  } catch (error) {
    console.error("Referral signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
 
export const getMyReferral = async (req, res) => {
  try {
    await connectDB();
    const referral = await Referral.findOne({ userId: req.user.id }).lean();
    res.json({ referral: referral || null });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// FIND this entire function and REPLACE with:

export const processReferralCommission = async (userId, bookingCost, bookingId = null) => {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user?.referredByAgentId) return;

    const referral = await Referral.findById(user.referredByAgentId);
    if (!referral) return;
    if (referral.status !== "active" && referral.status !== "pending") return;

    // ── Duplicate guard ──────────────────────────────────────────
    if (bookingId) {
      const alreadyProcessed = referral.processedBookingIds?.some(
        (id) => id.toString() === bookingId.toString()
      );
      if (alreadyProcessed) {
        console.log(`⚠️ Commission already processed for booking ${bookingId} — skipping`);
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────

    const bookingNumber = (user.referralBookingsCount || 0) + 1;

    if (referral.payoutPreference === "quick-cash") {
      if (user.referralBookingsCount === 0) {
        referral.totalEarned = (referral.totalEarned || 0) + 150;
        referral.commissions = referral.commissions || [];
        referral.commissions.push({
          userId,
          bookingCost,
          commissionAmount: 150,
          type: "quick-cash",
          date: new Date(),
          paid: false,
        });
        if (bookingId) {
          referral.processedBookingIds = referral.processedBookingIds || [];
          referral.processedBookingIds.push(bookingId);
        }
        await referral.save();
        console.log(`💵 Quick Cash R150 earned by agent ${referral.fullName}`);
      }
    } else if (referral.payoutPreference === "commission") {
      if (user.referralBookingsCount < 5) {
        const commission = parseFloat((bookingCost * 0.1).toFixed(2));
        referral.totalEarned = (referral.totalEarned || 0) + commission;
        referral.commissions = referral.commissions || [];
        referral.commissions.push({
          userId,
          bookingCost,
          commissionAmount: commission,
          type: "commission-10pct",
          date: new Date(),
          paid: false,
        });
        if (bookingId) {
          referral.processedBookingIds = referral.processedBookingIds || [];
          referral.processedBookingIds.push(bookingId);
        }
        await referral.save();
        console.log(`📈 10% commission R${commission} earned by agent ${referral.fullName} (booking ${bookingNumber}/5)`);
      }
    }

    user.referralBookingsCount = bookingNumber;
    await user.save();

  } catch (error) {
    console.error("Commission processing error:", error.message);
  }
};