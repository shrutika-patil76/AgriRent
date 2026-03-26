const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { toolId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      tool: toolId,
      rating,
      comment
    });

    await review.save();

    // Update tool rating
    const reviews = await Review.find({ tool: toolId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Tool.findByIdAndUpdate(toolId, {
      rating: avgRating,
      reviewCount: reviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for a tool
router.get('/tool/:toolId', async (req, res) => {
  try {
    const reviews = await Review.find({ tool: req.params.toolId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
