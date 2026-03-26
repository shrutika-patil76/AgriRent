const mongoose = require('../backend/node_modules/mongoose');
const bcrypt = require('../backend/node_modules/bcryptjs');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

const User = require('../backend/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const debugLogin = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DEBUG LOGIN ISSUE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const testEmail = 'rajesh.kumar@gmail.com';
    const testPassword = 'password123';

    // Step 1: Find user with exact email
    console.log('Step 1: Finding user with email:', testEmail);
    let user = await User.findOne({ email: testEmail });
    console.log('Found:', user ? 'YES' : 'NO');
    
    if (!user) {
      // Try lowercase
      console.log('\nTrying lowercase email...');
      user = await User.findOne({ email: testEmail.toLowerCase() });
      console.log('Found:', user ? 'YES' : 'NO');
    }

    if (!user) {
      console.log('\n❌ User not found in database');
      console.log('\nAll emails in database:');
      const allUsers = await User.find().select('email');
      allUsers.forEach(u => console.log('  -', u.email));
      process.exit(1);
    }

    console.log('\n✅ User found:', user.name);
    console.log('Email in DB:', user.email);
    console.log('Password hash:', user.password.substring(0, 30) + '...');

    // Step 2: Test password
    console.log('\nStep 2: Testing password...');
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Password matches:', isMatch ? 'YES ✅' : 'NO ❌');

    if (!isMatch) {
      console.log('\n❌ Password does not match!');
      console.log('This means the password in database is NOT "password123"');
    } else {
      console.log('\n✅ Password is correct!');
      console.log('Login should work with:');
      console.log(`Email: ${testEmail}`);
      console.log(`Password: ${testPassword}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

debugLogin();
