const express = require('express');
const router  = express.Router();
const { BlogPost } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// Public: list published with filters
router.get('/', async (req, res, next) => {
  try {
    const { page=1, limit=9, tag, category, subCategory, featured, search } = req.query;
    const query = { status: 'published' };
    if (tag)         query.tags        = tag;
    if (category)    query.category    = category;
    if (subCategory) query.subCategory = subCategory;
    if (featured === 'true') query.featured = true;
    if (search)      query.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
    const [total, posts] = await Promise.all([
      BlogPost.countDocuments(query),
      BlogPost.find(query).populate('author','name avatar')
        .sort('-publishedAt').limit(parseInt(limit))
        .skip((parseInt(page)-1)*parseInt(limit))
        .select('-content'),
    ]);
    // Get all categories + subcategories for sidebar
    const cats = await BlogPost.aggregate([
      { $match:{ status:'published' } },
      { $group:{ _id:'$category', subCategories:{ $addToSet:'$subCategory' }, count:{ $sum:1 } } },
      { $sort: { count:-1 } },
    ]);
    res.json({ success:true, posts, pagination:{ total, page:parseInt(page), pages:Math.ceil(total/parseInt(limit)) }, categories:cats });
  } catch(e){next(e);}
});

// Public: single post
router.get('/:slug', async (req, res, next) => {
  try {
    const id  = req.params.slug;
    const q   = id.match(/^[a-f\d]{24}$/i) ? { _id:id } : { slug:id };
    const post= await BlogPost.findOne({ ...q, status:'published' }).populate('author','name avatar');
    if (!post) return res.status(404).json({ success:false, message:'Post not found' });
    BlogPost.findByIdAndUpdate(post._id, { $inc:{ views:1 } }).catch(()=>{});
    // Similar posts
    const similar = await BlogPost.find({
      _id:{ $ne:post._id }, status:'published',
      $or:[{ category:post.category },{ tags:{ $in:post.tags } }]
    }).limit(4).select('title slug coverImage category publishedAt excerpt');
    res.json({ success:true, post, similar });
  } catch(e){next(e);}
});

// Admin: get all (including drafts)
router.get('/admin/all', protect, authorize('admin','manager'), async (req, res, next) => {
  try {
    const { page=1, limit=20, status } = req.query;
    const query = status ? { status } : {};
    const [total, posts] = await Promise.all([
      BlogPost.countDocuments(query),
      BlogPost.find(query).populate('author','name').sort('-createdAt')
        .limit(parseInt(limit)).skip((parseInt(page)-1)*parseInt(limit)).select('-content'),
    ]);
    res.json({ success:true, posts, pagination:{ total, page:parseInt(page), pages:Math.ceil(total/parseInt(limit)) } });
  } catch(e){next(e);}
});

// Admin: create
router.post('/', protect, authorize('admin','manager'), async (req, res, next) => {
  try {
    const words = (req.body.content||'').replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words/200));
    const post = await BlogPost.create({ ...req.body, author:req.user._id, readTime });
    res.status(201).json({ success:true, post });
  } catch(e){next(e);}
});

// Admin: update
router.put('/:id', protect, authorize('admin','manager'), async (req, res, next) => {
  try {
    const words = (req.body.content||'').replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;
    req.body.readTime = Math.max(1, Math.ceil(words/200));
    const existing = await BlogPost.findById(req.params.id);
    if (!existing) return res.status(404).json({ success:false, message:'Not found' });
    Object.assign(existing, req.body);
    await existing.save();
    res.json({ success:true, post:existing });
  } catch(e){next(e);}
});

// Admin: delete
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const p = await BlogPost.findByIdAndDelete(req.params.id);
    if (p?.coverPublicId) deleteFromCloudinary(p.coverPublicId,'image').catch(()=>{});
    (p?.images||[]).forEach(img => { if(img.publicId) deleteFromCloudinary(img.publicId,'image').catch(()=>{}); });
    res.json({ success:true });
  } catch(e){next(e);}
});

module.exports = router;
