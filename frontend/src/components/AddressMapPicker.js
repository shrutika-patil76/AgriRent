import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddressMapPicker = ({ onAddressSelect, initialAddress = '' }) => {
  const [address, setAddress] = useState(initialAddress);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to center of India
          setUserLocation({ lat: 20.5937, lng: 78.9629 });
        }
      );
    }
  }, []);

  const initializeMap = () => {
    if (mapInstanceRef.current || !mapRef.current || !userLocation) return;

    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    L.marker([userLocation.lat, userLocation.lng], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    })
      .bindPopup('<strong>📍 Your Current Location</strong>')
      .addTo(map);

    // Handle map clicks to select location
    map.on('click', async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Remove previous marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Fetch location name from coordinates
      const locationName = await getLocationNameFromCoordinates(lat, lng);

      // Add new marker
      markerRef.current = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindPopup(`<strong>${locationName}</strong><br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}`)
        .addTo(map)
        .openPopup();

      setSelectedLocation({ lat, lng, name: locationName });
    });

    mapInstanceRef.current = map;
  };

  const handleMapSelect = () => {
    if (selectedLocation) {
      setAddress(selectedLocation.name);
      onAddressSelect(selectedLocation.name, { lat: selectedLocation.lat, lng: selectedLocation.lng });
      setShowMap(false);
    }
  };

  const getLocationNameFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/get-location-name', {
        latitude: lat,
        longitude: lng
      });
      return response.data.locationName;
    } catch (error) {
      console.error('Error fetching location name:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleManualInput = (e) => {
    const value = e.target.value;
    setAddress(value);
    onAddressSelect(value, null);
  };

  useEffect(() => {
    if (showMap && userLocation && !mapInstanceRef.current) {
      setTimeout(() => initializeMap(), 100);
    }
  }, [showMap, userLocation]);

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        📍 Address <span className="text-danger">*</span>
      </label>
      
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your address or select from map"
          value={address}
          onChange={handleManualInput}
          required
        />
        <Button
          variant="outline-primary"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? '🗺️ Hide Map' : '🗺️ Pick from Map'}
        </Button>
      </div>

      {showMap && (
        <Card className="mt-3 mb-3">
          <Card.Header className="bg-primary text-white">
            <h6 className="mb-0">📍 Select Your Address from Map</h6>
          </Card.Header>
          <Card.Body>
            {!userLocation ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading map...</p>
              </div>
            ) : (
              <>
                <div 
                  ref={mapRef}
                  style={{ height: '400px', borderRadius: '8px', marginBottom: '15px' }}
                />
                
                <Alert variant="info" className="mb-3">
                  <strong>💡 How to use:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Click on the map to select your location</li>
                    <li>Your coordinates will be captured automatically</li>
                    <li>Click "Confirm Selection" when done</li>
                  </ul>
                </Alert>

                {selectedLocation && (
                  <Alert variant="success">
                    <strong>✅ Selected:</strong> {selectedLocation.name}
                    <br />
                    <small>Latitude: {selectedLocation.lat.toFixed(4)}°, Longitude: {selectedLocation.lng.toFixed(4)}°</small>
                  </Alert>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleMapSelect}
                    disabled={!selectedLocation}
                    className="flex-grow-1"
                  >
                    ✓ Confirm Selection
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowMap(false)}
                    className="flex-grow-1"
                  >
                    ✕ Cancel
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AddressMapPicker;
