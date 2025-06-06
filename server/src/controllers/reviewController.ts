import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Review from '../models/reviewModel';
import Product from '../models/productModel';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reviews by product ID
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user?._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      user: req.user?._id,
      product: productId,
      rating,
      comment,
    });

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = totalRating / allReviews.length;
    product.numReviews = allReviews.length;
    await product.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('product', 'name')
      .exec();

    res.status(201).json(populatedReview);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { rating, comment } = req.body;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    if (product) {
      const allReviews = await Review.find({ product: review.product });
      const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
      product.rating = totalRating / allReviews.length;
      await product.save();
    }

    const populatedReview = await Review.findById(updatedReview._id)
      .populate('user', 'name')
      .populate('product', 'name')
      .exec();

    res.json(populatedReview);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating
    const product = await Product.findById(productId);
    if (product) {
      const allReviews = await Review.find({ product: productId });
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
        product.rating = totalRating / allReviews.length;
      } else {
        product.rating = 0;
      }
      product.numReviews = allReviews.length;
      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 