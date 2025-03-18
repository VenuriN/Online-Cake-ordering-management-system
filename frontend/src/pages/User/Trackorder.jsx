import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, Button,
  Progress, Badge, ListGroup, ListGroupItem, Alert, Spinner
} from 'reactstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:4000/api/v1/custom-order/${orderId}`, // Ensure orderId is used here
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setOrder(response.data.data);
    } catch (error) {
      setError('Failed to load order details. Please try again later.');
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get status percentage for progress bar
  const getStatusPercentage = (status) => {
    const statuses = ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered'];
    const index = statuses.indexOf(status);
    return Math.max(0, Math.min(100, (index / (statuses.length - 1)) * 100));
  };

  // Get badge color based on status
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

  // Get readable status text
  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" />
        <p className="mt-3">Loading order details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert color="danger">{error}</Alert>
        <Button tag={Link} to="/dashboard" color="primary">
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert color="warning">
          Order not found. Please check your order ID or contact customer support.
        </Alert>
        <Button tag={Link} to="/dashboard" color="primary">
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-primary text-white">
              <h3 className="mb-0">Order Tracking</h3>
              <p className="mb-0">Order ID: {order._id}</p>
            </CardHeader>
            
            <CardBody>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Order Status</h5>
                  <Badge color={getStatusBadgeColor(order.status)} pill className="px-3 py-2">
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                
                <Progress 
                  value={getStatusPercentage(order.status)} 
                  color={getStatusBadgeColor(order.status)}
                  className="mb-3"
                  style={{ height: '10px' }}
                />
                
                <div className="d-flex justify-content-between text-muted small">
                  <span>Order Placed</span>
                  <span>Preparing</span>
                  <span>Ready</span>
                  <span>Delivered</span>
                </div>
              </div>
              
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="border-bottom pb-2">Order Details</h5>
                  <ListGroup flush>
                    <ListGroupItem>
                      <strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Total Amount:</strong> Rs. {order.totalPrice.toFixed(2)}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Pending Payment'}
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                
                <Col md={6}>
                  <h5 className="border-bottom pb-2">Delivery Information</h5>
                  <ListGroup flush>
                    <ListGroupItem>
                      <strong>Name:</strong> {order.name}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Phone:</strong> {order.phone}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Area:</strong> {order.city}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Address:</strong> {order.deliveryAddress}
                    </ListGroupItem>
                  </ListGroup>
                </Col>
              </Row>
              
              <h5 className="border-bottom pb-2">Cake Details</h5>
              <Row>
                <Col md={6}>
                  <ListGroup flush>
                    <ListGroupItem>
                      <strong>Size:</strong> {
                        order.cakeSize === '1' ? 'Small (1-10 people)' :
                        order.cakeSize === '2' ? 'Medium (11-25 people)' :
                        order.cakeSize === '3' ? 'Large (26-50 people)' :
                        'X-Large (50+ people)'
                      }
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Shape:</strong> {order.cakeShape.charAt(0).toUpperCase() + order.cakeShape.slice(1)}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Flavor:</strong> {order.cakeFlavor}
                    </ListGroupItem>
                  </ListGroup>
                </Col>
                
                <Col md={6}>
                  <ListGroup flush>
                    <ListGroupItem>
                      <strong>Frosting:</strong> {order.frosting}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Toppings:</strong> {order.toppings.join(', ') || 'None'}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Special Instructions:</strong> {order.specialInstructions || 'None'}
                    </ListGroupItem>
                  </ListGroup>
                </Col>
              </Row>
              
              <div className="mt-4 d-flex justify-content-between">
                <Button tag={Link} to="/dashboard" color="secondary">
                  Back to Dashboard
                </Button>
                {order.status === 'pending' && (
                  <Button color="danger" outline>
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderTracking;
