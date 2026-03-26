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

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  address: String
});

const User = mongoose.model('User', userSchema);

const deepDebug = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DEEP DEBUG - LOGIN ISSUE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const testEmail = 'rajesh.kumar@gmail.com';
    const testPassword = 'password123';

    console.log('Database:', 'agri_rental');
    console.log('Collection:', 'users');
    console.log('Test Email:', testEmail);
    console.log('Test Password:', testPassword);
    console.log('');

    // Step 1: Find user with exact email (no normalization)
    console.log('Step 1: Finding user with EXACT email...');
    let user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ Not found with exact email');
      
      // Try lowercase
      console.log('Trying lowercase...');
      user = await User.findOne({ email: testEmail.toLowerCase() });
      
      if (!user) {
        console.log('❌ Not found with lowercase either');
        console.log('\nAll emails in database:');
        const allUsers = await User.find().select('email');
        allUsers.forEach(u => console.log('  -', JSON.stringify(u.email)));
        process.exit(1);
      } else {
        console.log('✅ Found with lowercase');
      }
    } else {
      console.log('✅ Found with exact email');
    }

    console.log('\nUser Details:');
    console.log('  ID:', user._id);
    console.log('  Name:', user.name);
    console.log('  Email:', JSON.stringify(user.email));
    console.log('  Role:', user.role);
    console.log('  Password Hash:', user.password);
    console.log('  Hash Length:', user.password.length);
    console.log('  Hash starts with:', user.password.substring(0, 7));

    // Step 2: Test password comparison
    console.log('\nStep 2: Testing bcrypt.compare...');
    console.log('Comparing:', JSON.stringify(testPassword));
    console.log('Against hash:', user.password.substring(0, 30) + '...');
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Result:', isMatch ? '✅ MATCH' : '❌ NO MATCH');

    if (!isMatch) {
      console.log('\n❌ PASSWORD DOES NOT MATCH!');
      console.log('\nTrying to hash the test password and compare:');
      const testHash = await bcrypt.hash(testPassword, 10);
      console.log('New hash:', testHash);
      const testMatch = await bcrypt.compare(testPassword, testHash);
      console.log('New hash works:', testMatch ? 'YES' : 'NO');
      
      console.log('\nThe password in database is WRONG or CORRUPTED');
    }

    // Step 3: Check admin user for comparison
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3: Checking admin user (which works)...');
    const admin = await User.findOne({ email: 'admin@agrirent.com' });
    
    if (admin) {
      console.log('Admin password hash:', admin.password);
      const adminMatch = await bcrypt.compare(testPassword, admin.password);
      console.log('Admin password matches:', adminMatch ? '✅ YES' : '❌ NO');
      
      console.log('\nComparing hashes:');
      console.log('Rajesh hash:', user.password);
      console.log('Admin hash: ', admin.password);
      console.log('Are they same?:', user.password === admin.password ? 'YES' : 'NO');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

deepDebug();
