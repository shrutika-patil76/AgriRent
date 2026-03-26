import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FaTractor, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar bg="white" expand="lg" className="shadow-sm sticky-top">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold text-primary d-flex align-items-center" style={{ fontSize: '1.75rem' }}>
          <FaTractor style={{ fontSize: '2rem', marginRight: '10px' }} />
          AgriRent
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>Home</Nav.Link>
            <Nav.Link as={Link} to="/tools" style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>Browse Equipment</Nav.Link>
            
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard" style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>
                  <FaUser className="me-1" style={{ fontSize: '1rem' }} /> Dashboard
                </Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>Admin Panel</Nav.Link>
                )}
                <Button variant="outline-primary" size="sm" onClick={handleLogout} className="ms-2 mt-2 mt-lg-0" style={{ fontSize: '1rem', padding: '0.6rem 1.25rem', fontWeight: '600' }}>
                  <FaSignOutAlt className="me-1" style={{ fontSize: '0.95rem' }} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem', fontWeight: '500' }}>Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary" size="sm" className="ms-2 mt-2 mt-lg-0" style={{ fontSize: '1rem', padding: '0.6rem 1.25rem', fontWeight: '600' }}>
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
