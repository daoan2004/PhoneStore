import express from 'express';
import { getAdminStats } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);

export default router; 