import { Request, Response } from 'express';
import User from '../models/userModel';
import Order from '../models/orderModel';
import Product from '../models/productModel';
import Review from '../models/reviewModel';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    const reviewCount = await Review.countDocuments();

    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const topProducts = await Product.find()
      .sort({ rating: -1 })
      .limit(5);

    res.json({
      stats: {
        users: userCount,
        orders: orderCount,
        products: productCount,
        reviews: reviewCount,
        revenue,
      },
      recentOrders,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 