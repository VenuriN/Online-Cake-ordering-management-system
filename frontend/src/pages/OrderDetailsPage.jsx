import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, ListGroup, 
  ListGroupItem, Badge, Button, Spinner, Alert, Row, Col,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [designImageModal, setDesignImageModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/orders/${id}`);
        
        if (response.data.code === 200) {
          setOrder(response.data.data.order);
        } else {
          setError('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('An error occurred while loading your order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'success';
      case 'dispatched':
        return 'info';
      case 'delivered':
        return 'success';
      case 'not-delivered':
        return 'danger';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleDesignImageModal = () => setDesignImageModal(!designImageModal);

  // Function to check if order can be cancelled
  const canBeCancelled = () => {
    if (!order) return false;
    
    // Only pending orders can be cancelled
    if (order.status !== 'pending') return false;
    
    // Check if order is within 24 hours
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - orderTime) / (1000 * 60 * 60);
    
    return hoursDifference <= 24;
  };

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    if (!canBeCancelled()) return;
    
    try {
      setCancelLoading(true);
      setCancelError('');
      setCancelSuccess('');
      
      const response = await axios.put(`http://localhost:4000/api/orders/${id}/cancel`);
      
      if (response.data.code === 200) {
        setCancelSuccess('Order cancelled successfully');
        // Update the order in state
        setOrder(response.data.data.order);
      } else {
        setCancelError(response.data.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setCancelError(error.response?.data?.data?.message || 'An error occurred while cancelling your order');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="my-5">
        <Alert color="danger">
          {error || 'Order not found'}
        </Alert>
        <div className="text-center mt-4">
          <Link to="/user/orders">
            <Button color="primary">Return to Orders</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow">
        <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Order Details</h2>
          <Badge color={getStatusBadgeColor(order.status)} pill size="lg">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
          </Badge>
        </CardHeader>
        <CardBody>
          {cancelSuccess && (
            <Alert color="success" className="mb-4">
              {cancelSuccess}
            </Alert>
          )}
          
          {cancelError && (
            <Alert color="danger" className="mb-4">
              {cancelError}
            </Alert>
          )}
          
          <Row className="mb-4">
            <Col md={6}>
              <p><strong>Order Number:</strong> {order.orderNumber}</p>
              <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
            </Col>
            <Col md={6} className="text-md-end">
              {canBeCancelled() && (
                <Button 
                  color="danger" 
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? <Spinner size="sm" /> : 'Cancel Order'}
                </Button>
              )}
            </Col>
          </Row>

          <Card className="mb-4">
          <CardHeader>
              <h4 className="mb-0">Cake Details</h4>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                <ListGroupItem>
                  <strong>Cake Size:</strong> {order.cakeDetails.cakeSize.charAt(0).toUpperCase() + order.cakeDetails.cakeSize.slice(1)}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Cake Category:</strong> {order.cakeDetails.cakeCategory.name}
                </ListGroupItem>
                {order.cakeDetails.addons && order.cakeDetails.addons.length > 0 && (
                  <ListGroupItem>
                    <strong>Addons:</strong>
                    <ul className="mb-0 mt-1">
                      {order.cakeDetails.addons.map(addon => (
                        <li key={addon._id}>{addon.name}</li>
                      ))}
                    </ul>
                  </ListGroupItem>
                )}
                {order.cakeDetails.designImage && (
                  <ListGroupItem>
                    <strong>Your Cake Design:</strong>
                    <div className="mt-2">
                      <img 
                        src={`http://localhost:4000${order.cakeDetails.designImage}`} 
                        alt="Cake Design" 
                        style={{ maxWidth: '150px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px' }}
                        onClick={toggleDesignImageModal}
                      />
                      <div className="mt-1">
                        <Button color="link" size="sm" onClick={toggleDesignImageModal}>
                          View Larger Image
                        </Button>
                      </div>
                    </div>
                  </ListGroupItem>
                )}
                {order.cakeDetails.specialInstructions && (
                  <ListGroupItem>
                    <strong>Special Instructions:</strong>
                    <p className="mb-0 mt-1">{order.cakeDetails.specialInstructions}</p>
                  </ListGroupItem>
                )}
              </ListGroup>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <h4 className="mb-0">Delivery Details</h4>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                <ListGroupItem>
                  <strong>Name:</strong> {order.deliveryDetails.name}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Email:</strong> {order.deliveryDetails.email}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Contact:</strong> {order.deliveryDetails.contact}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>City:</strong> {order.deliveryDetails.city.name}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Address:</strong> {order.deliveryDetails.address}
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <h4 className="mb-0">Payment Details</h4>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                <ListGroupItem>
                  <strong>Payment Method:</strong> {order.payment.method === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                </ListGroupItem>
                <ListGroupItem>
                  <strong>Payment Status:</strong> 
                  <Badge 
                    color={order.payment.status === 'paid' ? 'success' : 'warning'} 
                    className="ms-2"
                  >
                    {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                  </Badge>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <strong>Base Price:</strong>
                  <span>Rs. {order.pricing.basePrice.toFixed(2)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <strong>Addons:</strong>
                  <span>Rs. {order.pricing.addonsPrice.toFixed(2)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between">
                  <strong>Delivery Fee:</strong>
                  <span>Rs. {order.pricing.deliveryFee.toFixed(2)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between fw-bold">
                  <strong>Total:</strong>
                  <span>Rs. {order.pricing.totalPrice.toFixed(2)}</span>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>

          {order.deliveryPerson && (
            <Card className="mb-4">
              <CardHeader>
                <h4 className="mb-0">Delivery Information</h4>
              </CardHeader>
              <CardBody>
                <ListGroup flush>
                  <ListGroupItem>
                    <strong>Delivery Person:</strong> {order.deliveryPerson.name}
                  </ListGroupItem>
                  <ListGroupItem>
                    <strong>Contact:</strong> {order.deliveryPerson.contact}
                  </ListGroupItem>
                  {order.estimatedDeliveryTime && (
                    <ListGroupItem>
                      <strong>Estimated Delivery Time:</strong> {formatDate(order.estimatedDeliveryTime)}
                    </ListGroupItem>
                  )}
                  {order.deliveryStatus && (
                    <ListGroupItem>
                      <strong>Delivery Status:</strong> 
                      <Badge 
                        color={getStatusBadgeColor(order.deliveryStatus)} 
                        className="ms-2"
                      >
                        {order.deliveryStatus.charAt(0).toUpperCase() + order.deliveryStatus.slice(1).replace('-', ' ')}
                      </Badge>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </CardBody>
            </Card>
          )}

          <div className="text-center mt-4">
            <div className="d-flex justify-content-center gap-3">
              <Link to="/user/orders">
                <Button color="secondary">Back to Orders</Button>
              </Link>
              <Link to="/custom-order">
                <Button color="primary">Place New Order</Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Design Image Modal */}
      <Modal isOpen={designImageModal} toggle={toggleDesignImageModal} size="lg">
        <ModalHeader toggle={toggleDesignImageModal}>Your Cake Design</ModalHeader>
        <ModalBody className="text-center">
          {order.cakeDetails.designImage && (
            <img 
              src={`http://localhost:4000${order.cakeDetails.designImage}`} 
              alt="Cake Design" 
              style={{ maxWidth: '100%' }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDesignImageModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default OrderDetailsPage;

