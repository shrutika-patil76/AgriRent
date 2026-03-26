const mongoose = require('../backend/node_modules/mongoose');
const bcrypt = require('../backend/node_modules/bcryptjs');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

const User = require('../backend/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const resetAllPasswords = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 RESETTING ALL PASSWORDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Get all users
    const users = await User.find();
    
    console.log(`Found ${users.length} users\n`);

    // Update each user's password
    for (const user of users) {
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ ${user.email} (${user.role})`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL PASSWORDS RESET TO: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`${user.email} / password123 (${user.role})`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAllPasswords();
