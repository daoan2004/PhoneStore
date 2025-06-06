import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/adminController';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(protect);
router.use(admin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Order management routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Product management routes
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Review management routes
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

export default router; 