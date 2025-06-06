const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with A17 Pro chip and titanium design',
    price: 999,
    images: ['https://example.com/iphone15pro.jpg'],
    brand: 'Apple',
    stock: 50,
    specifications: {
      'Display': '6.1-inch Super Retina XDR',
      'Processor': 'A17 Pro',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Battery': '3,274 mAh',
    },
    isFeatured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android flagship with S Pen support',
    price: 1199,
    images: ['https://example.com/s24ultra.jpg'],
    brand: 'Samsung',
    stock: 40,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'Camera': '200MP Main + 12MP Ultra Wide',
      'Battery': '5,000 mAh',
    },
    isFeatured: true,
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Pure Android experience with amazing camera capabilities',
    price: 899,
    images: ['https://example.com/pixel8pro.jpg'],
    brand: 'Google',
    stock: 30,
    specifications: {
      'Display': '6.7-inch LTPO OLED',
      'Processor': 'Google Tensor G3',
      'Camera': '50MP Main + 48MP Ultra Wide',
      'Battery': '5,050 mAh',
    },
    isFeatured: false,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Create a default category if none exists
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones from top brands',
        image: 'https://example.com/smartphones.jpg',
      });
    }

    // Delete existing products
    await Product.deleteMany();
    console.log('Products cleared');

    // Add category and generate slug for each product
    const productsWithCategory = sampleProducts.map(product => ({
      ...product,
      category: category._id,
      slug: product.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    }));

    // Insert new products
    await Product.insertMany(productsWithCategory);
    console.log('Sample products added');

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedProducts(); 