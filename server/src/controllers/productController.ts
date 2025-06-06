import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const {
      name,
      brand,
      description,
      price,
      image,
      category,
      countInStock,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!name || !brand || !description || !category) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Validate countInStock
    if (countInStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Product.create({
      name: name.trim(),
      brand: brand.trim(),
      description: description.trim(),
      price,
      image: image ? image.trim() : '',
      category,
      countInStock: countInStock || 0,
      isFeatured: isFeatured || false,
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.populate('category', 'name');
    res.status(201).json(createdProduct);
  } catch (error: any) {
    console.error('Error in createProduct:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else if (error.code === 11000) {
      res.status(400).json({ message: 'Product with this name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create product' });
    }
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      brand,
      description,
      price,
      image,
      category,
      countInStock,
      isFeatured,
    } = req.body;

    // Validate price if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Validate countInStock if provided
    if (countInStock !== undefined && countInStock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Check if category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Update fields if provided
    if (name) product.name = name.trim();
    if (brand) product.brand = brand.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image ? image.trim() : '';
    if (category) product.category = category;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    const updatedProduct = await product.save();
    const populatedProduct = await updatedProduct.populate('category', 'name');
    res.json(populatedProduct);
  } catch (error: any) {
    console.error('Error in updateProduct:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else if (error.code === 11000) {
      res.status(400).json({ message: 'Product with this name already exists' });
    } else {
      res.status(500).json({ message: 'Failed to update product' });
    }
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
}; 