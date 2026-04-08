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
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Admin Dashboard</h1>
        <Button 
          variant="info" 
          href="/admin/update-coordinates"
          className="d-flex align-items-center gap-2"
        >
          📍 Update Coordinates
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <FaUsers size={40} className="mb-3" />
              <div className="stat-number">{stats.totalUsers}</div>
              <div>Total Users</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <FaTools size={40} className="mb-3" />
              <div className="stat-number">{stats.totalTools}</div>
              <div>Total Equipment</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <FaCalendarAlt size={40} className="mb-3" />
              <div className="stat-number">{stats.totalBookings}</div>
              <div>Total Bookings</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <FaCheckCircle size={40} className="mb-3" />
              <div className="stat-number">{stats.activeBookings}</div>
              <div>Active Bookings</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics Charts */}
      <h3 className="mb-3 fw-bold">📊 Analytics</h3>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Booking Status Distribution</h6>
            </Card.Header>
            <Card.Body>
              <Bar data={bookingStatusData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">User Distribution by Role</h6>
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
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">Monthly Booking Trends</h6>
            </Card.Header>
            <Card.Body>
              <Line data={monthlyBookingsData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">All Users</h5>
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
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0"><FaCalendarAlt className="me-2" />My Bookings</h5>
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
        <Card.Header>
          <h5 className="mb-0">Recent Bookings</h5>
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
