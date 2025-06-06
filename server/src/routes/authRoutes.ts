import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  refreshToken,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router; 