const mongoose = require('../backend/node_modules/mongoose');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

// Import models
const User = require('../backend/models/User');
const Tool = require('../backend/models/Tool');
const Booking = require('../backend/models/Booking');
const Review = require('../backend/models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const viewData = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 DATABASE OVERVIEW');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Count documents
    const userCount = await User.countDocuments();
    const toolCount = await Tool.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const reviewCount = await Review.countDocuments();

    console.log(`👥 Total Users:     ${userCount}`);
    console.log(`🚜 Total Tools:     ${toolCount}`);
    console.log(`📅 Total Bookings:  ${bookingCount}`);
    console.log(`⭐ Total Reviews:   ${reviewCount}`);

    // Show Users
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👥 USERS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const users = await User.find().select('-password');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log('');
    });

    // Show Tools
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚜 EQUIPMENT/TOOLS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const tools = await Tool.find().populate('owner', 'name email');
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Category: ${tool.category}`);
      console.log(`   Price/Day: ₹${tool.pricePerDay}`);
      console.log(`   Deposit: ₹${tool.deposit}`);
      console.log(`   Location: ${tool.location}`);
      console.log(`   Owner: ${tool.owner?.name || 'N/A'}`);
      console.log(`   Available: ${tool.available ? 'Yes' : 'No'}`);
      console.log(`   Rating: ${tool.rating} (${tool.reviewCount} reviews)`);
      console.log('');
    });

    // Show Bookings
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📅 BOOKINGS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('tool', 'name');
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.tool?.name || 'N/A'}`);
      console.log(`   Booked by: ${booking.user?.name || 'N/A'}`);
      console.log(`   Start: ${new Date(booking.startDate).toLocaleDateString()}`);
      console.log(`   End: ${new Date(booking.endDate).toLocaleDateString()}`);
      console.log(`   Days: ${booking.totalDays}`);
      console.log(`   Rent: ₹${booking.totalAmount}`);
      console.log(`   Deposit: ₹${booking.deposit}`);
      console.log(`   Total: ₹${booking.totalAmount + booking.deposit}`);
      console.log(`   Status: ${booking.status}`);
      console.log('');
    });

    // Show Reviews
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⭐ REVIEWS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('tool', 'name');
    reviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.tool?.name || 'N/A'}`);
      console.log(`   By: ${review.user?.name || 'N/A'}`);
      console.log(`   Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
      console.log(`   Comment: ${review.comment}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the function
viewData();
