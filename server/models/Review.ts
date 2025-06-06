import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isReported: boolean;
  reportReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
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
  isReported: {
    type: Boolean,
    default: false,
  },
  reportReason: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
export default Review; 