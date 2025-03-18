import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, CardFooter,
  Button, Badge, Spinner, Alert, Progress, Table, Nav,
  NavItem, NavLink, DropdownToggle, DropdownMenu, DropdownItem,
  UncontrolledDropdown, ListGroup, ListGroupItem, InputGroup, Input
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaShoppingBag, FaUsers, FaChartLine, FaCog, FaSignOutAlt, 
  FaBell, FaCalendarAlt, FaClipboardList, FaUserCog, FaUtensils,
  FaMoneyBillWave, FaTruck, FaBoxOpen, FaStore, FaEnvelope
} from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ordersCount: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin, if not redirect to login
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get dashboard statistics
      // Note: This is a placeholder. You'll need to implement the actual API endpoints.
      const response = await axios.get('http://localhost:4000/api/v1/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If you don't have the API endpoint yet, use placeholder data
      // Remove this when you have the actual API
      setStats({
        ordersCount: 156,
        pendingOrders: 18,
        totalRevenue: 289500,
        totalUsers: 423,
        recentOrders: [
          { id: '1', customerName: 'John Doe', totalAmount: 3500, status: 'pending', date: '2023-03-15' },
          { id: '2', customerName: 'Sarah Smith', totalAmount: 4200, status: 'dispatched', date: '2023-03-14' },
          { id: '3', customerName: 'Michael Brown', totalAmount: 2800, status: 'delivered', date: '2023-03-13' },
          { id: '4', customerName: 'Emily Johnson', totalAmount: 5300, status: 'preparing', date: '2023-03-12' },
          { id: '5', customerName: 'Robert Wilson', totalAmount: 3900, status: 'accepted', date: '2023-03-11' }
        ]
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'dispatched': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container fluid className="px-4 py-4">
        <Row>
          
          <Col md={12}>
            <Row>
              <Col lg={12}>
                <Card className="shadow-sm mb-4">
                  <CardBody className="p-4">
                    <h2 className="mb-4">Welcome, Admin!</h2>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-4">
              <Col lg={3} md={6} className="mb-4 mb-lg-0">
                <Card className="shadow-sm border-0 h-100 bg-primary text-white">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-uppercase opacity-75">Total Orders</h6>
                        <h2 className="mb-0">{stats.ordersCount}</h2>
                      </div>
                      <div className="rounded-circle bg-white p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <FaShoppingBag className="text-primary" size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge color="light" className="text-primary">+12% from last week</Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-4 mb-lg-0">
                <Card className="shadow-sm border-0 h-100 bg-warning text-white">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-uppercase opacity-75">Pending Orders</h6>
                        <h2 className="mb-0">{stats.pendingOrders}</h2>
                      </div>
                      <div className="rounded-circle bg-white p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <FaBoxOpen className="text-warning" size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge color="light" className="text-warning">Requires Attention</Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={3} md={6} className="mb-4 mb-md-0">
                <Card className="shadow-sm border-0 h-100 bg-success text-white">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-uppercase opacity-75">Revenue</h6>
                        <h2 className="mb-0">Rs. {stats.totalRevenue.toLocaleString()}</h2>
                      </div>
                      <div className="rounded-circle bg-white p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <FaMoneyBillWave className="text-success" size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge color="light" className="text-success">+8% from last month</Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={3} md={6}>
                <Card className="shadow-sm border-0 h-100 bg-info text-white">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-uppercase opacity-75">Customers</h6>
                        <h2 className="mb-0">{stats.totalUsers}</h2>
                      </div>
                      <div className="rounded-circle bg-white p-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <FaUsers className="text-info" size={24} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge color="light" className="text-info">+5% from last month</Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* Main Content Area */}
            {/* Quick Action Cards */}
            <h5 className="mb-3">Quick Actions</h5>
            <Row>
              {/* Action Cards */}
              <Col md={4} className="mb-4">
                <Card 
                  className="shadow-sm text-center h-100 border-0 hover-lift" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/admin/orders')}
                >
                  <CardBody className="d-flex flex-column align-items-center">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-3 mb-3">
                      <FaShoppingBag className="text-primary" size={30} />
                    </div>
                    <h5>Manage Orders</h5>
                    <p className="text-muted mb-0">Process, view and update customer orders</p>
                  </CardBody>
                  <CardFooter className="bg-white border-0">
                    <Button color="primary" outline block>
                      Open Orders
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              
              <Col md={4} className="mb-4">
                <Card 
                  className="shadow-sm text-center h-100 border-0 hover-lift" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/admin/inventory')}
                >
                  <CardBody className="d-flex flex-column align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 mb-3">
                      <FaUtensils className="text-success" size={30} />
                    </div>
                    <h5>Manage Inventory</h5>
                    <p className="text-muted mb-0">Add, edit or remove products from your inventory</p>
                  </CardBody>
                  <CardFooter className="bg-white border-0">
                    <Button color="success" outline block>
                      View Inventory
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
              
              <Col md={4} className="mb-4">
                <Card 
                  className="shadow-sm text-center h-100 border-0 hover-lift" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/admin/finance')}
                >
                  <CardBody className="d-flex flex-column align-items-center">
                    <div className="bg-info bg-opacity-10 rounded-circle p-3 mb-3">
                      <FaChartLine className="text-info" size={30} />
                    </div>
                    <h5>Manage Finance</h5>
                    <p className="text-muted mb-0">Analyze sales, revenue and finances</p>
                  </CardBody>
                  <CardFooter className="bg-white border-0">
                    <Button color="info" outline block>
                      See Finances
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-4">
                <Card 
                  className="shadow-sm text-center h-100 border-0 hover-lift" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/admin/orders/new')}
                >
                  <CardBody className="d-flex flex-column align-items-center">
                    <div className="bg-danger bg-opacity-10 rounded-circle p-3 mb-3">
                      <FaShoppingBag className="text-primary" size={30} />
                    </div>
                    <h5>Manage Orders</h5>
                    <p className="text-muted mb-0">Process, view and update customer orders</p>
                  </CardBody>
                  <CardFooter className="bg-white border-0">
                    <Button color="primary" outline block>
                      Open Orders
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>            
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
