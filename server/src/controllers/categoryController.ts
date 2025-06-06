import { Request, Response } from 'express';
import Category from '../models/categoryModel';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const { name, description, image } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      image: image ? image.trim() : '',
    });

    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error in createCategory:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Failed to create category' });
    }
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image } = req.body;

    // Validate at least one field to update
    if (!name && !description && image === undefined) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    // Check if new name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name: name.trim() });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }

    // Update fields if provided
    if (name) category.name = name.trim();
    if (description) category.description = description.trim();
    if (image !== undefined) category.image = image ? image.trim() : '';

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error: any) {
    console.error('Error in updateCategory:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({ message: messages.join(', ') });
    } else {
      res.status(500).json({ message: 'Failed to update category' });
    }
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
}; 