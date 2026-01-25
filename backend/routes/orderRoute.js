import express from "express";
const router = express.Router();
import { createOrder, verifyPayment, paystackWebhook, getAllOrders, updateOrderStatus, updatePaymentStatus, getOrderStatistics, getAdminOrderById, exportOrders, getOrder} from "../controllers/orderController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

// Public routes
router.post('/', createOrder);
router.get('/:identifier', getOrder);
router.post('/verify-payment', verifyPayment);

// Paystack webhook (no auth needed)
router.post('/webhooks/paystack', paystackWebhook);

// Admin routes
router.use('/admin', authenticateAdmin);
router.get('/admin/orders', getAllOrders);
router.get('/admin/orders/:id', getAdminOrderById);
router.put('/admin/orders/:id/status', updateOrderStatus);
router.put('/admin/orders/:id/payment-status', updatePaymentStatus);
router.get('/admin/orders/statistics', getOrderStatistics);
router.get('/admin/orders/export', exportOrders);

export default router