import React, { useState, useContext, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddressMapPicker from '../components/AddressMapPicker';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📊 User data fetched:', response.data);
      console.log('📍 Coordinates:', response.data.coordinates);
      setUserData(response.data);
      if (response.data.coordinates?.latitude && response.data.coordinates?.longitude) {
        setSelectedCoordinates({
          lat: response.data.coordinates.latitude,
          lng: response.data.coordinates.longitude
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile');
    }
  };

  const handleUpdateCoordinates = async () => {
    if (!selectedCoordinates) {
      setError('Please select coordinates on the map');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      console.log('💾 Saving coordinates:', selectedCoordinates);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/update-my-coordinates',
        {
          latitude: selectedCoordinates.lat,
          longitude: selectedCoordinates.lng
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Save response:', response.data);
      
      // Update local state immediately
      setUserData(prev => ({
        ...prev,
        coordinates: {
          latitude: selectedCoordinates.lat,
          longitude: selectedCoordinates.lng
        },
        address: response.data.address
      }));

      setMessage('✅ Coordinates updated successfully!');
      setShowMapPicker(false);
      setSelectedCoordinates(null);
      
      // Also refresh from server to ensure consistency
      setTimeout(() => {
        console.log('🔄 Refreshing user data from server...');
        fetchUserData();
      }, 1000);
    } catch (err) {
      console.error('❌ Error saving coordinates:', err);
      setError(err.response?.data?.message || 'Failed to update coordinates');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">👤 My Profile</h4>
        </Card.Header>
        <Card.Body className="p-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-4">
            <h5 className="mb-3">Personal Information</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control type="text" value={userData.name} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control type="email" value={userData.email} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Phone</Form.Label>
                <Form.Control type="text" value={userData.phone} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Role</Form.Label>
                <Form.Control type="text" value={userData.role.toUpperCase()} disabled />
              </Form.Group>
            </Form>
          </div>

          <hr />

          <div className="mb-4">
            <h5 className="mb-3">📍 Location Information</h5>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Address</Form.Label>
                <Form.Control 
                  type="text" 
                  value={userData.address || 'Not set'} 
                  disabled 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Coordinates</Form.Label>
                {userData.coordinates?.latitude && userData.coordinates?.longitude ? (
                  <Form.Control 
                    type="text" 
                    value={`${userData.coordinates.latitude.toFixed(4)}°N, ${userData.coordinates.longitude.toFixed(4)}°E`}
                    disabled 
                  />
                ) : (
                  <Form.Control 
                    type="text" 
                    value="Not set - Please update below"
                    disabled 
                    className="text-danger"
                  />
                )}
              </Form.Group>

              {!showMapPicker ? (
                <Button 
                  variant="primary" 
                  onClick={() => setShowMapPicker(true)}
                  className="w-100"
                >
                  📍 Update Location on Map
                </Button>
              ) : (
                <>
                  <div className="mb-3">
                    <AddressMapPicker 
                      onAddressSelect={(address, coords) => {
                        if (coords) {
                          setSelectedCoordinates(coords);
                        }
                      }}
                      initialAddress={userData.address || ''}
                    />
                  </div>
                  {selectedCoordinates && (
                    <Alert variant="info" className="mb-3">
                      Selected: {selectedCoordinates.lat.toFixed(4)}°N, {selectedCoordinates.lng.toFixed(4)}°E
                    </Alert>
                  )}
                  <div className="d-flex gap-2">
                    <Button 
                      variant="success" 
                      onClick={handleUpdateCoordinates}
                      disabled={loading || !selectedCoordinates}
                      className="flex-grow-1"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        '✅ Save Location'
                      )}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowMapPicker(false)}
                      className="flex-grow-1"
                    >
                      ✕ Cancel
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>

          <Alert variant="info" className="mt-4">
            <strong>ℹ️ Why update location?</strong> Your registered location is used to calculate distances to equipment. 
            Make sure it's accurate so you can find the nearest tools.
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
