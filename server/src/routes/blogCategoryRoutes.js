const express = require('express');
const router  = express.Router();

const BlogCategory = require('../models/BlogCategory');
const {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} = require('../controllers/blogCategoryController');

const { protect, authorize } = require('../middleware/auth');


// ✅ GET all active (same style as your book route)
router.get('/', getBlogCategories);


// ✅ CREATE
router.post('/', protect, authorize('admin', 'manager'), createBlogCategory);


// ✅ UPDATE
router.put('/:id', protect, authorize('admin', 'manager'), updateBlogCategory);


// ✅ DELETE
router.delete('/:id', protect, authorize('admin'), deleteBlogCategory);


module.exports = router;