const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Tool = require('./models/Tool');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const equipmentImages = require('./equipment-images');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample data
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Tool.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Users - All near Sangli, Maharashtra
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@gmail.com',
        password: hashedPassword,
        role: 'farmer',
        phone: '+91-9876543210',
        address: 'Sangli City, Maharashtra, India',
        coordinates: { latitude: 16.8056, longitude: 74.6568 }
      },
      {
        name: 'Amit Singh',
        email: 'amit.singh@gmail.com',
        password: hashedPassword,
        role: 'owner',
        phone: '+91-9876543211',
        address: 'Miraj, Maharashtra, India',
        coordinates: { latitude: 16.8186, longitude: 74.7597 },
        upiId: 'amit.singh@upi',
        paymentQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      {
        name: 'Suresh Patel',
        email: 'suresh.patel@gmail.com',
        password: hashedPassword,
        role: 'farmer',
        phone: '+91-9876543212',
        address: 'Kupwad, Maharashtra, India',
        coordinates: { latitude: 16.7500, longitude: 74.5500 }
      },
      {
        name: 'Ramesh Verma',
        email: 'ramesh.verma@gmail.com',
        password: hashedPassword,
        role: 'owner',
        phone: '+91-9876543213',
        address: 'Tasgaon, Maharashtra, India',
        coordinates: { latitude: 16.9500, longitude: 74.8000 },
        upiId: 'ramesh.verma@upi',
        paymentQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      {
        name: 'Admin User',
        email: 'admin@agrirent.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91-9876543214',
        address: 'Walwa, Maharashtra, India',
        coordinates: { latitude: 16.7000, longitude: 74.4000 }
      },
      {
        name: 'Vijay Sharma',
        email: 'vijay.sharma@gmail.com',
        password: hashedPassword,
        role: 'owner',
        phone: '+91-9876543215',
        address: 'Arag, Maharashtra, India',
        coordinates: { latitude: 16.6500, longitude: 74.3500 },
        upiId: 'vijay.sharma@upi',
        paymentQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      {
        name: 'Shrutika Patil',
        email: 'shrutika8846@gmail.com',
        password: await bcrypt.hash('Password123', 10),
        role: 'owner',
        phone: '+91-9876543216',
        address: 'Ichalkaranji, Maharashtra, India',
        coordinates: { latitude: 16.6833, longitude: 75.1333 },
        upiId: 'shrutika.patil@upi',
        paymentQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Get owner IDs
    const owner1 = users.find(u => u.email === 'amit.singh@gmail.com');
    const owner2 = users.find(u => u.email === 'ramesh.verma@gmail.com');
    const owner3 = users.find(u => u.email === 'vijay.sharma@gmail.com');
    const farmer1 = users.find(u => u.email === 'rajesh.kumar@gmail.com');
    const farmer2 = users.find(u => u.email === 'suresh.patel@gmail.com');

    // Create Tools with real images
    console.log('🚜 Creating equipment...');
    const tools = await Tool.insertMany([
      {
        name: 'John Deere 5050D Tractor',
        description: 'Powerful 50HP tractor suitable for all farming operations.',
        category: 'Tractor',
        pricePerDay: 2500,
        deposit: 10000,
        images: [equipmentImages.tractor, equipmentImages.tractor],
        owner: owner1._id,
        location: 'Miraj, Maharashtra, India',
        coordinates: { latitude: 16.8186, longitude: 74.7597 },
        available: true,
        rating: 4.5,
        reviewCount: 12,
        specifications: { brand: 'John Deere', model: '5050D', year: 2022, condition: 'Excellent' }
      },
      {
        name: 'Mahindra 575 DI Tractor',
        description: 'Reliable 47HP tractor with excellent fuel efficiency.',
        category: 'Tractor',
        pricePerDay: 2000,
        deposit: 8000,
        images: [equipmentImages.tractor, equipmentImages.tractor],
        owner: owner2._id,
        location: 'Tasgaon, Maharashtra, India',
        coordinates: { latitude: 16.9500, longitude: 74.8000 },
        available: true,
        rating: 4.3,
        reviewCount: 8,
        specifications: { brand: 'Mahindra', model: '575 DI', year: 2021, condition: 'Good' }
      },
      {
        name: 'New Holland TC5070 Combine Harvester',
        description: 'High-capacity combine harvester for wheat and rice.',
        category: 'Harvester',
        pricePerDay: 5000,
        deposit: 20000,
        images: [equipmentImages.harvester, equipmentImages.harvester],
        owner: owner1._id,
        location: 'Miraj, Maharashtra, India',
        coordinates: { latitude: 16.8186, longitude: 74.7597 },
        available: true,
        rating: 4.8,
        reviewCount: 15,
        specifications: { brand: 'New Holland', model: 'TC5070', year: 2020, condition: 'Excellent' }
      },
      {
        name: 'Rotavator 7 Feet',
        description: 'Heavy-duty rotavator for soil preparation.',
        category: 'Plough',
        pricePerDay: 800,
        deposit: 3000,
        images: [equipmentImages.plough],
        owner: owner3._id,
        location: 'Arag, Maharashtra, India',
        coordinates: { latitude: 16.6500, longitude: 74.3500 },
        available: true,
        rating: 4.2,
        reviewCount: 6,
        specifications: { brand: 'Fieldking', model: 'Super Seeder', year: 2023, condition: 'New' }
      },
      {
        name: 'Seed Drill Machine',
        description: 'Precision seed drill for uniform seed distribution.',
        category: 'Seeder',
        pricePerDay: 1200,
        deposit: 5000,
        images: [equipmentImages.seeder],
        owner: owner2._id,
        location: 'Tasgaon, Maharashtra, India',
        coordinates: { latitude: 16.9500, longitude: 74.8000 },
        available: true,
        rating: 4.6,
        reviewCount: 10,
        specifications: { brand: 'Lemken', model: 'Solitair 9', year: 2022, condition: 'Excellent' }
      },
      {
        name: 'Agricultural Sprayer 400L',
        description: 'High-pressure sprayer for pesticides and fertilizers.',
        category: 'Sprayer',
        pricePerDay: 600,
        deposit: 2000,
        images: [equipmentImages.sprayer],
        owner: owner3._id,
        location: 'Arag, Maharashtra, India',
        coordinates: { latitude: 16.6500, longitude: 74.3500 },
        available: true,
        rating: 4.4,
        reviewCount: 7,
        specifications: { brand: 'Neptune', model: '400L', year: 2023, condition: 'New' }
      },
      {
        name: 'Swaraj 855 FE Tractor',
        description: 'Robust 60HP tractor with power steering.',
        category: 'Tractor',
        pricePerDay: 2800,
        deposit: 12000,
        images: [equipmentImages.tractor, equipmentImages.tractor],
        owner: owner1._id,
        location: 'Miraj, Maharashtra, India',
        coordinates: { latitude: 16.8186, longitude: 74.7597 },
        available: true,
        rating: 4.7,
        reviewCount: 14,
        specifications: { brand: 'Swaraj', model: '855 FE', year: 2021, condition: 'Good' }
      },
      {
        name: 'Kubota Combine Harvester',
        description: 'Compact and efficient harvester for small to medium farms.',
        category: 'Harvester',
        pricePerDay: 4500,
        deposit: 18000,
        images: [equipmentImages.harvester, equipmentImages.harvester],
        owner: owner2._id,
        location: 'Tasgaon, Maharashtra, India',
        coordinates: { latitude: 16.9500, longitude: 74.8000 },
        available: false,
        rating: 4.5,
        reviewCount: 9,
        specifications: { brand: 'Kubota', model: 'DC-70G', year: 2022, condition: 'Excellent' }
      },
      {
        name: 'Massey Ferguson 245 DI Tractor',
        description: 'Classic 50HP tractor known for reliability.',
        category: 'Tractor',
        pricePerDay: 2200,
        deposit: 9000,
        images: [equipmentImages.tractor, equipmentImages.tractor],
        owner: owner3._id,
        location: 'Arag, Maharashtra, India',
        coordinates: { latitude: 16.6500, longitude: 74.3500 },
        available: true,
        rating: 4.6,
        reviewCount: 11,
        specifications: { brand: 'Massey Ferguson', model: '245 DI', year: 2021, condition: 'Excellent' }
      },
      {
        name: 'Disc Harrow 20 Blades',
        description: 'Heavy-duty disc harrow for soil preparation.',
        category: 'Plough',
        pricePerDay: 900,
        deposit: 3500,
        images: [equipmentImages.plough],
        owner: owner1._id,
        location: 'Miraj, Maharashtra, India',
        coordinates: { latitude: 16.8186, longitude: 74.7597 },
        available: true,
        rating: 4.3,
        reviewCount: 5,
        specifications: { brand: 'Lemken', model: 'Rubin 9', year: 2023, condition: 'New' }
      },
      {
        name: 'Potato Planter Machine',
        description: 'Automatic potato planter with precise spacing control.',
        category: 'Seeder',
        pricePerDay: 1500,
        deposit: 6000,
        images: [equipmentImages.seeder],
        owner: owner2._id,
        location: 'Tasgaon, Maharashtra, India',
        coordinates: { latitude: 16.9500, longitude: 74.8000 },
        available: true,
        rating: 4.7,
        reviewCount: 8,
        specifications: { brand: 'Grimme', model: 'GL 34K', year: 2022, condition: 'Excellent' }
      },
      {
        name: 'Boom Sprayer 600L',
        description: 'Professional boom sprayer with 12-meter coverage.',
        category: 'Sprayer',
        pricePerDay: 1000,
        deposit: 4000,
        images: [equipmentImages.sprayer],
        owner: owner3._id,
        location: 'Arag, Maharashtra, India',
        coordinates: { latitude: 16.6500, longitude: 74.3500 },
        available: true,
        rating: 4.8,
        reviewCount: 13,
        specifications: { brand: 'Hardi', model: 'Commander 6000', year: 2023, condition: 'New' }
      }
    ]);
    console.log(`✅ Created ${tools.length} equipment items`);

    // Create Bookings
    console.log('📅 Creating bookings...');
    const bookings = await Booking.insertMany([
      {
        user: farmer1._id,
        tool: tools[0]._id,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-05'),
        totalDays: 4,
        totalAmount: 10000,
        deposit: 10000,
        status: 'confirmed',
        paymentStatus: 'pending',
        depositPaid: false,
        rentPaid: false,
        remainingAmount: 20000
      },
      {
        user: farmer2._id,
        tool: tools[2]._id,
        startDate: new Date('2026-04-10'),
        endDate: new Date('2026-04-15'),
        totalDays: 5,
        totalAmount: 25000,
        deposit: 20000,
        status: 'pending',
        paymentStatus: 'pending',
        depositPaid: false,
        rentPaid: false,
        remainingAmount: 45000
      },
      {
        user: farmer1._id,
        tool: tools[3]._id,
        startDate: new Date('2026-03-20'),
        endDate: new Date('2026-03-22'),
        totalDays: 2,
        totalAmount: 1600,
        deposit: 3000,
        status: 'completed',
        paymentStatus: 'rent_paid',
        depositPaid: true,
        rentPaid: true,
        remainingAmount: 0
      },
      {
        user: farmer2._id,
        tool: tools[1]._id,
        startDate: new Date('2026-03-25'),
        endDate: new Date('2026-03-28'),
        totalDays: 3,
        totalAmount: 6000,
        deposit: 8000,
        status: 'ongoing',
        paymentStatus: 'rent_paid',
        depositPaid: true,
        rentPaid: true,
        remainingAmount: 0
      },
      {
        user: farmer1._id,
        tool: tools[4]._id,
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-04-23'),
        totalDays: 3,
        totalAmount: 3600,
        deposit: 5000,
        status: 'confirmed',
        paymentStatus: 'pending',
        depositPaid: false,
        rentPaid: false,
        remainingAmount: 8600
      }
    ]);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Create Reviews
    console.log('⭐ Creating reviews...');
    const reviews = await Review.insertMany([
      { user: farmer1._id, tool: tools[0]._id, rating: 5, comment: 'Excellent tractor!' },
      { user: farmer2._id, tool: tools[0]._id, rating: 4, comment: 'Good tractor, worked perfectly.' },
      { user: farmer1._id, tool: tools[2]._id, rating: 5, comment: 'Amazing harvester!' },
      { user: farmer2._id, tool: tools[1]._id, rating: 4, comment: 'Reliable tractor.' },
      { user: farmer1._id, tool: tools[3]._id, rating: 4, comment: 'Good rotavator.' },
      { user: farmer2._id, tool: tools[4]._id, rating: 5, comment: 'Perfect seed drill!' },
      { user: farmer1._id, tool: tools[5]._id, rating: 4, comment: 'Good sprayer.' },
      { user: farmer2._id, tool: tools[6]._id, rating: 5, comment: 'Powerful tractor!' }
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🚜 Equipment: ${tools.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   ⭐ Reviews: ${reviews.length}`);
    console.log('\n✅ You can now login with:');
    console.log('   Farmer: rajesh.kumar@gmail.com / password123');
    console.log('   Owner: amit.singh@gmail.com / password123');
    console.log('   Admin: admin@agrirent.com / password123');
    console.log('\n🌐 Visit: http://localhost:3000');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
