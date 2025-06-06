import express from 'express';
import {
  getAllReviews,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  reportReview,
} from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/report', protect, reportReview);

export default router; 