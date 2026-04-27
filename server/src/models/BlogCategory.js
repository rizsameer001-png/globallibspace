// import mongoose from 'mongoose';

// const blogCategorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, unique: true },
//   icon: { type: String, default: '📝' },

//   parent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'BlogCategory',
//     default: null
//   },

//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// export default mongoose.model('BlogCategory', blogCategorySchema);

// models/BlogCategory.js
// const mongoose = require('mongoose');

// const blogCategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   slug: {
//     type: String,
//     unique: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('BlogCategory', blogCategorySchema);

const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  // 🔥 for subcategory
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategory',
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('BlogCategory', blogCategorySchema);