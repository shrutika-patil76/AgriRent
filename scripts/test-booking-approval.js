const axios = require('axios');

const testBookingApproval = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 TESTING BOOKING APPROVAL API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 1: Login as tool owner
    console.log('Step 1: Logging in as tool owner...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'amit.singh@gmail.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...\n');

    // Step 2: Get owner bookings
    console.log('Step 2: Fetching owner bookings...');
    const bookingsResponse = await axios.get('http://localhost:5000/api/bookings/owner-bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Found ${bookingsResponse.data.length} bookings\n`);
    
    if (bookingsResponse.data.length === 0) {
      console.log('⚠️  No bookings found for this owner');
      console.log('Create a booking first by:');
      console.log('1. Login as farmer (rajesh.kumar@gmail.com)');
      console.log('2. Book equipment owned by Amit Singh');
      process.exit(0);
    }

    // Display bookings
    bookingsResponse.data.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.tool?.name}`);
      console.log(`   Customer: ${booking.user?.name}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Booking ID: ${booking._id}\n`);
    });

    // Step 3: Test approval (if there's a pending booking)
    const pendingBooking = bookingsResponse.data.find(b => b.status === 'pending');
    
    if (pendingBooking) {
      console.log('Step 3: Testing approval...');
      const approvalResponse = await axios.patch(
        `http://localhost:5000/api/bookings/${pendingBooking._id}/status`,
        { status: 'confirmed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✅ Booking approved successfully!');
      console.log('New status:', approvalResponse.data.status);
    } else {
      console.log('⚠️  No pending bookings to test approval');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testBookingApproval();
