import { Request, Response, RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import asyncHandler from 'express-async-handler';
import Review, { IReview } from '../models/Review';
import Product from '../models/productModel';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

interface ReviewParams {
  [key: string]: string | undefined;
  id?: string;
  productId?: string;
}

interface ReviewBody {
  productId: string;
  rating: number;
  comment: string;
  reviewId?: string;
  reason?: string;
}

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name email')
    .populate('product', 'name image')
    .sort('-createdAt');
  res.json(reviews);
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'name email')
    .populate('product', 'name image');

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { productId, rating, comment } = req.body;

  if (!req.user?._id) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    comment,
  });

  await review.populate('user', 'name email');
  await review.populate('product', 'name image');

  res.status(201).json(review);
});

// @desc    Update review status
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const review = await Review.findById(req.params.id);

  if (review) {
    review.status = status;
    const updatedReview = await review.save();
    await updatedReview.populate('user', 'name email');
    await updatedReview.populate('product', 'name image');
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { id } = req.params;

  if (!req.user?._id) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const review = await Review.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
export const reportReview: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { reviewId, reason } = req.body;

  if (!req.user?._id) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  review.isReported = true;
  review.reportReason = reason;
  await review.save();

  res.json({ message: 'Review reported successfully' });
});

// Get all reviews
export const getAllReviews: RequestHandler = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('user', 'email')
    .populate('product', 'name');
  res.json(reviews);
});

// Get reviews by product
export const getProductReviews: RequestHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate('user', 'email')
    .populate('product', 'name');
  res.json(reviews);
});

// Update review
export const updateReview: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { rating, comment } = req.body;
  const { id } = req.params;

  if (!req.user?._id) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  const review = await Review.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!review) {
    res.status(404).json({ message: 'Review not found' });
    return;
  }

  review.rating = rating;
  review.comment = comment;
  await review.save();

  res.json(review);
}); 