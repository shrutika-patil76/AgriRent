const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all tools
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const tools = await Tool.find(query).populate('owner', 'name email phone');
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single tool
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate('owner', 'name email phone');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create tool (Owner only) with image upload
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/tools/${file.filename}`) : [];

    // Parse specifications if it's a string
    let specifications = req.body.specifications;
    if (typeof specifications === 'string') {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {
        specifications = {};
      }
    }

    const tool = new Tool({
      ...req.body,
      specifications,
      images: imagePaths,
      owner: req.user.id
    });

    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update tool with optional image upload
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (tool.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If new images uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/tools/${file.filename}`);
      req.body.images = [...(tool.images || []), ...newImagePaths];
    }

    Object.assign(tool, req.body);
    await tool.save();
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete tool
router.delete('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (tool.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await tool.deleteOne();
    res.json({ message: 'Tool deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
