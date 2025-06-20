import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
    },
    countInStock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  'category.name': 'text',
});

// Create slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; 