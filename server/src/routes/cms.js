const express = require('express');
const router  = express.Router();
const { CMS, SystemSettings } = require('../models/index');
const { protect, authorize }  = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try { res.json({ success:true, cms: await CMS.findOne()||{} }); } catch(e){next(e);}
});
router.put('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const cms = await CMS.findOneAndUpdate({}, req.body, { new:true, upsert:true });
    res.json({ success:true, cms });
  } catch(e){next(e);}
});
router.get('/settings', async (req, res, next) => {
  try { res.json({ success:true, settings: await SystemSettings.findOne()||{} }); } catch(e){next(e);}
});
// Accept JSON body with logo URL (client uploads directly to Cloudinary)
router.put('/settings', protect, authorize('admin'), async (req, res, next) => {
  try {
    const settings = await SystemSettings.findOneAndUpdate({}, req.body, { new:true, upsert:true });
    res.json({ success:true, settings });
  } catch(e){next(e);}
});
router.post('/testimonials', protect, authorize('admin'), async (req, res, next) => {
  try {
    const cms = await CMS.findOne();
    if (!cms) return res.status(404).json({ success:false, message:'CMS not found' });
    cms.testimonials.push(req.body);
    await cms.save();
    res.json({ success:true, testimonials: cms.testimonials });
  } catch(e){next(e);}
});
router.delete('/testimonials/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const cms = await CMS.findOne();
    cms.testimonials = cms.testimonials.filter(t => t._id.toString() !== req.params.id);
    await cms.save();
    res.json({ success:true });
  } catch(e){next(e);}
});
module.exports = router;
