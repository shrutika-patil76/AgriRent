const mongoose = require('../backend/node_modules/mongoose');
const bcrypt = require('../backend/node_modules/bcryptjs');

// Use EXACT same connection as backend
const MONGODB_URI = 'mongodb://localhost:27017/agri_rental';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define User schema inline to avoid any model issues
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  address: String
});

const User = mongoose.model('User', userSchema);

const fixPasswords = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 FIXING ALL PASSWORDS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Get all users
    const users = await User.find();
    
    console.log(`Found ${users.length} users in database: agri_rental\n`);

    if (users.length === 0) {
      console.log('❌ No users found! Database might be empty.');
      process.exit(1);
    }

    // Update each user's password
    for (const user of users) {
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      console.log(`✅ Updated: ${user.email} (${user.role})`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL PASSWORDS SET TO: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify one password
    const testUser = users[0];
    const reloadedUser = await User.findById(testUser._id);
    const isMatch = await bcrypt.compare(newPassword, reloadedUser.password);
    
    console.log('Verification:');
    console.log(`Testing ${testUser.email}...`);
    console.log(`Password matches: ${isMatch ? '✅ YES' : '❌ NO'}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixPasswords();
