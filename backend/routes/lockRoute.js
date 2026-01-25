import express from "express";
const router = express.Router();
import { getLockPageData, getLockStatus, subscribeDuringLock, toggleWebsiteLock, updateWebsiteSettings, getWebsiteSettings } from "../controllers/lockController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.get('/status', getLockStatus);
router.get('/page-data', getLockPageData);
router.post('/subscribe', subscribeDuringLock);

// Admin routes
router.use('/admin', authenticateAdmin);
router.get('/admin/settings', getWebsiteSettings);
router.put('/admin/settings', updateWebsiteSettings);
router.put('/admin/lock/toggle', toggleWebsiteLock);

export default router