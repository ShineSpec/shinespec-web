import { connectDB } from "../lib/db.js";
import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    await connectDB();
    
    // Check if user is authenticated (should be done by verifyToken middleware first)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: "Authentication required. Please log in." 
      });
    }

    // Get user from database to check role
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found" 
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required." 
      });
    }

    // Attach user object to request for use in controllers
    req.adminUser = user;
    
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ 
      message: "Server error during admin verification" 
    });
  }
};

