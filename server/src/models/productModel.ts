import mongoose from 'mongoose';
import slugify from 'slugify';

export interface IProduct extends mongoose.Document {
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: mongoose.Types.ObjectId;
  countInStock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Category is required'],
      ref: 'Category',
    },
    countInStock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      min: [0, 'Number of reviews cannot be negative'],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true
    });
  }
  next();
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 