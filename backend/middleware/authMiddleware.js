import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "No token provided. Please log in." 
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({ 
        message: "Invalid token format" 
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "default_secret"
    );

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token expired. Please log in again." 
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        message: "Invalid token. Please log in again." 
      });
    }

    return res.status(500).json({ 
      message: "Authentication error" 
    });
  }
};