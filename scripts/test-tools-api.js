const axios = require('axios');

const testToolsAPI = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🧪 TESTING TOOLS API');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test 1: Get all tools
    console.log('Test 1: Fetching all tools...');
    const response = await axios.get('http://localhost:5000/api/tools');
    
    console.log(`✅ Found ${response.data.length} tools\n`);
    
    response.data.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Category: ${tool.category}`);
      console.log(`   Price: ₹${tool.pricePerDay}/day`);
      console.log(`   Owner: ${tool.owner?.name || 'N/A'}`);
      console.log(`   Available: ${tool.available ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Test 2: Test with filters
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Test 2: Testing filters...\n');
    
    const tractorResponse = await axios.get('http://localhost:5000/api/tools?category=Tractor');
    console.log(`Tractors: ${tractorResponse.data.length}`);
    
    const searchResponse = await axios.get('http://localhost:5000/api/tools?search=John');
    console.log(`Search "John": ${searchResponse.data.length}`);
    
    const priceResponse = await axios.get('http://localhost:5000/api/tools?minPrice=1000&maxPrice=3000');
    console.log(`Price ₹1000-3000: ${priceResponse.data.length}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL TESTS PASSED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
};

testToolsAPI();
