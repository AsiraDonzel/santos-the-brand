import express from "express";
const router = express.Router();
import {
  validatePromoCode,
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  togglePromoStatus,
  deletePromoCode,
  getPromoStatistics,
  bulkGeneratePromoCodes,
} from "../controllers/promoController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.post('/validate', validatePromoCode);

// Admin routes
router.use('/admin', authenticateAdmin);
router.post('/admin', createPromoCode);
router.get('/admin', getAllPromoCodes);
router.get('/admin/:id', getPromoCodeById);
router.put('/admin/:id', updatePromoCode);
router.put('/admin/:id/toggle', togglePromoStatus);
router.delete('/admin/:id', deletePromoCode);
router.get('/admin/statistics/overview', getPromoStatistics);
router.post('/admin/bulk-generate', bulkGeneratePromoCodes);

export default router