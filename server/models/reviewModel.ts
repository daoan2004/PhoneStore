import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  status: string;
}

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected'],
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review; 