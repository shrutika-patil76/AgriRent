const mongoose = require('../backend/node_modules/mongoose');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

const User = require('../backend/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri_rental')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const changeRole = async () => {
  try {
    const email = 'shrutika8846@gmail.com';
    const newRole = 'owner'; // Change to 'farmer', 'owner', or 'admin'

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log(`\n📝 Current role: ${user.role}`);
    user.role = newRole;
    await user.save();
    
    console.log(`✅ Role changed to: ${newRole}`);
    console.log(`\nYou can now login as ${newRole} with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: password123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

changeRole();
