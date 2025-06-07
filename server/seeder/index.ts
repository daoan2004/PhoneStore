import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { categories, products } from './data';
import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';

interface CategoryDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
}

interface CategoryMap {
  [key: string]: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
}

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/phonestore')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const importData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Insert categories
    const createdCategories = await Category.insertMany(categories) as CategoryDocument[];

    // Map category names to their IDs
    const categoryMap = createdCategories.reduce((map: CategoryMap, category: CategoryDocument) => {
      map[category.name] = {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      };
      return map;
    }, {} as CategoryMap);

    // Assign categories to products
    const productsWithCategories = products.map(product => {
      let category;
      if (product.name.toLowerCase().includes('iphone') || 
          product.name.toLowerCase().includes('pixel') || 
          product.name.toLowerCase().includes('galaxy s') ||
          product.name.toLowerCase().includes('xiaomi') ||
          product.name.toLowerCase().includes('nothing')) {
        category = categoryMap['Smartphones'];
      } else if (product.name.toLowerCase().includes('ipad') || 
                 product.name.toLowerCase().includes('tab')) {
        category = categoryMap['Tablets'];
      } else if (product.name.toLowerCase().includes('watch')) {
        category = categoryMap['Wearables'];
      } else {
        category = categoryMap['Accessories'];
      }

      return {
        ...product,
        category,
      };
    });

    // Insert products
    await Product.insertMany(productsWithCategories);

    console.log('Sample data imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 