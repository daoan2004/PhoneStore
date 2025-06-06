import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { updateProfile, getProfile } from '../controllers/userController';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router; 