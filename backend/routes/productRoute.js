import express from "express";
const router = express.Router();
import { createProduct, deleteProduct, getAllCategories, getAllProducts, getProductById, getProductsByCategory, updateProduct, activateProduct, bulkUpdateProducts, getProductStatistics } from "../controllers/productController.js";
import { authorizeRoles, authenticateAdmin } from "../middlewares/authMiddleware.js";
import {validateCreateProduct, validateUpdateProduct, validateGetProducts} from "../validators/productValidators.js";


// Public routes
router.get("/", validateGetProducts, getAllProducts);
router.get('/categories/all', getAllCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Admin protected routes
router.use(authenticateAdmin);

// Admin-only product management
router.post("/", authenticateAdmin, validateCreateProduct, createProduct);
router.put("/:id", authenticateAdmin, validateUpdateProduct, updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/activate', activateProduct);

// Bulk operations
router.put('/bulk/update', bulkUpdateProducts);

// Statistics (admin only)
router.get('/statistics/overview', getProductStatistics);

export default router

