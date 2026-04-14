import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTools, FaCalendarAlt, FaPlus, FaMapMarkerAlt, FaStar, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [tools, setTools] = useState([]);
  const [showAddTool, setShowAddTool] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentType, setPaymentType] = useState('deposit');
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
      fetchBookings();
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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add tools');
        return;
      }

      const formData = new FormData();
      
      formData.append('name', newTool.name);
      formData.append('description', newTool.description);
      formData.append('category', newTool.category);
      formData.append('pricePerDay', newTool.pricePerDay);
      formData.append('deposit', newTool.deposit);
      // Location will be set from owner's address on backend
      formData.append('specifications', JSON.stringify(newTool.specifications));
      
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      await axios.post('http://localhost:5000/api/tools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
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
      toast.error(error.response?.data?.message || 'Failed to add tool');
      console.error('Add tool error:', error.response?.data);
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
    return <Badge bg={variants[status]} className="px-3 py-2">{status.toUpperCase()}</Badge>;
  };

  return (
    <>
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          show={showPaymentModal}
          onHide={() => {
            console.log('Closing modal');
            setShowPaymentModal(false);
            setSelectedBookingForPayment(null);
          }}
          booking={selectedBookingForPayment}
          paymentType={paymentType}
          onPaymentSuccess={fetchBookings}
        />
      )}
      
      <Container fluid className="py-5 dashboard-container">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4 mb-2">
            {user?.role === 'farmer' ? '📅 My Bookings' : '🚜 My Equipment'}
        </h1>
        <p className="text-muted fs-5">Welcome back, {user?.name}!</p>
      </div>

      {user?.role === 'farmer' ? (
        <>
          {/* Booking Summary Cards */}
          <Row className="mb-5 g-4">
            <Col md={3} sm={6}>
              <Card className="stat-card border-0 shadow-sm h-100 text-center">
                <Card.Body className="py-4">
                  <div className="stat-number text-primary mb-2">{bookings.filter(b => b.status === 'pending').length}</div>
                  <p className="stat-label text-muted mb-0">Pending</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card border-0 shadow-sm h-100 text-center">
                <Card.Body className="py-4">
                  <div className="stat-number text-success mb-2">{bookings.filter(b => b.status === 'confirmed').length}</div>
                  <p className="stat-label text-muted mb-0">Confirmed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card border-0 shadow-sm h-100 text-center">
                <Card.Body className="py-4">
                  <div className="stat-number text-info mb-2">{bookings.filter(b => b.status === 'ongoing').length}</div>
                  <p className="stat-label text-muted mb-0">Ongoing</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card border-0 shadow-sm h-100 text-center">
                <Card.Body className="py-4">
                  <div className="stat-number text-danger mb-2">{bookings.filter(b => b.status === 'cancelled').length}</div>
                  <p className="stat-label text-muted mb-0">Cancelled</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Bookings Table */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="border-0 py-4" style={{ background: '#f8f9fa' }}>
              <h5 className="mb-0 fw-bold" style={{ color: '#000000', fontSize: '1.25rem' }}>
                <FaCalendarAlt className="me-2" style={{ color: '#667eea' }} />
                Your Bookings
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {bookings.length === 0 ? (
                <div className="text-center py-5">
                  <FaCalendarAlt className="text-muted" style={{ fontSize: '3rem' }} />
                  <p className="text-muted mt-3">No bookings yet. Start exploring equipment!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-bold">Equipment</th>
                        <th className="fw-bold">Start Date</th>
                        <th className="fw-bold">End Date</th>
                        <th className="fw-bold text-center">Days</th>
                        <th className="fw-bold text-end">Rent</th>
                        <th className="fw-bold text-end">Deposit</th>
                        <th className="fw-bold text-end">Total</th>
                        <th className="fw-bold text-center">Status</th>
                        <th className="fw-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id} className={booking.status === 'cancelled' ? 'table-danger' : ''}>
                          <td className="fw-bold">{booking.tool?.name}</td>
                          <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                          <td className="text-center">{booking.totalDays}</td>
                          <td className="text-end">₹{booking.totalAmount}</td>
                          <td className="text-end">₹{booking.deposit}</td>
                          <td className="text-end fw-bold text-primary">₹{booking.totalAmount + booking.deposit}</td>
                          <td className="text-center">
                            {getStatusBadge(booking.status)}
                            {booking.status === 'cancelled' && booking.cancelledBy === 'owner' && (
                              <div className="text-danger small mt-2">
                                <small>❌ Rejected by owner</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && booking.cancelledBy === 'farmer' && (
                              <div className="text-warning small mt-2">
                                <small>⚠️ Cancelled by you</small>
                              </div>
                            )}
                          </td>
                          <td className="text-center">
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
                            {booking.status === 'confirmed' && !booking.depositPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="success"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Pay Deposit clicked', booking);
                                    setSelectedBookingForPayment(booking);
                                    setPaymentType('deposit');
                                    setShowPaymentModal(true);
                                    console.log('Modal state set to true');
                                  }}
                                >
                                  Pay Deposit
                                </Button>
                                <div className="text-warning small mt-1">
                                  <small>⏳ Deposit Pending</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'confirmed' && booking.depositPaid && !booking.rentPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="info"
                                  onClick={() => {
                                    setSelectedBookingForPayment(booking);
                                    setPaymentType('rent');
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Pay Rent
                                </Button>
                                <div className="text-success small mt-1">
                                  <small>✅ Deposit Paid</small>
                                </div>
                              </>
                            )}
                            {booking.depositPaid && booking.rentPaid && (
                              <div className="text-success">
                                <small>✅ Deposit Paid</small><br/>
                                <small>✅ Rent Paid</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="text-muted">Cancelled</span>
                            )}
                            {booking.status === 'completed' && (
                              <div className="text-success">
                                <small>✅ All Paid</small><br/>
                                <small>🎉 Completed</small>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          {/* Booking Requests Section */}
          {ownerBookings && ownerBookings.length > 0 && (
            <Card className="border-0 shadow-sm mb-5">
              <Card.Header className="border-0 py-4" style={{ background: '#f8f9fa' }}>
                <h5 className="mb-0 fw-bold" style={{ color: '#000000', fontSize: '1.25rem' }}>
                  <FaCalendarAlt className="me-2" style={{ color: '#667eea' }} />
                  Booking Requests
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-bold">Equipment</th>
                        <th className="fw-bold">Customer</th>
                        <th className="fw-bold">Phone</th>
                        <th className="fw-bold">Start Date</th>
                        <th className="fw-bold">End Date</th>
                        <th className="fw-bold text-center">Days</th>
                        <th className="fw-bold text-end">Amount</th>
                        <th className="fw-bold text-center">Status</th>
                        <th className="fw-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ownerBookings.map(booking => (
                        <tr key={booking._id} className={booking.status === 'cancelled' ? 'table-danger' : ''}>
                          <td className="fw-bold">{booking.tool?.name}</td>
                          <td>{booking.user?.name}</td>
                          <td>{booking.user?.phone}</td>
                          <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                          <td className="text-center">{booking.totalDays}</td>
                          <td className="text-end fw-bold text-primary">₹{booking.totalAmount + booking.deposit}</td>
                          <td className="text-center">
                            {getStatusBadge(booking.status)}
                            {booking.depositPaid && (
                              <div className="text-success small mt-1">
                                <small>✅ Deposit Paid</small>
                              </div>
                            )}
                            {booking.status === 'confirmed' && !booking.depositPaid && (
                              <div className="text-warning small mt-1">
                                <small>⏳ Awaiting Deposit</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && booking.cancelledBy === 'farmer' && (
                              <div className="text-warning small mt-2">
                                <small>⚠️ Cancelled by farmer</small>
                              </div>
                            )}
                          </td>
                          <td className="text-center">
                            {booking.status === 'pending' && (
                              <>
                                <div className="d-flex gap-2 justify-content-center mb-2">
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
                                <div className="text-muted small">
                                  <small>⏳ Awaiting Approval</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'confirmed' && !booking.depositPaid && (
                              <div className="text-warning">
                                <small>⏳ Awaiting Deposit</small><br/>
                                <small className="text-muted">Farmer needs to pay</small>
                              </div>
                            )}
                            {booking.status === 'confirmed' && booking.depositPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="primary"
                                  onClick={() => handleBookingStatus(booking._id, 'ongoing')}
                                >
                                  Start
                                </Button>
                                <div className="text-success small mt-1">
                                  <small>✅ Deposit Received</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'ongoing' && !booking.rentPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="success"
                                  onClick={() => handleBookingStatus(booking._id, 'completed')}
                                >
                                  Complete
                                </Button>
                                <div className="text-warning small mt-1">
                                  <small>⏳ Awaiting Rent</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'ongoing' && booking.rentPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="success"
                                  onClick={() => handleBookingStatus(booking._id, 'completed')}
                                >
                                  Complete
                                </Button>
                                <div className="text-success small mt-1">
                                  <small>✅ Rent Received</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'completed' && (
                              <div className="text-success">
                                <small>✅ All Payments Done</small><br/>
                                <small>🎉 Completed</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="text-muted">Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* My Bookings as Farmer Section */}
          {bookings && bookings.length > 0 && (
            <Card className="border-0 shadow-sm mb-5">
              <Card.Header className="border-0 py-4" style={{ background: '#f8f9fa' }}>
                <h5 className="mb-0 fw-bold" style={{ color: '#000000', fontSize: '1.25rem' }}>
                  <FaCalendarAlt className="me-2" style={{ color: '#667eea' }} />
                  My Bookings (As Farmer)
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="fw-bold">Equipment</th>
                        <th className="fw-bold">Start Date</th>
                        <th className="fw-bold">End Date</th>
                        <th className="fw-bold text-center">Days</th>
                        <th className="fw-bold text-end">Rent</th>
                        <th className="fw-bold text-end">Deposit</th>
                        <th className="fw-bold text-end">Total</th>
                        <th className="fw-bold text-center">Status</th>
                        <th className="fw-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking._id} className={booking.status === 'cancelled' ? 'table-danger' : ''}>
                          <td className="fw-bold">{booking.tool?.name}</td>
                          <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                          <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                          <td className="text-center">{booking.totalDays}</td>
                          <td className="text-end">₹{booking.totalAmount}</td>
                          <td className="text-end">₹{booking.deposit}</td>
                          <td className="text-end fw-bold text-primary">₹{booking.totalAmount + booking.deposit}</td>
                          <td className="text-center">
                            {getStatusBadge(booking.status)}
                            {booking.status === 'cancelled' && booking.cancelledBy === 'owner' && (
                              <div className="text-danger small mt-2">
                                <small>❌ Rejected by owner</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && booking.cancelledBy === 'farmer' && (
                              <div className="text-warning small mt-2">
                                <small>⚠️ Cancelled by you</small>
                              </div>
                            )}
                          </td>
                          <td className="text-center">
                            {booking.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="danger"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this booking? The owner will be notified.')) {
                                    handleBookingStatus(booking._id, 'cancelled');
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                            {booking.status === 'confirmed' && !booking.depositPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="success"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Pay Deposit clicked', booking);
                                    setSelectedBookingForPayment(booking);
                                    setPaymentType('deposit');
                                    setShowPaymentModal(true);
                                    console.log('Modal state set to true');
                                  }}
                                >
                                  Pay Deposit
                                </Button>
                                <div className="text-warning small mt-1">
                                  <small>⏳ Deposit Pending</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'confirmed' && booking.depositPaid && !booking.rentPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="info"
                                  onClick={() => {
                                    setSelectedBookingForPayment(booking);
                                    setPaymentType('rent');
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Pay Rent
                                </Button>
                                <div className="text-success small mt-1">
                                  <small>✅ Deposit Paid</small>
                                </div>
                              </>
                            )}
                            {booking.depositPaid && booking.rentPaid && (
                              <div className="text-success">
                                <small>✅ Deposit Paid</small><br/>
                                <small>✅ Rent Paid</small>
                              </div>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="text-muted">Cancelled</span>
                            )}
                            {booking.status === 'ongoing' && !booking.rentPaid && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="info"
                                  onClick={() => {
                                    setSelectedBookingForPayment(booking);
                                    setPaymentType('rent');
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Pay Rent
                                </Button>
                                <div className="text-warning small mt-1">
                                  <small>⏳ Rent Pending</small>
                                </div>
                              </>
                            )}
                            {booking.status === 'ongoing' && booking.rentPaid && (
                              <div className="text-success">
                                <small>✅ All Paid</small>
                              </div>
                            )}
                            {booking.status === 'completed' && (
                              <div className="text-success">
                                <small>✅ All Paid</small><br/>
                                <small>🎉 Completed</small>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* My Equipment Section */}
          <div className="text-center mb-5">
            <h3 className="fw-bold display-6 mb-4"><FaTools className="me-2" />My Equipment</h3>
            <Button 
              variant="primary" 
              size="lg"
              className="mb-4 px-5 py-3"
              onClick={() => setShowAddTool(true)}
            >
              <FaPlus className="me-2" /> Add New Equipment
            </Button>
          </div>

          <Row className="g-4">
            {tools.length === 0 ? (
              <Col xs={12} className="text-center py-5">
                <FaTools className="text-muted" style={{ fontSize: '3rem' }} />
                <p className="text-muted mt-3 fs-5">No equipment listed yet. Add your first equipment!</p>
              </Col>
            ) : (
              tools.map(tool => (
                <Col lg={4} md={6} key={tool._id}>
                  <Card className="equipment-card border-0 shadow-sm h-100 overflow-hidden">
                    {/* Equipment Image */}
                    <div className="equipment-image-container position-relative">
                      {tool.images && tool.images.length > 0 ? (
                        <img 
                          src={
                            tool.images[0].startsWith('http') || tool.images[0].startsWith('data:')
                              ? tool.images[0]
                              : `http://localhost:5000${tool.images[0]}`
                          }
                          alt={tool.name}
                          className="equipment-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x250?text=Equipment';
                          }}
                        />
                      ) : (
                        <div className="equipment-image-placeholder d-flex align-items-center justify-content-center">
                          <FaImage className="text-muted" style={{ fontSize: '3rem' }} />
                        </div>
                      )}
                      <Badge 
                        bg={tool.available ? 'success' : 'danger'}
                        className="position-absolute top-0 end-0 m-3 px-3 py-2"
                      >
                        {tool.available ? '✓ Available' : '✗ Unavailable'}
                      </Badge>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <h5 className="fw-bold mb-2">{tool.name}</h5>
                      <p className="text-muted small mb-3">{tool.category}</p>
                      
                      <div className="mb-3">
                        <p className="mb-1 text-muted small">
                          <FaMapMarkerAlt className="me-1" />{tool.location}
                        </p>
                        {tool.rating && (
                          <p className="mb-0 text-muted small">
                            <FaStar className="me-1 text-warning" />{tool.rating} ({tool.reviewCount} reviews)
                          </p>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <p className="mb-0 text-muted small">Price per Day</p>
                            <h4 className="text-primary fw-bold mb-0">₹{tool.pricePerDay}</h4>
                          </div>
                          <div className="text-end">
                            <p className="mb-0 text-muted small">Deposit</p>
                            <p className="text-success fw-bold mb-0">₹{tool.deposit}</p>
                          </div>
                        </div>
                        <Button as={Link} to={`/tools/${tool._id}`} variant="outline-primary" className="w-100" size="sm">
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* Add Tool Modal */}
          <Modal show={showAddTool} onHide={() => setShowAddTool(false)} size="lg">
            <Modal.Header closeButton className="border-0 bg-light">
              <Modal.Title className="fw-bold">Add New Equipment</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form onSubmit={handleAddTool}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Equipment Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={newTool.name}
                        onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                        placeholder="e.g., John Deere Tractor"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Category</Form.Label>
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
                  <Form.Label className="fw-bold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newTool.description}
                    onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                    placeholder="Describe your equipment..."
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Price per Day (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newTool.pricePerDay}
                        onChange={(e) => setNewTool({ ...newTool, pricePerDay: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Deposit (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        value={newTool.deposit}
                        onChange={(e) => setNewTool({ ...newTool, deposit: e.target.value })}
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
                        placeholder="e.g., John Deere"
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
                        placeholder="e.g., 5075E"
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

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Upload Images (Max 5)</Form.Label>
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
                      <Badge bg="success">{selectedImages.length} image(s) selected</Badge>
                    </div>
                  )}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                  Add Equipment
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
    </>
  );
};

export default Dashboard;
