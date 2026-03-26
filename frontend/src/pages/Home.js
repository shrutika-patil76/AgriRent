import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTractor, FaSearch, FaCalendarAlt, FaStar, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const features = [
    {
      icon: <FaSearch />,
      title: 'Easy Search',
      description: 'Find the perfect equipment for your farming needs'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Flexible Booking',
      description: 'Book equipment for days, weeks, or months'
    },
    {
      icon: <FaStar />,
      title: 'Verified Equipment',
      description: 'All equipment is verified and well-maintained'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Payment',
      description: 'Safe and secure payment processing'
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    },
    {
      icon: <FaTractor />,
      title: 'Wide Selection',
      description: 'Tractors, harvesters, and more'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        {/* Decorative elements */}
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
        
        <Container>
          <Row className="align-items-center hero-content">
            <Col lg={6} className="text-center text-lg-start">
              <h1 className="hero-title">
                Rent Agricultural Equipment with Ease
              </h1>
              <p className="hero-subtitle">
                Connect with equipment owners and get the tools you need for your farm. Save time, reduce costs, and boost productivity.
              </p>
              <div className="mt-4 hero-buttons">
                <Button as={Link} to="/tools" variant="light" size="lg" className="me-3 mb-3" style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  Browse Equipment
                </Button>
                {!user && (
                  <Button as={Link} to="/register" variant="outline-light" size="lg" className="mb-3" style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '8px', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    Get Started
                  </Button>
                )}
                {user && (
                  <Button as={Link} to="/dashboard" variant="outline-light" size="lg" className="mb-3" style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '8px', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    Go to Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center mt-5 mt-lg-0">
              <FaTractor className="hero-icon" style={{ fontSize: '16rem', opacity: 0.95 }} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ background: '#f5f5f5' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.25rem' }}>Why Choose AgriRent?</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              The most trusted platform for agricultural equipment rental in India
            </p>
          </div>
          <Row>
            {features.map((feature, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <div className="stat-box">
                <h2 className="stat-number text-primary mb-2">500+</h2>
                <p className="text-muted fw-semibold">Equipment Listed</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-box">
                <h2 className="stat-number text-primary mb-2">1000+</h2>
                <p className="text-muted fw-semibold">Happy Farmers</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-box">
                <h2 className="stat-number text-primary mb-2">50+</h2>
                <p className="text-muted fw-semibold">Cities Covered</p>
              </div>
            </Col>
            <Col md={3} className="mb-4">
              <div className="stat-box">
                <h2 className="stat-number text-primary mb-2">24/7</h2>
                <p className="text-muted fw-semibold">Customer Support</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quote Section 1 */}
      <section className="quote-section" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '100px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h2 className="display-4 fw-bold mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness."
              </h2>
              <p className="lead" style={{ fontSize: '1.3rem', opacity: 0.9 }}>— Thomas Jefferson</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ background: '#f5f5f5' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.25rem' }}>How It Works</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Simple steps to get started</p>
          </div>
          <Row>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3" style={{ fontSize: '3rem', color: 'var(--primary-green)' }}>1</div>
              <h4 className="fw-bold mb-3">Browse Equipment</h4>
              <p className="text-muted">Search through our wide range of agricultural equipment available for rent</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3" style={{ fontSize: '3rem', color: 'var(--primary-green)' }}>2</div>
              <h4 className="fw-bold mb-3">Book Your Dates</h4>
              <p className="text-muted">Select your preferred dates and submit a booking request</p>
            </Col>
            <Col md={4} className="mb-4 text-center">
              <div className="mb-3" style={{ fontSize: '3rem', color: 'var(--primary-green)' }}>3</div>
              <h4 className="fw-bold mb-3">Start Farming</h4>
              <p className="text-muted">Get the equipment delivered and boost your farm productivity</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quote Section 2 */}
      <section className="quote-section" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '100px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h2 className="display-4 fw-bold mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways."
              </h2>
              <p className="lead" style={{ fontSize: '1.3rem', opacity: 0.9 }}>— John F. Kennedy</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ background: 'white' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.25rem' }}>What Farmers Say</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Real experiences from our community</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff9800', fontSize: '1.5rem' }}>★★★★★</div>
                  <p className="mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                    "AgriRent helped me access a combine harvester when I needed it most. Saved me weeks of manual labor!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.25rem' }}>
                      RK
                    </div>
                    <div>
                      <strong>Rajesh Kumar</strong>
                      <div className="text-muted small">Punjab</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff9800', fontSize: '1.5rem' }}>★★★★★</div>
                  <p className="mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                    "As an equipment owner, this platform helped me earn extra income from my idle machinery. Highly recommended!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.25rem' }}>
                      AS
                    </div>
                    <div>
                      <strong>Amit Singh</strong>
                      <div className="text-muted small">Haryana</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3" style={{ color: '#ff9800', fontSize: '1.5rem' }}>★★★★★</div>
                  <p className="mb-3" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                    "Affordable rates and reliable equipment. This service is a game-changer for small farmers like me."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', fontSize: '1.25rem' }}>
                      SP
                    </div>
                    <div>
                      <strong>Suresh Patel</strong>
                      <div className="text-muted small">Gujarat</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quote Section 3 */}
      <section className="quote-section" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '100px 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={10}>
              <h2 className="display-4 fw-bold mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                "To forget how to dig the earth and to tend the soil is to forget ourselves."
              </h2>
              <p className="lead" style={{ fontSize: '1.3rem', opacity: 0.9 }}>— Mahatma Gandhi</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-5 cta-section">
          <Container className="text-center">
            <h2 className="mb-4 fw-bold">Ready to Get Started?</h2>
            <p className="lead mb-4">Join thousands of farmers already using AgriRent</p>
            <Button as={Link} to="/register" variant="light" size="lg" className="cta-button">
              Create Free Account
            </Button>
          </Container>
        </section>
      )}
      
      {user && (
        <section className="py-5 cta-section">
          <Container className="text-center">
            <h2 className="mb-4 fw-bold">Welcome back, {user.name}!</h2>
            <p className="lead mb-4">Continue exploring equipment or manage your account</p>
            <Button as={Link} to="/dashboard" variant="light" size="lg" className="cta-button me-3">
              Go to Dashboard
            </Button>
            <Button as={Link} to="/tools" variant="outline-light" size="lg" className="cta-button-outline">
              Browse Equipment
            </Button>
          </Container>
        </section>
      )}

      {/* Footer */}
      <footer className="footer-modern">
        <Container>
          <Row className="py-5">
            <Col md={4} className="mb-4 mb-md-0">
              <div className="footer-brand">
                <h3 className="fw-bold mb-3">
                  <FaTractor className="me-2" />
                  AgriRent
                </h3>
                <p className="text-muted mb-4">
                  Making agricultural equipment accessible to all farmers. Empowering agriculture through technology.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
                </div>
              </div>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/tools">Browse Equipment</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Categories</h5>
              <ul className="footer-links">
                <li><a href="#">Tractors</a></li>
                <li><a href="#">Harvesters</a></li>
                <li><a href="#">Ploughs</a></li>
                <li><a href="#">Seeders</a></li>
                <li><a href="#">Sprayers</a></li>
              </ul>
            </Col>
            <Col md={3}>
              <h5 className="fw-bold mb-3">Contact Us</h5>
              <ul className="footer-contact">
                <li><i className="fas fa-envelope me-2"></i> info@agrirent.com</li>
                <li><i className="fas fa-phone me-2"></i> +91-1800-123-4567</li>
                <li><i className="fas fa-map-marker-alt me-2"></i> Delhi, India</li>
              </ul>
            </Col>
          </Row>
          <hr className="footer-divider" />
          <Row className="py-3">
            <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
              <p className="mb-0 text-muted small">
                &copy; 2026 AgriRent. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0 text-muted small">
                <a href="#" className="footer-link-small">Privacy Policy</a>
                <span className="mx-2">•</span>
                <a href="#" className="footer-link-small">Terms of Service</a>
                <span className="mx-2">•</span>
                <a href="#" className="footer-link-small">Support</a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
