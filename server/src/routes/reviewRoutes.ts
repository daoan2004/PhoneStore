import express from 'express';
import {
  getReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/product/:productId', getProductReviews);

// Private routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router; 