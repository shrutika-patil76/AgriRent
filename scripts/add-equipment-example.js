const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

// Import models
const User = require('../backend/models/User');
const Tool = require('../backend/models/Tool');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrirent')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const addEquipment = async () => {
  try {
    // First, find a tool owner to assign this equipment to
    // You can use any existing owner's email from your database
    const owner = await User.findOne({ email: 'priya.patel@gmail.com', role: 'owner' });
    
    if (!owner) {
      console.log('❌ No tool owner found. Please create a tool owner first.');
      process.exit(1);
    }

    console.log(`✅ Found owner: ${owner.name} (${owner.email})`);

    // Create new equipment
    const newEquipment = new Tool({
      name: 'John Deere 5075E Tractor',
      description: 'Powerful 75HP tractor perfect for heavy-duty farming operations. Features power steering, comfortable cabin, and excellent fuel efficiency. Ideal for plowing, tilling, and hauling operations.',
      category: 'Tractor',
      pricePerDay: 2500,
      deposit: 10000,
      images: [
        'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800'
      ],
      owner: owner._id,
      location: 'Pune, Maharashtra',
      available: true,
      rating: 0,
      reviewCount: 0,
      specifications: {
        brand: 'John Deere',
        model: '5075E',
        year: 2023,
        condition: 'Excellent'
      }
    });

    // Save to database
    await newEquipment.save();

    console.log('\n✅ Equipment added successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Equipment Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:           ${newEquipment.name}`);
    console.log(`Category:       ${newEquipment.category}`);
    console.log(`Price/Day:      ₹${newEquipment.pricePerDay}`);
    console.log(`Deposit:        ₹${newEquipment.deposit}`);
    console.log(`Location:       ${newEquipment.location}`);
    console.log(`Owner:          ${owner.name}`);
    console.log(`Brand:          ${newEquipment.specifications.brand}`);
    console.log(`Model:          ${newEquipment.specifications.model}`);
    console.log(`Year:           ${newEquipment.specifications.year}`);
    console.log(`Condition:      ${newEquipment.specifications.condition}`);
    console.log(`Available:      ${newEquipment.available ? 'Yes' : 'No'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding equipment:', error.message);
    process.exit(1);
  }
};

// Run the function
addEquipment();
