import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ToolListing = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Debounce the API call for search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchTools();
    }, 500); // Wait 500ms after user stops typing

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await axios.get(`http://localhost:5000/api/tools?${params}`);
      console.log('Fetched tools:', response.data.length); // Debug log
      setTools(response.data);
    } catch (error) {
      console.error('Error fetching tools:', error); // Debug log
      toast.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filters are already applied via useEffect
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const categories = ['Tractor', 'Harvester', 'Plough', 'Seeder', 'Sprayer', 'Other'];

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold">Browse Equipment</h1>
      <p className="text-center text-muted mb-5">Find the perfect agricultural equipment for your needs</p>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Label className="fw-semibold small">Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Search equipment..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Label className="fw-semibold small">Category</Form.Label>
                <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2} className="mb-3">
                <Form.Label className="fw-semibold small">Min Price</Form.Label>
                <Form.Control
                  type="number"
                  name="minPrice"
                  placeholder="₹0"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2} className="mb-3">
                <Form.Label className="fw-semibold small">Max Price</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  placeholder="₹10000"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={1} className="mb-3 d-flex align-items-end">
                <Button variant="outline-primary" onClick={clearFilters} className="w-100" title="Clear Filters">
                  ✕
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Results Count */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          {loading ? (
            <span className="text-muted">Loading...</span>
          ) : (
            <span className="text-muted">
              Found <strong className="text-primary">{tools.length}</strong> equipment
            </span>
          )}
        </h5>
      </div>

      {/* Tool Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading equipment...</p>
        </div>
      ) : (
        <Row>
          {tools.length === 0 ? (
            <Col className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4rem', opacity: 0.3 }}>🚜</div>
              <h4 className="text-muted mb-2">No equipment found</h4>
              <p className="text-muted">Try adjusting your filters</p>
              <Button variant="primary" onClick={clearFilters}>Clear Filters</Button>
            </Col>
          ) : (
            tools.map(tool => (
              <Col md={4} key={tool._id} className="mb-4">
                <Card className="tool-card h-100">
                  <Card.Img
                    variant="top"
                    src={tool.images && tool.images.length > 0 
                      ? (tool.images[0].startsWith('http') 
                          ? tool.images[0] 
                          : `http://localhost:5000${tool.images[0]}`)
                      : 'https://via.placeholder.com/400x200?text=Equipment'}
                    alt={tool.name}
                  />
                  <Card.Body>
                    <Badge bg="success" className="category-badge mb-2">
                      {tool.category}
                    </Badge>
                    <Card.Title className="fw-bold">{tool.name}</Card.Title>
                    <div className="rating-stars mb-2">
                      <FaStar /> {tool.rating.toFixed(1)} ({tool.reviewCount} reviews)
                    </div>
                    <p className="text-muted mb-2">
                      <FaMapMarkerAlt /> {tool.location}
                    </p>
                    <div className="mb-3">
                      <p className="tool-price mb-1">₹{tool.pricePerDay}/day</p>
                      <small className="text-muted">Deposit: ₹{tool.deposit}</small>
                    </div>
                    <Button as={Link} to={`/tools/${tool._id}`} variant="primary" className="w-100">
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default ToolListing;
