const BlogCategory = require('../models/BlogCategory');

// 🔹 slug helper
const slugify = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// ✅ GET (Tree structure)
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await BlogCategory.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    }).lean();

    const map = {};
    const roots = [];

    categories.forEach(cat => {
      map[cat._id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent) {
        if (map[cat.parent]) {
          map[cat.parent].children.push(map[cat._id]);
        }
      } else {
        roots.push(map[cat._id]);
      }
    });

    res.json({ success: true, categories: roots });

  } catch (e) { next(e); }
};


// ✅ CREATE
exports.createBlogCategory = async (req, res, next) => {
  try {
    const { name, parent } = req.body;

    const category = await BlogCategory.create({
      name,
      slug: slugify(name),
      parent: parent || null,
      isActive: true
    });

    res.status(201).json({ success: true, category });

  } catch (e) { next(e); }
};


// ✅ UPDATE
exports.updateBlogCategory = async (req, res, next) => {
  try {
    const { name, parent, isActive } = req.body;

    // prevent self-parent
    if (parent && parent === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent'
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(name && { slug: slugify(name) }),
      ...(parent !== undefined && { parent: parent || null }),
      ...(isActive !== undefined && { isActive })
    };

    const category = await BlogCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({ success: true, category });

  } catch (e) { next(e); }
};


// ✅ DELETE (safe)
exports.deleteBlogCategory = async (req, res, next) => {
  try {
    const hasChildren = await BlogCategory.findOne({ parent: req.params.id });

    if (hasChildren) {
      return res.status(400).json({
        success: false,
        message: 'Delete subcategories first'
      });
    }

    await BlogCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted'
    });

  } catch (e) { next(e); }
};