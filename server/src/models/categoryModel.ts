import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,      // Convert to lowercase
      strict: true,     // Remove special characters
      trim: true        // Trim whitespace
    });
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
export default Category; 