import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const ToolDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchToolDetails();
    fetchReviews();
    fetchBookedDates();
  }, [id]);

  const fetchToolDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tools/${id}`);
      setTool(response.data);
    } catch (error) {
      toast.error('Failed to fetch tool details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/tool/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/tool/${id}/booked-dates`);
      setBookedDates(response.data);
    } catch (error) {
      console.error('Failed to fetch booked dates');
    }
  };

  const isDateBooked = (date) => {
    const checkDate = new Date(date);
    return bookedDates.some(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        toolId: id,
        ...bookingData
      });
      toast.success('Booking request sent!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add a review');
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        toolId: id,
        ...reviewData
      });
      toast.success('Review added successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      fetchReviews();
      fetchToolDetails(); // Refresh to update rating
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!tool) return <div className="text-center py-5">Tool not found</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={tool.images && tool.images.length > 0 
                ? (tool.images[0].startsWith('http') 
                    ? tool.images[0] 
                    : `http://localhost:5000${tool.images[0]}`)
                : 'https://via.placeholder.com/800x400?text=Equipment'}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <Card.Body>
              <Badge bg="success" className="category-badge mb-3">
                {tool.category}
              </Badge>
              <h2 className="fw-bold mb-3">{tool.name}</h2>
              <div className="rating-stars mb-3">
                <FaStar /> {tool.rating.toFixed(1)} ({tool.reviewCount} reviews)
              </div>
              <p className="text-muted mb-3">
                <FaMapMarkerAlt /> {tool.location}
              </p>
              <div className="mb-3">
                <h4 className="text-primary mb-2">₹{tool.pricePerDay}/day</h4>
                <p className="text-muted mb-0">
                  <strong>Security Deposit:</strong> ₹{tool.deposit}
                </p>
              </div>
              <p className="mb-4">{tool.description}</p>

              {/* Additional Images */}
              {tool.images && tool.images.length > 1 && (
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">More Images</h5>
                  <Row>
                    {tool.images.slice(1).map((img, index) => (
                      <Col md={4} key={index} className="mb-3">
                        <img 
                          src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                          alt={`${tool.name} ${index + 2}`}
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              <h5 className="fw-bold mb-3">Specifications</h5>
              <ListGroup className="mb-4">
                <ListGroup.Item>Brand: {tool.specifications?.brand || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Model: {tool.specifications?.model || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Year: {tool.specifications?.year || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Condition: {tool.specifications?.condition || 'N/A'}</ListGroup.Item>
              </ListGroup>

              <h5 className="fw-bold mb-3">Owner Details</h5>
              <Card className="bg-light">
                <Card.Body>
                  <p className="mb-2"><FaUser /> {tool.owner?.name}</p>
                  <p className="mb-0"><FaPhone /> {tool.owner?.phone}</p>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>

          {/* Reviews */}
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Reviews</h5>
                {user && !showReviewForm && (
                  <Button size="sm" variant="primary" onClick={() => setShowReviewForm(true)}>
                    Write a Review
                  </Button>
                )}
              </div>

              {/* Add Review Form */}
              {showReviewForm && (
                <Card className="mb-4 bg-light">
                  <Card.Body>
                    <h6 className="fw-bold mb-3">Write Your Review</h6>
                    <Form onSubmit={handleReviewSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={reviewData.rating}
                          onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                          required
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ Excellent (5)</option>
                          <option value={4}>⭐⭐⭐⭐ Good (4)</option>
                          <option value={3}>⭐⭐⭐ Average (3)</option>
                          <option value={2}>⭐⭐ Poor (2)</option>
                          <option value={1}>⭐ Very Poor (1)</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                          placeholder="Share your experience with this equipment..."
                          required
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button type="submit" variant="primary">Submit Review</Button>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={() => {
                            setShowReviewForm(false);
                            setReviewData({ rating: 5, comment: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <strong>{review.user?.name}</strong>
                      <div className="rating-stars">
                        <FaStar /> {review.rating}
                      </div>
                    </div>
                    <p className="text-muted mb-0">{review.comment}</p>
                    <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Body>
              <h5 className="fw-bold mb-4">Book This Equipment</h5>
              <Form onSubmit={handleBooking}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>

                {/* Show booked dates warning */}
                {bookedDates.length > 0 && (
                  <div className="alert alert-warning mb-3">
                    <strong>⚠️ Already Booked Dates:</strong>
                    <ul className="mb-0 mt-2">
                      {bookedDates.map((booking, index) => (
                        <li key={index}>
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                    <small className="text-muted">Please select different dates</small>
                  </div>
                )}

                <div className="bg-light p-3 rounded mb-3">
                  <h6 className="fw-bold mb-3">Payment Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Rent per day:</span>
                    <strong>₹{tool.pricePerDay}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Security Deposit:</span>
                    <strong>₹{tool.deposit}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total to Pay:</span>
                    <strong className="text-primary">
                      ₹{bookingData.startDate && bookingData.endDate 
                        ? (Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)) * tool.pricePerDay + tool.deposit)
                        : (tool.pricePerDay + tool.deposit)}
                    </strong>
                  </div>
                  <small className="text-muted d-block mt-2">
                    * Deposit will be refunded after equipment return
                  </small>
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Book Now
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ToolDetails;
