import express from "express";
const router = express.Router();

import { loginAdmin, getAdminProfile, createAdmin, getAllAdmins, updateAdminStatus, changePassword, logoutAdmin } from "../controllers/adminController.js";
import { authenticateAdmin, authorizeRoles } from "../middlewares/authMiddleware.js";

// Public routes
router.post('/login', loginAdmin);

// Protected routes (require authentication)
router.use(authenticateAdmin);

// Admin-only routes
router.get('/profile', getAdminProfile);
router.put('/change-password', changePassword);
router.post('/logout', logoutAdmin);

// Superadmin-only routes
router.post('/', authorizeRoles('superadmin'), createAdmin);
router.get('/', authorizeRoles('superadmin'), getAllAdmins);
router.put('/:id/status', authorizeRoles('superadmin'), updateAdminStatus);

export default router