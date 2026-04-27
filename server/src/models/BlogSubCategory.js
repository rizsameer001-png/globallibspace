// models/BlogSubCategory.js
const mongoose = require('mongoose');

const blogSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: String,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory',
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('BlogSubCategory', blogSubCategorySchema);