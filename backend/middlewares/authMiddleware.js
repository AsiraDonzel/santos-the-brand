import { verifyToken, extractTokenFromHeader } from "../utils/generateToken.js";
import { Admin } from "../models/index.js";

export const authenticateAdmin = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const token = extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // 3. Find admin in database
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or inactive.",
      });
    }

    // 4. Attach admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

// Optional: Role-based authorization middleware
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.admin.role} is not authorized to access this resource.`,
      });
    }
    next();
  };
};


