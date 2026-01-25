import { Settings } from "../models/index.js";

export const websiteLockMiddleware = async (req, res, next) => {
  try {
    // Bypass for admin routes and specific API endpoints
    const isAdminRoute = req.path.startsWith("/api/admin");
    const isPublicApi =
      req.path.startsWith("/api/auth") ||
      req.path === "/api/admin/login" ||
      req.path.startsWith("/api/public");

    if (isAdminRoute || isPublicApi) {
      return next();
    }

    // Get website lock settings
    const settings = await Settings.getSettings();

    // If website is locked and not accessing lock-related endpoints
    if (settings.isWebsiteLocked && !req.path.includes("/lock-status")) {
      // Return lock status for API calls
      if (req.path.startsWith("/api/")) {
        return res.status(423).json({
          success: false,
          message: "Website is currently locked for maintenance.",
          data: {
            isLocked: true,
            message: settings.lockMessage,
            image: settings.lockImage,
            type: "maintenance",
          },
        });
      }

      // For web routes, you would redirect to a lock page
      // For API-only backend, we just return the lock status
      return res.status(423).json({
        success: false,
        message: settings.lockMessage,
        data: {
          isLocked: true,
          message: settings.lockMessage,
          image: settings.lockImage,
          type: "maintenance",
        },
      });
    }

    // Website is not locked, proceed
    req.websiteSettings = settings;
    next();
  } catch (error) {
    console.error("Website lock middleware error:", error);
    next(); // Continue even if there's an error
  }
};