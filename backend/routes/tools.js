const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all tools
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/tools - Request received');
    const { category, search, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    console.log('Query:', query);
    
    // Try without populate first to isolate the issue
    const tools = await Tool.find(query).lean();
    console.log('Tools found (without populate):', tools.length);
    
    // Then populate owner info
    const populatedTools = await Tool.find(query)
      .populate('owner', 'name email phone')
      .lean();
    
    console.log('Tools found (with populate):', populatedTools.length);
    res.json(populatedTools);
  } catch (error) {
    console.error('Error in GET /api/tools:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
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
    console.log('POST /api/tools - Request received');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('Files:', req.files?.length || 0);

    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only owners can add tools.' });
    }

    // Get image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/tools/${file.filename}`) : [];

    // Parse specifications if it's a string
    let specifications = req.body.specifications;
    if (typeof specifications === 'string') {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {
        console.error('Failed to parse specifications:', e);
        specifications = {};
      }
    }

    // Fetch owner's address and coordinates
    const User = require('../models/User');
    const owner = await User.findById(req.user.id);
    
    if (!owner) {
      console.error('Owner not found:', req.user.id);
      return res.status(404).json({ message: 'Owner not found' });
    }

    console.log('Owner found:', { id: owner._id, address: owner.address, coordinates: owner.coordinates });

    if (!owner.address) {
      return res.status(400).json({ 
        message: 'Please set your address in your profile before adding tools',
        missingField: 'address'
      });
    }

    const tool = new Tool({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      pricePerDay: req.body.pricePerDay,
      deposit: req.body.deposit,
      location: owner.address, // Use owner's address
      coordinates: owner.coordinates || { latitude: null, longitude: null }, // Handle null coordinates
      specifications,
      images: imagePaths,
      owner: req.user.id
    });

    await tool.save();
    console.log('Tool saved successfully:', tool._id);
    res.status(201).json(tool);
  } catch (error) {
    console.error('Error in POST /api/tools:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
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

// Admin: Update tool coordinates from owner's profile
router.post('/:id/sync-coordinates', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    
    const tool = await Tool.findById(req.params.id).populate('owner');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    // Get owner's current coordinates
    const owner = await User.findById(tool.owner._id);
    if (!owner || !owner.coordinates) {
      return res.status(400).json({ message: 'Owner has no coordinates' });
    }

    // Update tool with owner's coordinates
    tool.coordinates = owner.coordinates;
    tool.location = owner.address;
    await tool.save();

    res.json({
      message: 'Tool coordinates synced successfully',
      tool: {
        name: tool.name,
        location: tool.location,
        coordinates: tool.coordinates
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
