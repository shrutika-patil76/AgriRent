// Reverse geocoding utility to convert coordinates to location names
// Using Nominatim (OpenStreetMap) free API with caching and rate limiting

const axios = require('axios');

// Cache to store location names
const locationCache = new Map();

// Rate limiting: Track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds between requests (Nominatim limit is 1 req/sec)

// Queue for pending requests
const requestQueue = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const { latitude, longitude, resolve } = requestQueue.shift();
    
    // Wait for rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    try {
      const result = await fetchFromAPI(latitude, longitude);
      resolve(result);
    } catch (error) {
      resolve(`${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`);
    }

    lastRequestTime = Date.now();
  }

  isProcessingQueue = false;
};

const fetchFromAPI = async (latitude, longitude) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
    params: {
      format: 'json',
      lat: latitude,
      lon: longitude,
      zoom: 10,
      addressdetails: 1
    },
    headers: {
      'User-Agent': 'AgriRent-App/1.0'
    },
    timeout: 8000
  });

  if (response.data && response.data.address) {
    const address = response.data.address;
    
    const city = address.city || 
                 address.town || 
                 address.village || 
                 address.county ||
                 address.state_district ||
                 '';
    const state = address.state || '';
    const country = address.country || '';

    if (city && state) {
      return `${city}, ${state}`;
    } else if (city) {
      return city;
    } else if (state) {
      return state;
    } else if (country) {
      return country;
    }
  }

  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};

const reverseGeocode = async (latitude, longitude) => {
  try {
    console.log(`🔍 Reverse geocoding: ${latitude}, ${longitude}`);
    
    // Validate coordinates
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.log('⚠️ Invalid coordinates');
      return 'Unknown Location';
    }

    // Create cache key
    const cacheKey = `${parseFloat(latitude).toFixed(4)},${parseFloat(longitude).toFixed(4)}`;
    
    // Check cache first
    if (locationCache.has(cacheKey)) {
      const cached = locationCache.get(cacheKey);
      console.log(`✅ Using cached location: ${cached}`);
      return cached;
    }

    // Add to queue and wait for result
    const result = await new Promise((resolve) => {
      requestQueue.push({ latitude, longitude, resolve });
      processQueue();
    });

    // Cache the result
    locationCache.set(cacheKey, result);
    console.log(`✅ Location name: ${result}`);
    
    return result;
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error.message);
    const result = `${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`;
    console.log(`⚠️ Fallback to coordinates: ${result}`);
    return result;
  }
};

module.exports = reverseGeocode;
