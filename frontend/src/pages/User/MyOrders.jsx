import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardHeader, 
  Table, Badge, Button, Spinner, Alert, Modal, 
  ModalHeader, ModalBody, ModalFooter, Progress
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyOrders = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    fetchOrders(parsedUser._id);
  }, [navigate]);
  
  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      
      const response = await axios.get(`http://localhost:4000/api/orders/user/${userId}`);
      
      if (response.data.code === 200) {
        setOrders(response.data.data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('An error occurred while loading your orders');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleDetailsModal = (order = null) => {
    setDetailsModal(!detailsModal);
    setSelectedOrder(order);
  };
  
  const toggleCancelModal = (order = null) => {
    setCancelModal(!cancelModal);
    setSelectedOrder(order);
    setCancelError('');
  };
  
  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    
    setCancelLoading(true);
    setCancelError('');
    
    try {
      const response = await axios.put(
        `http://localhost:4000/api/orders/${selectedOrder._id}/cancel`,
        { userId: user._id }
      );
      
      if (response.data.code === 200) {
        // Update the order in the orders array
        const updatedOrders = orders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, status: 'cancelled' } 
            : order
        );
        
        setOrders(updatedOrders);
        toggleCancelModal();
      } else {
        setCancelError(response.data.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setCancelError(error.response?.data?.data?.message || 'An error occurred while cancelling the order');
    } finally {
      setCancelLoading(false);
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
  
  // Function to get order progress percentage
  const getOrderProgress = (status) => {
    switch (status) {
      case 'pending':
        return 10;
      case 'accepted':
        return 25;
      case 'preparing':
        return 50;
      case 'ready':
        return 75;
      case 'dispatched':
        return 90;
      case 'delivered':
        return 100;
      case 'not-delivered':
        return 100;
      case 'cancelled':
        return 100;
      default:
        return 0;
    }
  };
  
  // Function to check if order can be cancelled
  const canCancelOrder = (status) => {
    return ['pending', 'accepted'].includes(status);
  };
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }
  
  return (
    <Container className="my-orders-container py-5">
      <Row className="mb-4">
        <Col>
          <h1>My Orders</h1>
          <p className="text-muted">View and manage your cake orders</p>
        </Col>
        <Col xs="auto">
          <Link to="/user/dashboard" className="btn btn-outline-primary">
            Back to Dashboard
          </Link>
        </Col>
      </Row>
      
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {orders.length === 0 ? (
        <Card className="shadow-sm">
          <CardBody className="text-center py-5">
            <h3>No Orders Found</h3>
            <p className="text-muted mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">
              Browse Cakes
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <h4 className="mb-0">Your Orders ({orders.length})</h4>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Cake</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.orderNumber}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        {order.cakeDetails.cakeCategory.name} - {order.cakeDetails.cakeSize.charAt(0) + order.cakeDetails.cakeSize.slice(1)}
                      </td>
                      <td>Rs. {order.pricing.totalPrice}</td>
                      <td>
                        <Badge color={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => toggleDetailsModal(order)}
                        >
                          Details
                        </Button>
                        {canCancelOrder(order.status) && (
                          <Button 
                            color="danger" 
                            size="sm"
                            onClick={() => toggleCancelModal(order)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}
      
      {/* Order Details Modal */}
      <Modal isOpen={detailsModal} toggle={() => toggleDetailsModal()} size="lg">
        <ModalHeader toggle={() => toggleDetailsModal()}>
          Order Details
        </ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Order Information</h5>
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge color={getStatusBadgeColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Delivery Information</h5>
                  <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                  <p><strong>City:</strong> {selectedOrder.city}</p>
                  <p><strong>Delivery Date:</strong> {formatDate(selectedOrder.deliveryDate)}</p>
                </Col>
              </Row>
              
              <h5 className="mb-3">Order Progress</h5>
              <Progress 
                value={getOrderProgress(selectedOrder.status)} 
                className="mb-4"
                color={getStatusBadgeColor(selectedOrder.status)}
              />
              
              <h5 className="mb-3">Cake Details</h5>
              <Card className="mb-4">
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <p><strong>Cake Type:</strong> {selectedOrder.cakeDetails.cakeCategory.name}</p>
                      <p><strong>Size:</strong> {selectedOrder.cakeDetails.cakeSize.charAt(0) + selectedOrder.cakeDetails.cakeSize.slice(1)}</p>
                      <p><strong>Message on Cake:</strong> {selectedOrder.cakeDetails.messageOnCake || 'None'}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Flavor:</strong> {selectedOrder.cakeDetails.flavor || 'Standard'}</p>
                      <p><strong>Special Instructions:</strong> {selectedOrder.cakeDetails.specialInstructions || 'None'}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              
              <h5 className="mb-3">Add-ons</h5>
              {selectedOrder.cakeDetails.addons && selectedOrder.cakeDetails.addons.length > 0 ? (
                <Card className="mb-4">
                  <CardBody>
                    <ul className="list-group list-group-flush">
                      {selectedOrder.cakeDetails.addons.map((addon, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {addon.name}
                          <span>Rs. {addon.price}</span>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              ) : (
                <p className="text-muted">No add-ons selected</p>
              )}
              
              <h5 className="mb-3">Price Breakdown</h5>
              <Card>
                <CardBody>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Base Price ({selectedOrder.cakeDetails.cakeSize})
                      <span>Rs. {selectedOrder.pricing.basePrice}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Category Price ({selectedOrder.cakeDetails.cakeCategory.name})
                      <span>Rs. {selectedOrder.pricing.categoryPrice}</span>
                    </li>
                    {selectedOrder.pricing.addonsPrice > 0 && (
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Add-ons
                        <span>Rs. {selectedOrder.pricing.addonsPrice}</span>
                      </li>
                    )}
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Delivery Fee
                      <span>Rs. {selectedOrder.pricing.deliveryFee}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                      Total
                      <span>Rs. {selectedOrder.pricing.totalPrice}</span>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleDetailsModal()}>Close</Button>
          {selectedOrder && canCancelOrder(selectedOrder.status) && (
            <Button color="danger" onClick={() => {
              toggleDetailsModal();
              toggleCancelModal(selectedOrder);
            }}>
              Cancel Order
            </Button>
          )}
        </ModalFooter>
      </Modal>
      
      {/* Cancel Order Modal */}
      <Modal isOpen={cancelModal} toggle={() => toggleCancelModal()}>
        <ModalHeader toggle={() => toggleCancelModal()}>
          Cancel Order
        </ModalHeader>
        <ModalBody>
          {cancelError && (
            <Alert color="danger" className="mb-4">
              {cancelError}
            </Alert>
          )}
          
          <p>Are you sure you want to cancel this order?</p>
          
          {selectedOrder && (
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-1"><strong>Order #:</strong> {selectedOrder.orderNumber}</p>
              <p className="mb-1"><strong>Cake:</strong> {selectedOrder.cakeDetails.cakeCategory.name} - {selectedOrder.cakeDetails.cakeSize.charAt(0) + selectedOrder.cakeDetails.cakeSize.slice(1)}</p>
              <p className="mb-0"><strong>Total:</strong> Rs. {selectedOrder.pricing.totalPrice}</p>
            </div>
          )}
          
          <p className="text-danger">This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleCancelModal()}>
            No, Keep Order
          </Button>
          <Button 
            color="danger" 
            onClick={handleCancelOrder}
            disabled={cancelLoading}
          >
            {cancelLoading ? <Spinner size="sm" /> : 'Yes, Cancel Order'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default MyOrders;

