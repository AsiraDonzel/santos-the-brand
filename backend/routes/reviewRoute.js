import express from "express";
const router = express.Router();
import { getProductReviews, submitReview, getAllReviews, updateReviewApproval, deleteReview, getReviewStatistics } from "../controllers/reviewController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";


// Public routes
router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', submitReview);

// Admin routes
router.get('/admin/reviews', authenticateAdmin, getAllReviews);
router.get('/admin/reviews/statistics', authenticateAdmin, getReviewStatistics);
router.put('/admin/reviews/:id/approve', authenticateAdmin, updateReviewApproval);
router.delete('/admin/reviews/:id', authenticateAdmin, deleteReview);

export default router;
