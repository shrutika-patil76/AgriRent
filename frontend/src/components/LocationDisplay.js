import React from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import useReverseGeocode from '../hooks/useReverseGeocode';

const LocationDisplay = ({ latitude, longitude, showDistance = null }) => {
  const { locationName, loading } = useReverseGeocode(latitude, longitude);

  // Debug logging
  React.useEffect(() => {
    console.log('LocationDisplay - lat:', latitude, 'lng:', longitude, 'loading:', loading, 'name:', locationName);
  }, [latitude, longitude, loading, locationName]);

  return (
    <p className="text-muted mb-2">
      <FaMapMarkerAlt /> 
      {loading ? (
        <>
          <FaSpinner className="spinner" /> Loading location...
        </>
      ) : (
        locationName || `${parseFloat(latitude).toFixed(4)}, ${parseFloat(longitude).toFixed(4)}`
      )}
      {showDistance && (
        <span className="ms-2 badge bg-info">
          {showDistance.toFixed(1)} km away
        </span>
      )}
    </p>
  );
};

export default LocationDisplay;
