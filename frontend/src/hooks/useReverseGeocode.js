import { useState, useEffect } from 'react';
import axios from 'axios';

const useReverseGeocode = (latitude, longitude) => {
  const [locationName, setLocationName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) {
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
          timeout: 10000
        });
        
        const name = response.data.locationName || response.data.address || 'Unknown Location';
        setLocationName(name);
        setError(null);
      } catch (err) {
        console.error('Error fetching location name:', err);
        // Fallback to coordinates if API fails
        setLocationName(`${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationName();
  }, [latitude, longitude]);

  return { locationName, loading, error };
};

export default useReverseGeocode;
