const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', [
  // Validation middleware
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('phone')
    .trim()
    .matches(/^[+]?[\d\s-]{10,15}$/)
    .withMessage('Please enter a valid phone number (10-15 digits)'),
  body('address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters'),
  body('role')
    .isIn(['farmer', 'owner', 'admin'])
    .withMessage('Invalid role')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { name, email, password, role, phone, address } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      coordinates: req.body.coordinates || null
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', [
  // Validation middleware - only check if fields are provided
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update all users with coordinates
router.post('/admin/update-coordinates', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can perform this action' });
    }

    const userCoordinates = {
      'rajesh.kumar@gmail.com': { latitude: 16.8056, longitude: 74.6568 },
      'amit.singh@gmail.com': { latitude: 16.8186, longitude: 74.7597 },
      'suresh.patel@gmail.com': { latitude: 16.7500, longitude: 74.5500 },
      'ramesh.verma@gmail.com': { latitude: 16.9500, longitude: 74.8000 },
      'admin@agrirent.com': { latitude: 16.7000, longitude: 74.4000 },
      'vijay.sharma@gmail.com': { latitude: 16.6500, longitude: 74.3500 }
    };

    let updated = 0;
    const results = [];

    for (const [email, coordinates] of Object.entries(userCoordinates)) {
      const result = await User.updateOne(
        { email },
        { $set: { coordinates } }
      );
      
      if (result.modifiedCount > 0) {
        updated++;
        results.push({ email, status: 'updated', coordinates });
      } else {
        results.push({ email, status: 'not found or already updated' });
      }
    }

    res.json({
      message: `Updated ${updated} users with coordinates`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Update specific user with coordinates
router.post('/admin/update-user-coordinates', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can perform this action' });
    }

    const { email, latitude, longitude } = req.body;

    if (!email || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Email, latitude, and longitude are required' });
    }

    // Get location name from coordinates using reverse geocoding
    const reverseGeocode = require('../utils/reverseGeocode');
    const locationName = await reverseGeocode(latitude, longitude);

    const result = await User.updateOne(
      { email },
      { $set: { 
        coordinates: { latitude, longitude },
        address: locationName
      } }
    );

    if (result.modifiedCount > 0) {
      res.json({
        message: 'User coordinates updated successfully',
        email,
        address: locationName,
        coordinates: { latitude, longitude }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get location name from coordinates
router.post('/get-location-name', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const reverseGeocode = require('../utils/reverseGeocode');
    const locationName = await reverseGeocode(latitude, longitude);

    res.json({
      locationName,
      coordinates: { latitude, longitude }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Quick fix: Update current user's coordinates
router.post('/update-my-coordinates', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    console.log('📝 Update coordinates request:');
    console.log(`   User ID: ${req.user.id}`);
    console.log(`   Latitude: ${latitude} (type: ${typeof latitude})`);
    console.log(`   Longitude: ${longitude} (type: ${typeof longitude})`);

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Get location name from coordinates using reverse geocoding
    const reverseGeocode = require('../utils/reverseGeocode');
    const locationName = await reverseGeocode(latitude, longitude);

    console.log(`   Location name: ${locationName}`);

    // Update user with coordinates
    const result = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          coordinates: { 
            latitude: Number(latitude), 
            longitude: Number(longitude) 
          },
          address: locationName
        }
      },
      { new: true }
    );

    console.log('✅ Update result:');
    console.log(`   Modified: ${result ? 'Yes' : 'No'}`);
    console.log(`   Coordinates saved: ${JSON.stringify(result?.coordinates)}`);

    if (result) {
      res.json({
        message: 'Your coordinates updated successfully',
        address: locationName,
        coordinates: { latitude: result.coordinates.latitude, longitude: result.coordinates.longitude }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('❌ Error updating coordinates:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Diagnostic: Check current user's data
router.get('/me/debug', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log('🔍 User debug info:', {
      id: user._id,
      email: user.email,
      name: user.name,
      address: user.address,
      coordinates: user.coordinates,
      coordinatesType: typeof user.coordinates,
      hasLatitude: user.coordinates?.latitude !== undefined,
      hasLongitude: user.coordinates?.longitude !== undefined
    });
    
    res.json({
      user,
      hasCoordinates: !!(user.coordinates && user.coordinates.latitude && user.coordinates.longitude),
      coordinatesValue: user.coordinates,
      debug: {
        coordinatesType: typeof user.coordinates,
        hasLatitude: user.coordinates?.latitude !== undefined,
        hasLongitude: user.coordinates?.longitude !== undefined,
        latitudeValue: user.coordinates?.latitude,
        longitudeValue: user.coordinates?.longitude
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
