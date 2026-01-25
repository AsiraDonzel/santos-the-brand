import express from "express";
const router = express.Router();
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getAllSubscribers,
  createCampaign,
  getAllCampaigns,
  sendTestEmail,
  sendCampaign,
  trackEmailOpen,
  trackLinkClick,
  getNewsletterStatistics,
} from "../controllers/newsletterController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.post('/subscribe', subscribeToNewsletter);
router.post('/unsubscribe', unsubscribeFromNewsletter);
router.get('/track/open/:trackingId', trackEmailOpen);
router.get('/track/click/:trackingId', trackLinkClick);

// Admin routes
router.use('/admin', authenticateAdmin);
router.get('/admin/subscribers', getAllSubscribers);
router.get('/admin/statistics', getNewsletterStatistics);

// Campaign routes
router.post('/admin/campaigns', createCampaign);
router.get('/admin/campaigns', getAllCampaigns);
router.post('/admin/campaigns/:id/test', sendTestEmail);
router.post('/admin/campaigns/:id/send', sendCampaign);

export default router;