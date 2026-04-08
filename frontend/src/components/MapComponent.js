import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ tools, onSelectTool }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nearestTools, setNearestTools] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [manualLocationMode, setManualLocationMode] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Default locations for manual selection
  const defaultLocations = {
    'Ludhiana, Punjab': { lat: 30.9010, lng: 75.8573 },
    'Jaipur, Rajasthan': { lat: 26.9124, lng: 75.7873 },
    'Chandigarh, Punjab': { lat: 30.7333, lng: 76.8277 },
    'Delhi, India': { lat: 28.7041, lng: 77.1025 },
    'Ahmedabad, Gujarat': { lat: 23.0225, lng: 72.5714 }
  };

  useEffect(() => {
    // Fetch user's registered address coordinates from backend
    const fetchUserLocation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.coordinates && response.data.coordinates.latitude && response.data.coordinates.longitude) {
            const loc = {
              lat: response.data.coordinates.latitude,
              lng: response.data.coordinates.longitude
            };
            console.log('📍 User Address Coordinates:', loc);
            setUserLocation(loc);
            calculateNearestTools(loc);
            setLoading(false);
          } else {
            console.log('⚠️ User has no coordinates stored, using geolocation');
            // Fallback to geolocation
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  setUserLocation(loc);
                  calculateNearestTools(loc);
                  setLoading(false);
                },
                (error) => {
                  console.error('Geolocation error:', error);
                  setManualLocationMode(true);
                  setLoading(false);
                }
              );
            } else {
              setManualLocationMode(true);
              setLoading(false);
            }
          }
        } else {
          // Not logged in, use geolocation
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const loc = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                setUserLocation(loc);
                calculateNearestTools(loc);
                setLoading(false);
              },
              (error) => {
                console.error('Geolocation error:', error);
                setManualLocationMode(true);
                setLoading(false);
              }
            );
          } else {
            setManualLocationMode(true);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
        // Fallback to geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(loc);
              calculateNearestTools(loc);
              setLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              setManualLocationMode(true);
              setLoading(false);
            }
          );
        } else {
          setManualLocationMode(true);
          setLoading(false);
        }
      }
    };

    fetchUserLocation();
  }, []);

  const handleManualLocationSelect = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    if (location && defaultLocations[location]) {
      const loc = defaultLocations[location];
      setUserLocation(loc);
      calculateNearestTools(loc);
    }
  };

  // Initialize map after user location is set
  useEffect(() => {
    if (userLocation && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [userLocation, nearestTools]);

  const initializeMap = () => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // User location marker
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
      .bindPopup('<strong>📍 Your Location</strong>')
      .addTo(map);

    // Equipment markers
    nearestTools.forEach(tool => {
      L.marker([tool.coordinates.lat, tool.coordinates.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindPopup(`
          <div style="width: 200px;">
            <strong>${tool.name}</strong><br/>
            <small class="text-muted">${tool.location}</small><br/>
            <strong class="text-success">${tool.distance.toFixed(1)} km away</strong><br/>
            <small>₹${tool.pricePerDay}/day</small><br/>
            <button class="btn btn-sm btn-primary mt-2 w-100" onclick="window.location.href='/tools/${tool._id}'">
              View Details
            </button>
          </div>
        `)
        .addTo(map);
    });

    mapInstanceRef.current = map;
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateNearestTools = (userLoc) => {
    const toolsWithDistance = tools
      .filter(tool => tool.coordinates && tool.coordinates.latitude && tool.coordinates.longitude) // Only tools with coordinates
      .map(tool => {
        const toolCoords = {
          lat: tool.coordinates.latitude,
          lng: tool.coordinates.longitude
        };
        
        const distance = calculateDistance(
          userLoc.lat,
          userLoc.lng,
          toolCoords.lat,
          toolCoords.lng
        );
        return {
          ...tool,
          distance,
          coordinates: toolCoords
        };
      })
      .sort((a, b) => a.distance - b.distance);

    setNearestTools(toolsWithDistance.slice(0, 5)); // Top 5 nearest
  };

  if (loading) {
    return (
      <Card className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Getting your location...</p>
      </Card>
    );
  }

  if (manualLocationMode && !userLocation) {
    return (
      <Card className="mb-4">
        <Card.Header className="bg-warning text-dark">
          <h5 className="mb-0">📍 Select Your Location</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-3">
            Location access was denied or not available. Please select your location manually to find nearby equipment.
          </p>
          <div className="mb-3">
            <label className="form-label fw-bold">Choose Your Location:</label>
            <select 
              className="form-select form-select-lg"
              value={selectedLocation}
              onChange={handleManualLocationSelect}
            >
              <option value="">-- Select a location --</option>
              {Object.keys(defaultLocations).map(location => (
                <option key={location} value={location}>
                  📍 {location}
                </option>
              ))}
            </select>
          </div>
          {!selectedLocation && (
            <Alert variant="info">
              <strong>ℹ️ Tip:</strong> Select a location from the dropdown above to see nearby equipment on the map.
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">📍 Equipment Map - Find Nearest Tools</h5>
        </Card.Header>
        <Card.Body>
          {userLocation && (
            <div 
              ref={mapRef}
              style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}
            />
          )}
        </Card.Body>
      </Card>

      {/* Nearest Tools List */}
      <Card>
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">🎯 Top 5 Nearest Equipment</h5>
        </Card.Header>
        <Card.Body>
          {nearestTools.length === 0 ? (
            <p className="text-muted text-center py-4">No equipment found nearby</p>
          ) : (
            <div className="list-group">
              {nearestTools.map((tool, index) => (
                <div key={tool._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">
                        <span className="badge bg-primary me-2">#{index + 1}</span>
                        {tool.name}
                      </h6>
                      <p className="mb-1 text-muted small">
                        📍 {tool.location} • ⭐ {tool.rating.toFixed(1)}
                      </p>
                      <p className="mb-0 text-success fw-bold">
                        {tool.distance.toFixed(1)} km away
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="mb-1 fw-bold">₹{tool.pricePerDay}/day</p>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onSelectTool(tool._id)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MapComponent;
