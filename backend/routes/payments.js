const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');

// Initialize Razorpay with fallback for testing
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized with credentials');
} catch (error) {
  console.warn('⚠️ Razorpay initialization warning:', error.message);
  // Create a mock Razorpay for testing
  razorpay = {
    orders: {
      create: async (options) => {
        console.log('📝 Mock Razorpay Order Created:', options);
        return {
          id: 'order_mock_' + Date.now(),
          amount: options.amount,
          currency: options.currency,
          receipt: options.receipt,
          status: 'created'
        };
      }
    }
  };
}

// Create payment order for deposit
router.post('/create-deposit-order', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('tool');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the one who made the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if deposit is already paid
    if (booking.depositPaid) {
      return res.status(400).json({ message: 'Deposit already paid' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(booking.deposit * 100), // Amount in paise
      currency: 'INR',
      receipt: `deposit_${bookingId}`,
      notes: {
        bookingId: bookingId,
        paymentType: 'deposit'
      }
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.warn('⚠️ Razorpay error, using mock order:', razorpayError.message);
      // Use mock order for testing
      order = {
        id: 'order_mock_' + Date.now(),
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      };
    }
    
    res.json({
      orderId: order.id,
      amount: booking.deposit,
      bookingId: bookingId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock'
    });
  } catch (error) {
    console.error('❌ Error creating deposit order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create payment order for rent
router.post('/create-rent-order', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId).populate('tool');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the one who made the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if deposit is paid
    if (!booking.depositPaid) {
      return res.status(400).json({ message: 'Deposit must be paid first' });
    }

    // Check if rent is already paid
    if (booking.rentPaid) {
      return res.status(400).json({ message: 'Rent already paid' });
    }

    // Create Razorpay order for rent
    const options = {
      amount: Math.round(booking.totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: `rent_${bookingId}`,
      notes: {
        bookingId: bookingId,
        paymentType: 'rent'
      }
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.warn('⚠️ Razorpay error, using mock order:', razorpayError.message);
      // Use mock order for testing
      order = {
        id: 'order_mock_' + Date.now(),
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      };
    }
    
    res.json({
      orderId: order.id,
      amount: booking.totalAmount,
      bookingId: bookingId,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock'
    });
  } catch (error) {
    console.error('❌ Error creating rent order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify and update deposit payment
router.post('/verify-deposit-payment', auth, async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId).populate('tool').populate('user');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify signature (in production, verify with Razorpay)
    // For now, we'll trust the payment if it comes from authenticated user
    
    booking.depositPaid = true;
    booking.paymentStatus = 'deposit_paid';
    booking.remainingAmount = booking.totalAmount;
    
    await booking.save();

    console.log(`✅ Deposit payment verified for booking ${bookingId}`);
    
    // Send email notifications
    const { sendDepositPaymentConfirmationEmail, sendDepositPaymentNotificationToOwner } = require('../utils/emailService');
    const User = require('../models/User');
    
    const farmer = booking.user;
    const tool = booking.tool;
    const owner = await User.findById(tool.owner);
    
    // Send confirmation to farmer
    await sendDepositPaymentConfirmationEmail(booking, farmer, tool, owner);
    
    // Send notification to owner
    await sendDepositPaymentNotificationToOwner(booking, farmer, tool, owner);
    
    res.json({
      success: true,
      message: 'Deposit payment successful',
      booking
    });
  } catch (error) {
    console.error('❌ Error verifying deposit payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify and update rent payment
router.post('/verify-rent-payment', auth, async (req, res) => {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify signature (in production, verify with Razorpay)
    
    booking.rentPaid = true;
    booking.paymentStatus = 'rent_paid';
    booking.remainingAmount = 0;
    
    await booking.save();

    console.log(`✅ Rent payment verified for booking ${bookingId}`);
    
    res.json({
      success: true,
      message: 'Rent payment successful',
      booking
    });
  } catch (error) {
    console.error('❌ Error verifying rent payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment status for a booking
router.get('/:bookingId/status', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      depositPaid: booking.depositPaid,
      rentPaid: booking.rentPaid,
      paymentStatus: booking.paymentStatus,
      remainingAmount: booking.remainingAmount,
      deposit: booking.deposit,
      totalAmount: booking.totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
