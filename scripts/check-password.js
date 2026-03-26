const mongoose = require('../backend/node_modules/mongoose');
const bcrypt = require('../backend/node_modules/bcryptjs');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

const User = require('../backend/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const checkPassword = async () => {
  try {
    const email = 'rajesh.kumar@gmail.com'; // Test with Rajesh
    const testPassword = 'password123'; // Test password

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 PASSWORD CHECK');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    console.log('✅ User found:', user.name);
    console.log('📧 Email:', user.email);
    console.log('👤 Role:', user.role);
    console.log('\n🔑 Testing password:', testPassword);
    console.log('🔒 Stored hash:', user.password.substring(0, 30) + '...');

    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (isMatch) {
      console.log('✅ PASSWORD MATCHES!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\nYou can login with:');
      console.log('Email:', email);
      console.log('Password:', testPassword);
    } else {
      console.log('❌ PASSWORD DOES NOT MATCH!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\nThe password in database is different.');
      console.log('Try these common passwords:');
      console.log('- password123');
      console.log('- Password123');
      console.log('- 123456');
    }
    console.log('\n');

    // Check all users
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ALL USER CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const allUsers = await User.find();
    for (const u of allUsers) {
      const match = await bcrypt.compare('password123', u.password);
      console.log(`${match ? '✅' : '❌'} ${u.email} (${u.role})`);
      if (match) {
        console.log(`   Password: password123`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkPassword();
