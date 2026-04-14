import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AddressMapPicker from '../components/AddressMapPicker';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    address: '',
    coordinates: null,
    upiId: '',
    paymentQR: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [qrPreview, setQrPreview] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    // Tool owner specific validation
    if (formData.role === 'owner') {
      if (!formData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required for tool owners';
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@upi)';
      }

      if (!formData.paymentQR) {
        newErrors.paymentQR = 'Payment QR code is required for tool owners';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, paymentQR: 'Please upload an image file' });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, paymentQR: 'File size must be less than 2MB' });
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, paymentQR: reader.result });
        setQrPreview(reader.result);
        if (errors.paymentQR) {
          setErrors({ ...errors, paymentQR: '' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(response.data.token, response.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold text-primary">Create Account</h2>
              <p className="text-center text-muted mb-4">Join AgriRent today</p>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUser className="me-2" />Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Use a valid email like: name@example.com
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaLock className="me-2" />Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Min 6 characters with uppercase, lowercase, and number
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><FaPhone className="me-2" />Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Format: +91-9876543210 or 9876543210
                  </Form.Text>
                </Form.Group>

                <AddressMapPicker 
                  onAddressSelect={(address, coordinates) => {
                    setFormData({ 
                      ...formData, 
                      address,
                      coordinates: coordinates ? { latitude: coordinates.lat, longitude: coordinates.lng } : null
                    });
                    if (errors.address) {
                      setErrors({ ...errors, address: '' });
                    }
                  }}
                  initialAddress={formData.address}
                />
                {errors.address && (
                  <div className="text-danger small mb-3">{errors.address}</div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>I am a</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="farmer">Farmer (Rent Equipment)</option>
                    <option value="owner">Equipment Owner (List Equipment)</option>
                  </Form.Select>
                </Form.Group>

                {/* Tool Owner Payment Details */}
                {formData.role === 'owner' && (
                  <>
                    <hr className="my-4" />
                    <h5 className="mb-3 text-primary">💳 Payment Details (Required for Tool Owners)</h5>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>UPI ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        placeholder="e.g., yourname@upi"
                        isInvalid={!!errors.upiId}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.upiId}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Your UPI ID for receiving payments from farmers
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Payment QR Code</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleQRUpload}
                        isInvalid={!!errors.paymentQR}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.paymentQR}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Upload your UPI QR code (JPG, PNG, etc. - Max 2MB)
                      </Form.Text>
                      {qrPreview && (
                        <div className="mt-3">
                          <p className="text-success small">✅ QR Code uploaded</p>
                          <img 
                            src={qrPreview} 
                            alt="QR Preview" 
                            style={{ maxWidth: '150px', border: '2px solid #28a745', borderRadius: '5px' }}
                          />
                        </div>
                      )}
                    </Form.Group>
                    <hr className="my-4" />
                  </>
                )}

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>

                <p className="text-center mb-0">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
