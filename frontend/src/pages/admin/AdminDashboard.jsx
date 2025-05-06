import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardHeader, 
  CardTitle, CardText, Button, Spinner, Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    ordersByStatus: {},
    revenueByMonth: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const adminData = JSON.parse(localStorage.getItem('admin'));
      
      if (adminData) {
        setDashboardData(adminData);
      } else {
        setError('No dashboard data found');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('An error occurred while loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'accepted':
        return '#17A2B8';
      case 'preparing':
        return '#007BFF';
      case 'ready':
        return '#28A745';
      case 'dispatched':
        return '#17A2B8';
      case 'delivered':
        return '#28A745';
      case 'not-delivered':
        return '#DC3545';
      case 'cancelled':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert color="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4 px-4">
      <h1 className="mb-4 text-center text-md-start" style={{ color: '#2C3E50', fontWeight: 'bold' }}>Admin Dashboard</h1>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardHeader className="bg-gradient-primary text-white" style={{ background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0 py-3 text-center">Administrative Control Center</h5>
            </CardHeader>
            <CardBody className="p-4">
              <Row className="g-4">
              <Col lg={4}>
                  <Link to="/admin/orders" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-orders">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 orders-icon">
                          <i className="fas fa-shopping-cart fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Order Management</h4>
                        <p className="text-muted">Track, process, and manage customer orders. View order history and update order statuses in real-time.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/categories" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-categories">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 categories-icon">
                          <i className="fas fa-list fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Category Control</h4>
                        <p className="text-muted">Organize and manage product categories. Create, edit, and arrange your menu structure efficiently.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/addons" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-addons">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 addons-icon">
                          <i className="fas fa-plus-circle fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Addon Management</h4>
                        <p className="text-muted">Configure product add-ons and extras. Customize options to enhance customer experience.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/users" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-users">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 users-icon">
                          <i className="fas fa-users fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">User Administration</h4>
                        <p className="text-muted">Manage user accounts, permissions, and customer profiles. Monitor user activity and engagement.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/delivery" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-delivery">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 delivery-icon">
                          <i className="fas fa-truck fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Delivery Operations</h4>
                        <p className="text-muted">Coordinate delivery services, track shipments, and manage delivery personnel assignments.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/finance" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-finance">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 finance-icon">
                          <i className="fas fa-chart-line fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Financial Overview</h4>
                        <p className="text-muted">Monitor revenue, analyze financial trends, and generate comprehensive financial reports.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/inventory" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-inventory">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 inventory-icon">
                          <i className="fas fa-boxes fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Inventory Control</h4>
                        <p className="text-muted">Track stock levels, manage product inventory, and set up automatic reorder notifications.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
                <Col lg={4}>
                  <Link to="/admin/admin-management" className="text-decoration-none">
                    <Card className="h-100 border-0 quick-action-card card-admin">
                      <CardBody className="d-flex flex-column text-center p-4">
                        <div className="icon-wrapper mb-3 admin-icon">
                          <i className="fas fa-user-shield fa-3x"></i>
                        </div>
                        <h4 className="card-title mb-2">Admin Management</h4>
                        <p className="text-muted">Manage administrator accounts, create new admins, update roles and permissions.</p>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .quick-action-card {
            transition: all 0.3s ease;
            border-radius: 15px;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .quick-action-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 20px rgba(0,0,0,0.15);
          }
          .icon-wrapper {
            height: 80px;
            width: 80px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
          }
          .card-orders .icon-wrapper { background: linear-gradient(135deg, #FF6B6B, #FFE66D); }
          .card-categories .icon-wrapper { background: linear-gradient(135deg, #4ECDC4, #556270); }
          .card-addons .icon-wrapper { background: linear-gradient(135deg, #A8E6CF, #DCEDC1); }
          .card-users .icon-wrapper { background: linear-gradient(135deg, #6C5B7B, #C06C84); }
          .card-delivery .icon-wrapper { background: linear-gradient(135deg, #45B649, #DCE35B); }
          .card-finance .icon-wrapper { background: linear-gradient(135deg, #3494E6, #EC6EAD); }
          .card-inventory .icon-wrapper { background: linear-gradient(135deg, #FF8008, #FFC837); }
          .card-admin .icon-wrapper { background: linear-gradient(135deg, #8E2DE2, #4A00E0); }

          .icon-wrapper i {
            color: white;
            -webkit-text-fill-color: white;
          }
          
          .quick-action-card:hover .icon-wrapper {
            transform: scale(1.1);
          }

          .card-title {
            color: #2C3E50;
            font-weight: 600;
          }
          .text-muted {
            font-size: 0.9rem;
            line-height: 1.5;
          }
        `}
      </style>
    </Container>
  );
};

export default AdminDashboardPage;
