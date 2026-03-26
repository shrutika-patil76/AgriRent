import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal } from 'react-bootstrap';
import { FaTools, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [tools, setTools] = useState([]);
  const [showAddTool, setShowAddTool] = useState(false);
  const [newTool, setNewTool] = useState({
    name: '',
    description: '',
    category: 'Tractor',
    pricePerDay: '',
    deposit: '',
    location: '',
    specifications: {
      brand: '',
      model: '',
      year: '',
      condition: 'Good'
    }
  });
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (user?.role === 'farmer') {
      fetchBookings();
    } else if (user?.role === 'owner') {
      fetchMyTools();
      fetchOwnerBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const fetchMyTools = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tools');
      const myTools = response.data.filter(tool => tool.owner._id === user.id);
      setTools(myTools);
    } catch (error) {
      toast.error('Failed to fetch tools');
    }
  };

  const fetchOwnerBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/bookings/owner-bookings');
      setOwnerBookings(response.data);
    } catch (error) {
      console.error('Error fetching owner bookings:', error.response?.data || error.message);
      // Only show error if it's not a 403 (access denied for non-owners)
      if (error.response?.status !== 403) {
        toast.error('Failed to fetch bookings');
      }
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}!`);
      if (user?.role === 'owner') {
        fetchOwnerBookings();
      } else {
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append tool data
      formData.append('name', newTool.name);
      formData.append('description', newTool.description);
      formData.append('category', newTool.category);
      formData.append('pricePerDay', newTool.pricePerDay);
      formData.append('deposit', newTool.deposit);
      formData.append('location', newTool.location);
      formData.append('specifications', JSON.stringify(newTool.specifications));
      
      // Append images
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      await axios.post('http://localhost:5000/api/tools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Tool added successfully!');
      setShowAddTool(false);
      fetchMyTools();
      setNewTool({
        name: '',
        description: '',
        category: 'Tractor',
        pricePerDay: '',
        deposit: '',
        location: '',
        specifications: { brand: '', model: '', year: '', condition: 'Good' }
      });
      setSelectedImages([]);
    } catch (error) {
      toast.error('Failed to add tool');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setSelectedImages(files);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      ongoing: 'primary',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4 fw-bold">
        {user?.role === 'farmer' ? 'My Bookings' : 'My Equipment'}
      </h1>

      {user?.role === 'farmer' ? (
        <Card>
          <Card.Body>
            {bookings.length === 0 ? (
              <p className="text-muted text-center py-4">No bookings yet</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Days</th>
                    <th>Rent</th>
                    <th>Deposit</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.tool?.name}</td>
                      <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                      <td>{booking.totalDays}</td>
                      <td>₹{booking.totalAmount}</td>
                      <td>₹{booking.deposit}</td>
                      <td className="fw-bold">₹{booking.totalAmount + booking.deposit}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this booking?')) {
                                handleBookingStatus(booking._id, 'cancelled');
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="text-muted">-</span>
                        )}
                        {['confirmed', 'ongoing', 'completed'].includes(booking.status) && (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Booking Requests Section */}
          {ownerBookings && ownerBookings.length > 0 && (
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0"><FaCalendarAlt className="me-2" />Booking Requests</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ownerBookings.map(booking => (
                      <tr key={booking._id}>
                        <td>{booking.tool?.name}</td>
                        <td>{booking.user?.name}</td>
                        <td>{booking.user?.phone}</td>
                        <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                        <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                        <td>{booking.totalDays}</td>
                        <td>₹{booking.totalAmount + booking.deposit}</td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          {booking.status === 'pending' && (
                            <div className="d-flex gap-2">
                              <Button 
                                size="sm" 
                                variant="success"
                                onClick={() => handleBookingStatus(booking._id, 'confirmed')}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => handleBookingStatus(booking._id, 'cancelled')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleBookingStatus(booking._id, 'ongoing')}
                            >
                              Start
                            </Button>
                          )}
                          {booking.status === 'ongoing' && (
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handleBookingStatus(booking._id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* My Equipment Section */}
          <h3 className="mb-3 fw-bold"><FaTools className="me-2" />My Equipment</h3>
          <Button variant="primary" className="mb-4" onClick={() => setShowAddTool(true)}>
            <FaPlus className="me-2" /> Add New Equipment
          </Button>

          <Row>
            {tools.length === 0 ? (
              <Col className="text-center py-5">
                <p className="text-muted">No equipment listed yet</p>
              </Col>
            ) : (
              tools.map(tool => (
                <Col md={4} key={tool._id} className="mb-4">
                  <Card>
                    <Card.Body>
                      <h5 className="fw-bold">{tool.name}</h5>
                      <p className="text-muted">{tool.category}</p>
                      <p className="text-primary fw-bold">₹{tool.pricePerDay}/day</p>
                      <Badge bg={tool.available ? 'success' : 'danger'}>
                        {tool.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* Add Tool Modal */}
          <Modal show={showAddTool} onHide={() => setShowAddTool(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Add New Equipment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleAddTool}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Equipment Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTool.name}
                        onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={newTool.category}
                        onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                      >
                        <option>Tractor</option>
                        <option>Harvester</option>
                        <option>Plough</option>
                        <option>Seeder</option>
                        <option>Sprayer</option>
                        <option>Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price per Day (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newTool.pricePerDay}
                        onChange={(e) => setNewTool({ ...newTool, pricePerDay: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deposit (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newTool.deposit}
                        onChange={(e) => setNewTool({ ...newTool, deposit: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTool.location}
                        onChange={(e) => setNewTool({ ...newTool, location: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="fw-bold mb-3 mt-4">Specifications</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., John Deere, Mahindra"
                        value={newTool.specifications.brand}
                        onChange={(e) => setNewTool({ 
                          ...newTool, 
                          specifications: { ...newTool.specifications, brand: e.target.value }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 5075E, 575 DI"
                        value={newTool.specifications.model}
                        onChange={(e) => setNewTool({ 
                          ...newTool, 
                          specifications: { ...newTool.specifications, model: e.target.value }
                        })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g., 2023"
                        min="1990"
                        max={new Date().getFullYear()}
                        value={newTool.specifications.year}
                        onChange={(e) => setNewTool({ 
                          ...newTool, 
                          specifications: { ...newTool.specifications, year: e.target.value }
                        })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condition</Form.Label>
                      <Form.Select
                        value={newTool.specifications.condition}
                        onChange={(e) => setNewTool({ 
                          ...newTool, 
                          specifications: { ...newTool.specifications, condition: e.target.value }
                        })}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Images (Max 5)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Select up to 5 images of your equipment
                  </Form.Text>
                  {selectedImages.length > 0 && (
                    <div className="mt-2">
                      <small className="text-success">
                        {selectedImages.length} image(s) selected
                      </small>
                    </div>
                  )}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Add Equipment
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
