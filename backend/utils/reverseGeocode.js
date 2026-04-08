// Reverse geocoding utility to convert coordinates to location names
// Using Nominatim (OpenStreetMap) free API

const axios = require('axios');

const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log(`🔍 Reverse geocoding: ${latitude}, ${longitude}`);
    
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
        zoom: 10,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'AgriRent-App'
      },
      timeout: 5000
    });

    console.log('📍 Nominatim response:', response.data);

    if (response.data && response.data.address) {
      const address = response.data.address;
      
      // Try to construct a meaningful location name
      // Priority: city > town > village > county > state_district > state
      const city = address.city || 
                   address.town || 
                   address.village || 
                   address.county ||
                   address.state_district ||
                   '';
      const state = address.state || '';

      if (city && state) {
        const result = `${city}, ${state}`;
        console.log(`✅ Location name: ${result}`);
        return result;
      } else if (city) {
        console.log(`✅ Location name: ${city}`);
        return city;
      } else if (state) {
        console.log(`✅ Location name: ${state}`);
        return state;
      } else {
        const result = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        console.log(`⚠️ Fallback to coordinates: ${result}`);
        return result;
      }
    }

    const result = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    console.log(`⚠️ No address data, fallback to coordinates: ${result}`);
    return result;
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error.message);
    // Fallback to coordinates if API fails
    const result = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    console.log(`⚠️ API error, fallback to coordinates: ${result}`);
    return result;
  }
};

module.exports = reverseGeocode;
