import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaUsers, FaTools, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTools: 0,
    totalBookings: 0,
    activeBookings: 0
  });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchBookings();
    fetchMyBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings');
      setMyBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch my bookings');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: 'cancelled' });
        toast.success('Booking cancelled');
        fetchMyBookings();
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'success',
      ongoing: 'info',
      completed: 'secondary',
      cancelled: 'danger'
    };
    return <span className={`badge bg-${statusColors[status]}`}>{status}</span>;
  };

  // Chart Data
  const bookingStatusData = {
    labels: ['Pending', 'Confirmed', 'Ongoing', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Bookings by Status',
        data: [
          bookings.filter(b => b.status === 'pending').length,
          bookings.filter(b => b.status === 'confirmed').length,
          bookings.filter(b => b.status === 'ongoing').length,
          bookings.filter(b => b.status === 'completed').length,
          bookings.filter(b => b.status === 'cancelled').length,
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.8)',
          'rgba(40, 167, 69, 0.8)',
          'rgba(23, 162, 184, 0.8)',
          'rgba(108, 117, 125, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(40, 167, 69, 1)',
          'rgba(23, 162, 184, 1)',
          'rgba(108, 117, 125, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const userRoleData = {
    labels: ['Farmers', 'Owners', 'Admins'],
    datasets: [
      {
        label: 'Users by Role',
        data: [
          users.filter(u => u.role === 'farmer').length,
          users.filter(u => u.role === 'owner').length,
          users.filter(u => u.role === 'admin').length,
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(0, 123, 255, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(0, 123, 255, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyBookingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Bookings per Month',
        data: Array(12).fill(0).map((_, index) => {
          return bookings.filter(b => new Date(b.createdAt).getMonth() === index).length;
        }),
        fill: true,
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: 'rgba(40, 167, 69, 1)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Revenue Analysis Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: Array(6).fill(0).map((_, index) => {
          const monthBookings = bookings.filter(b => new Date(b.createdAt).getMonth() === index);
          return monthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        }),
        backgroundColor: 'rgba(40, 167, 69, 0.8)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <Container fluid className="py-4" style={{ 
      background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '2rem' }}>Analytics Dashboard</h1>
        <p className="text-muted mb-0">Monitor and manage your platform performance</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUsers size={24} style={{ color: 'white' }} />
                </div>
                <span className="badge" style={{ background: '#e8f5e9', color: '#28a745', fontSize: '0.75rem', fontWeight: '600' }}>+12%</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '2rem' }}>{stats.totalUsers}</h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaTools size={24} style={{ color: 'white' }} />
                </div>
                <span className="badge" style={{ background: '#e3f2fd', color: '#17a2b8', fontSize: '0.75rem', fontWeight: '600' }}>+8%</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '2rem' }}>{stats.totalTools}</h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Total Equipment</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCalendarAlt size={24} style={{ color: 'white' }} />
                </div>
                <span className="badge" style={{ background: '#fff3cd', color: '#ff9800', fontSize: '0.75rem', fontWeight: '600' }}>+15%</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '2rem' }}>{stats.totalBookings}</h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Total Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCheckCircle size={24} style={{ color: 'white' }} />
                </div>
                <span className="badge" style={{ background: '#e8f5e9', color: '#28a745', fontSize: '0.75rem', fontWeight: '600' }}>Active</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: '#2c3e50', fontSize: '2rem' }}>{stats.activeBookings}</h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Active Bookings</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts */}
      <h3 className="mb-3 fw-bold" style={{ color: '#2c3e50' }}>Analytics Overview</h3>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}>
              <h6 className="mb-0" style={{ color: 'white' }}>Booking Status Distribution</h6>
            </Card.Header>
            <Card.Body>
              <Bar data={bookingStatusData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}>
              <h6 className="mb-0" style={{ color: 'white' }}>User Distribution by Role</h6>
            </Card.Header>
            <Card.Body>
              <Pie data={userRoleData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white'
            }}>
              <h6 className="mb-0" style={{ color: 'white' }}>Monthly Booking Trends</h6>
            </Card.Header>
            <Card.Body>
              <Line data={monthlyBookingsData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue Analytics */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Header style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: 'white',
              padding: '1rem 1.5rem'
            }}>
              <h6 className="mb-0 fw-bold" style={{ color: 'white' }}>Revenue Trends</h6>
            </Card.Header>
            <Card.Body>
              <Bar data={revenueData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="mb-4">
        <Card.Header style={{ 
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white'
        }}>
          <h5 className="mb-0" style={{ color: 'white' }}>
            <FaUsers className="me-2" style={{ color: 'white' }} />
            All Users
          </h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge bg-info">{user.role}</span></td>
                  <td>{user.phone}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* My Bookings Section */}
      {myBookings && myBookings.length > 0 && (
        <Card className="mb-4">
          <Card.Header style={{ 
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white'
          }}>
            <h5 className="mb-0" style={{ color: 'white' }}>
              <FaCalendarAlt className="me-2" style={{ color: 'white' }} />
              My Bookings
            </h5>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Rent</th>
                  <th>Deposit</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map(booking => (
                  <tr key={booking._id} className={booking.status === 'cancelled' ? 'table-danger' : ''}>
                    <td>{booking.tool?.name}</td>
                    <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                    <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                    <td>{booking.totalDays}</td>
                    <td>₹{booking.totalAmount}</td>
                    <td>₹{booking.deposit}</td>
                    <td className="fw-bold">₹{booking.totalAmount + booking.deposit}</td>
                    <td>
                      {getStatusBadge(booking.status)}
                      {booking.status === 'cancelled' && (
                        <div className="text-danger small mt-1">
                          <small>❌ Rejected by owner</small>
                        </div>
                      )}
                    </td>
                    <td>
                      {booking.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'cancelled' && (
                        <span className="text-danger small">Cancelled</span>
                      )}
                      {['confirmed', 'ongoing', 'completed'].includes(booking.status) && (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Bookings Table */}
      <Card>
        <Card.Header style={{ 
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white'
        }}>
          <h5 className="mb-0" style={{ color: 'white' }}>
            <FaCalendarAlt className="me-2" style={{ color: 'white' }} />
            Recent Bookings
          </h5>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Equipment</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 10).map(booking => (
                <tr key={booking._id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.tool?.name}</td>
                  <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td><span className={`badge bg-${booking.status === 'completed' ? 'success' : 'warning'}`}>{booking.status}</span></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPanel;
