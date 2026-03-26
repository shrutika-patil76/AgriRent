const axios = require('axios');

const testLogin = async () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 TESTING LOGIN FUNCTIONALITY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const testAccounts = [
    { email: 'rajesh.kumar@gmail.com', password: 'password123', role: 'farmer' },
    { email: 'amit.singh@gmail.com', password: 'password123', role: 'owner' },
    { email: 'admin@agrirent.com', password: 'password123', role: 'admin' },
    { email: 'shrutika8846@gmail.com', password: 'password123', role: 'farmer' }
  ];

  for (const account of testAccounts) {
    try {
      console.log(`Testing: ${account.email}`);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: account.email,
        password: account.password
      });

      if (response.data.token && response.data.user) {
        console.log(`✅ SUCCESS`);
        console.log(`   Name: ${response.data.user.name}`);
        console.log(`   Role: ${response.data.user.role}`);
        console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      } else {
        console.log(`❌ FAILED - No token received`);
      }
    } catch (error) {
      console.log(`❌ FAILED`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      if (error.response?.status) {
        console.log(`   Status: ${error.response.status}`);
      }
    }
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

testLogin();
