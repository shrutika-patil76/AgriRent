import { useState, useEffect } from 'react';
import axios from 'axios';

const useReverseGeocode = (latitude, longitude) => {
  const [locationName, setLocationName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      setLocationName('Unknown Location');
      setLoading(false);
      return;
    }

    const fetchLocationName = async () => {
      try {
        setLoading(true);
        // Call the backend endpoint that uses reverseGeocode utility
        const response = await axios.post('http://localhost:5000/api/auth/get-location-name', {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }, {
          timeout: 15000 // Increased timeout to account for rate limiting
        });
        
        const name = response.data.locationName || response.data.address || 'Unknown Location';
        setLocationName(name);
        setError(null);
      } catch (err) {
        console.error('Error fetching location name:', err.message);
        // Fallback to coordinates if API fails
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          setLocationName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        } else {
          setLocationName('Unknown Location');
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Add a random delay to spread out requests and avoid rate limiting
    const randomDelay = Math.random() * 500 + 200; // 200-700ms random delay
    const timer = setTimeout(() => {
      fetchLocationName();
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [latitude, longitude]);

  return { locationName, loading, error };
};

export default useReverseGeocode;
