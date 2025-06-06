const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    images,
    category,
    brand,
    stock,
    specifications,
    isFeatured,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    images,
    category,
    brand,
    stock,
    specifications: new Map(Object.entries(specifications || {})),
    isFeatured,
  });

  res.status(201).json(product);
});

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
          { brand: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const priceRange = req.query.priceMin && req.query.priceMax
    ? { price: { $gte: Number(req.query.priceMin), $lte: Number(req.query.priceMax) } }
    : {};
  const featured = req.query.featured ? { isFeatured: true } : {};

  let sortQuery = { createdAt: -1 }; // Default sort by newest
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'priceAsc':
        sortQuery = { price: 1 };
        break;
      case 'priceDesc':
        sortQuery = { price: -1 };
        break;
      case 'nameAsc':
        sortQuery = { name: 1 };
        break;
      case 'nameDesc':
        sortQuery = { name: -1 };
        break;
      case 'bestseller':
        sortQuery = { salesCount: -1 };
        break;
    }
  }

  const query = {
    ...keyword,
    ...category,
    ...priceRange,
    ...featured,
  };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name')
    .sort(sortQuery)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    images,
    category,
    brand,
    stock,
    specifications,
    isFeatured,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.images = images || product.images;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    if (specifications) {
      product.specifications = new Map(Object.entries(specifications));
    }
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .populate('category', 'name')
    .limit(8);
  res.json(products);
});

// @desc    Get best selling products
// @route   GET /api/products/bestsellers
// @access  Public
const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('category', 'name')
    .sort({ salesCount: -1 })
    .limit(8);
  res.json(products);
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json(products);
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
}; 