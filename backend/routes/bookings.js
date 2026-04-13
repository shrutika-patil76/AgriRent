const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Tool = require('../models/Tool');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { 
  sendBookingConfirmationEmail, 
  sendBookingRejectionEmail, 
  sendBookingRequestEmail,
  sendFarmerCancellationConfirmationEmail,
  sendFarmerCancellationEmail
} = require('../utils/emailService');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { toolId, startDate, endDate } = req.body;

    const tool = await Tool.findById(toolId).populate('owner');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check for overlapping bookings (confirmed or ongoing)
    const overlapping = await Booking.findOne({
      tool: toolId,
      status: { $in: ['confirmed', 'ongoing'] },
      $or: [
        // New booking starts during existing booking
        { startDate: { $lte: start }, endDate: { $gte: start } },
        // New booking ends during existing booking
        { startDate: { $lte: end }, endDate: { $gte: end } },
        // New booking completely contains existing booking
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ 
        message: `Equipment is already booked from ${new Date(overlapping.startDate).toLocaleDateString()} to ${new Date(overlapping.endDate).toLocaleDateString()}. Please select different dates.` 
      });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * tool.pricePerDay;

    const booking = new Booking({
      user: req.user.id,
      tool: toolId,
      startDate,
      endDate,
      totalDays,
      totalAmount,
      deposit: tool.deposit
    });

    await booking.save();

    // Send email notification to tool owner about new booking request
    try {
      const farmer = await User.findById(req.user.id);
      console.log(`📧 Sending booking request email to owner: ${tool.owner.email}`);
      await sendBookingRequestEmail(booking, farmer, tool, tool.owner);
    } catch (emailError) {
      console.error('⚠️ Email sending failed (but booking was created):', emailError.message);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error('❌ Booking creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('tool')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booked dates for a specific tool
router.get('/tool/:toolId/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find({
      tool: req.params.toolId,
      status: { $in: ['confirmed', 'ongoing'] }
    }).select('startDate endDate status');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get bookings for tool owner's equipment
router.get('/owner-bookings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Find all tools owned by this user
    const tools = await Tool.find({ owner: req.user.id });
    const toolIds = tools.map(tool => tool._id);
    
    // Find all bookings for these tools
    const bookings = await Booking.find({ tool: { $in: toolIds } })
      .populate('user', 'name email phone')
      .populate('tool', 'name category pricePerDay')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (Admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tool', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('tool');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const isOwner = booking.tool.owner.toString() === req.user.id;
    const isFarmer = booking.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Farmers can only cancel their own pending bookings
    if (isFarmer && !isOwner && !isAdmin) {
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'You can only cancel your bookings' });
      }
      if (booking.status !== 'pending') {
        return res.status(403).json({ message: 'You can only cancel pending bookings' });
      }
    }

    // Owners and admins can change any status
    if (!isOwner && !isAdmin && !isFarmer) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    // Track who cancelled the booking
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      if (isFarmer && !isOwner) {
        booking.cancelledBy = 'farmer';
      } else if (isOwner && !isFarmer) {
        booking.cancelledBy = 'owner';
      } else if (isAdmin) {
        booking.cancelledBy = 'admin';
      }
    }
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate({
        path: 'tool',
        populate: {
          path: 'owner',
          select: 'name phone email'
        }
      });
    
    // Send email notifications based on status change
    try {
      if (status === 'confirmed' && oldStatus === 'pending') {
        // Send confirmation email to farmer
        await sendBookingConfirmationEmail(
          populatedBooking,
          populatedBooking.user,
          populatedBooking.tool
        );
      } else if (status === 'cancelled') {
        // Check who cancelled
        if (booking.cancelledBy === 'farmer') {
          // Farmer cancelled - send different emails
          console.log(`📧 Farmer cancelled booking - Notifying both parties`);
          
          // Send confirmation to farmer that their cancellation was successful
          await sendFarmerCancellationConfirmationEmail(
            populatedBooking,
            populatedBooking.user
          );
          
          // Send notification to owner about farmer cancellation
          await sendFarmerCancellationEmail(
            populatedBooking,
            populatedBooking.tool.owner,
            populatedBooking.user
          );
        } else {
          // Owner or admin cancelled - send rejection email to farmer
          await sendBookingRejectionEmail(
            populatedBooking,
            populatedBooking.user,
            populatedBooking.tool
          );
        }
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed (but booking status was updated):', emailError.message);
      // Don't fail the status update if email fails
    }
    
    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
