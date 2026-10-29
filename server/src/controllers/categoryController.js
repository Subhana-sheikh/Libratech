import Category from '../models/Category.js';
import Book from '../models/Book.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logAudit } from '../utils/auditLogger.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Count books per category
    const counts = await Book.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.map(c => [c._id.toString(), c.count]));

    const enriched = categories.map(c => ({
      ...c.toObject(),
      bookCount: countMap.get(c._id.toString()) || 0
    }));

    return successResponse(res, enriched, 'Categories retrieved.');
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !name.trim()) {
      return errorResponse(res, 'Category name is required.', 400);
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) {
      return errorResponse(res, 'A category with this name or slug already exists.', 400);
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : undefined,
      icon: icon || 'BookOpen'
    });

    await logAudit({
      actorUserId: req.user._id,
      action: 'CATEGORY_CREATE',
      entityType: 'Category',
      entityId: category._id,
      metadata: { name: category.name }
    });

    return successResponse(res, category, 'Category created.', 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found.', 404);

    if (name && name.trim()) {
      category.name = name.trim();
      category.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;

    await category.save();

    await logAudit({
      actorUserId: req.user._id,
      action: 'CATEGORY_UPDATE',
      entityType: 'Category',
      entityId: category._id,
      metadata: { name: category.name }
    });

    return successResponse(res, category, 'Category updated.');
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, 'Category not found.', 404);

    // Check if books are assigned to this category
    const bookCount = await Book.countDocuments({ categoryId: category._id, isArchived: false });
    if (bookCount > 0) {
      return errorResponse(res, `Cannot delete category. It has ${bookCount} active book(s) assigned to it.`, 400);
    }

    await Category.findByIdAndDelete(category._id);

    await logAudit({
      actorUserId: req.user._id,
      action: 'CATEGORY_DELETE',
      entityType: 'Category',
      entityId: category._id,
      metadata: { name: category.name }
    });

    return successResponse(res, null, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
};
