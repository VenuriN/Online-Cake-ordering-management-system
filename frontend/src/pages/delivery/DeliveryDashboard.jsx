import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardHeader, 
  Table, Badge, Button, Spinner, Alert, Modal, 
  ModalHeader, ModalBody, ModalFooter, Form, FormGroup,
  Label, Input
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaPhoneAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';

const DeliveryDashboard = () => {
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Order update modal
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  
  // Order details modal
  const [detailsModal, setDetailsModal] = useState(false);
  
  // Filter state
  const [filter, setFilter] = useState('all'); // all, pending, delivered, not-delivered
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get delivery person from localStorage
    const deliveryPersonData = localStorage.getItem('deliveryPerson');
    if (!deliveryPersonData) {
      navigate('/delivery/login');
      return;
    }
    
    const parsedDeliveryPerson = JSON.parse(deliveryPersonData);
    setDeliveryPerson(parsedDeliveryPerson);
    
    fetchAssignedOrders(parsedDeliveryPerson._id);
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchAssignedOrders(parsedDeliveryPerson._id, false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const fetchAssignedOrders = async (deliveryPersonId, showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      const response = await axios.get(`http://localhost:4000/api/orders/delivery-person/${deliveryPersonId}`);
      
      if (response.data.code === 200) {
        setOrders(response.data.data.orders || []);
      } else {
        setError('Failed to load assigned orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('An error occurred while loading your assigned orders');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('deliveryPerson');
    navigate('/delivery/login');
  };
  
  const toggleUpdateModal = (order = null) => {
    setUpdateModal(!updateModal);
    setSelectedOrder(order);
    
    if (order) {
      setUpdateStatus(order.status === 'dispatched' ? 'delivered' : order.status);
      setUpdateNotes('');
    }
    
    setUpdateError('');
  };
  
  const toggleDetailsModal = (order = null) => {
    setDetailsModal(!detailsModal);
    setSelectedOrder(order);
  };
  
  const handleUpdateOrder = async () => {
    if (!selectedOrder || !updateStatus) return;
    
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      const response = await axios.put(
        `http://localhost:4000/api/orders/${selectedOrder._id}/status`,
        {
          status: updateStatus,
          notes: updateNotes,
          deliveryPersonId: deliveryPerson._id
        }
      );
      
      if (response.data.code === 200) {
        // Update the order in the orders array
        const updatedOrders = orders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, status: updateStatus, deliveryNotes: updateNotes } 
            : order
        );
        
        setOrders(updatedOrders);
        toggleUpdateModal();
      } else {
        setUpdateError(response.data.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update order error:', error);
      setUpdateError(error.response?.data?.data?.message || 'An error occurred while updating the order');
    } finally {
      setUpdateLoading(false);
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
      case 'dispatched':
        return 'info';
      case 'delivered':
        return 'success';
      case 'not-delivered':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  // Filter orders based on current filter
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }
  
  return (
    <Container fluid className="py-4 mt-5 pt-5">
      <Row className="mb-4">
        <Col>
          <h1>Delivery Dashboard</h1>
        </Col>
        <Col xs="auto">
          <Button color="danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Col>
      </Row>
      
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <CardBody className="text-center">
              <div className="mb-3">
                <div className="avatar-placeholder bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  <FaUser />
                </div>
              </div>
              <h3>{deliveryPerson?.name}</h3>
              <p className="text-muted mb-2">{deliveryPerson?.email}</p>
              <p className="mb-2">
                <FaPhoneAlt className="me-2 text-primary" />
                {deliveryPerson?.contact}
              </p>
              <p>
                <FaMapMarkerAlt className="me-2 text-primary" />
                {deliveryPerson?.city?.name || 'City not available'}
              </p>
              <Badge color={deliveryPerson?.isActive ? 'success' : 'danger'} className="px-3 py-2">
                {deliveryPerson?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardBody>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm h-100">
            <CardBody>
              <h4 className="mb-3">Delivery Statistics</h4>
              <Row>
                <Col md={4}>
                  <div className="border rounded p-3 text-center mb-3 mb-md-0">
                    <h2 className="text-primary">{orders.filter(o => o.status === 'dispatched').length}</h2>
                    <p className="mb-0">Pending Deliveries</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 text-center mb-3 mb-md-0">
                    <h2 className="text-success">{orders.filter(o => o.status === 'delivered').length}</h2>
                    <p className="mb-0">Delivered Orders</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 text-center">
                    <h2 className="text-danger">{orders.filter(o => o.status === 'not-delivered').length}</h2>
                    <p className="mb-0">Failed Deliveries</p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Card className="shadow-sm">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Assigned Orders</h4>
          <div>
            <Button 
              color={filter === 'all' ? 'primary' : 'outline-primary'} 
              size="sm"
              className="me-2"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              color={filter === 'dispatched' ? 'info' : 'outline-info'} 
              size="sm"
              className="me-2"
              onClick={() => setFilter('dispatched')}
            >
              Pending
            </Button>
            <Button 
              color={filter === 'delivered' ? 'success' : 'outline-success'} 
              size="sm"
              className="me-2"
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </Button>
            <Button 
              color={filter === 'not-delivered' ? 'danger' : 'outline-danger'} 
              size="sm"
              onClick={() => setFilter('not-delivered')}
            >
              Not Delivered
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-0">No {filter !== 'all' ? filter.replace('-', ' ') : ''} orders assigned to you.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Delivery Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order.orderNumber}</td>
                      <td>
                      <div>{order.user ? order.user.name : 'N/A'}</div>
                      <small className="text-muted">{order.user ? order.user.phone : 'N/A'}</small>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>
                          {order.deliveryAddress}
                        </div>
                        <small className="text-muted">{order.city}</small>
                      </td>
                      <td>
                        <Badge color={getStatusBadgeColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
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
                        {order.status === 'dispatched' && (
                          <Button 
                            color="primary" 
                            size="sm"
                            onClick={() => toggleUpdateModal(order)}
                          >
                            Update
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Order Update Modal */}
      <Modal isOpen={updateModal} toggle={() => toggleUpdateModal()}>
        <ModalHeader toggle={() => toggleUpdateModal()}>
          Update Delivery Status
        </ModalHeader>
        <ModalBody>
          {updateError && (
            <Alert color="danger" className="mb-4">
              {updateError}
            </Alert>
          )}
          
          {selectedOrder && (
            <div>
              <div className="bg-light p-3 rounded mb-4">
                <p className="mb-1"><strong>Order #:</strong> {selectedOrder.orderNumber}</p>
                <p className="mb-1"><strong>Customer:</strong> {selectedOrder.user.name}</p>
                <p className="mb-1"><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                <p className="mb-1"><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                <p className="mb-0"><strong>City:</strong> {selectedOrder.city}</p>
              </div>
              
              <Form>
                <FormGroup>
                  <Label for="status">Delivery Status</Label>
                  <div>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="radio"
                          name="status"
                          value="delivered"
                          checked={updateStatus === 'delivered'}
                          onChange={() => setUpdateStatus('delivered')}
                        />{' '}
                        <span className="text-success">Delivered Successfully</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <Input
                          type="radio"
                          name="status"
                          value="not-delivered"
                          checked={updateStatus === 'not-delivered'}
                          onChange={() => setUpdateStatus('not-delivered')}
                        />{' '}
                        <span className="text-danger">Not Delivered</span>
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label for="notes">Delivery Notes</Label>
                  <Input
                    type="textarea"
                    name="notes"
                    id="notes"
                    placeholder="Add any notes about the delivery..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    rows={3}
                  />
                  <small className="form-text text-muted">
                    {updateStatus === 'not-delivered' ? 'Please explain why the order could not be delivered' : 'Optional: Add any details about the delivery'}
                  </small>
                </FormGroup>
              </Form>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleUpdateModal()}>
            Cancel
          </Button>
          <Button 
            color={updateStatus === 'delivered' ? 'success' : 'danger'} 
            onClick={handleUpdateOrder}
            disabled={updateLoading || !updateStatus}
          >
            {updateLoading ? (
              <Spinner size="sm" />
            ) : updateStatus === 'delivered' ? (
              <><FaCheckCircle className="me-1" /> Confirm Delivery</>
            ) : (
              <><FaTimesCircle className="me-1" /> Mark as Not Delivered</>
            )}
          </Button>
        </ModalFooter>
      </Modal>
      
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
                  <p><strong>Date Placed:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge color={getStatusBadgeColor(selectedOrder.status)}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).replace('-', ' ')}
                    </Badge>
                  </p>
                  {selectedOrder.deliveryNotes && (
                    <div>
                      <strong>Delivery Notes:</strong>
                      <p className="bg-light p-2 rounded">{selectedOrder.deliveryNotes}</p>
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Customer Information</h5>
                  <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                  <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col md={12}>
                  <h5>Delivery Information</h5>
                  <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                  <p><strong>City:</strong> {selectedOrder.city}</p>
                </Col>
              </Row>
              
              <h5 className="mb-3">Cake Details</h5>
              <Card className="mb-4">
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <p><strong>Cake Type:</strong> {selectedOrder.cakeDetails.cakeCategory.name}</p>
                      <p><strong>Size:</strong> {selectedOrder.cakeDetails.cakeSize.charAt(0).toUpperCase() + selectedOrder.cakeDetails.cakeSize.slice(1)}</p>
                      <p><strong>Message on Cake:</strong> {selectedOrder.cakeDetails.messageOnCake || 'None'}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Flavor:</strong> {selectedOrder.cakeDetails.flavor || 'Standard'}</p>
                      <p><strong>Special Instructions:</strong> {selectedOrder.cakeDetails.specialInstructions || 'None'}</p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              
              <h5 className="mb-3">Price Breakdown</h5>
              <Card>
                <CardBody>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Base Price
                      <span>Rs. {selectedOrder.pricing.basePrice}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      Category Price
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
          <Button color="secondary" onClick={() => toggleDetailsModal()}>
            Close
          </Button>
          {selectedOrder && selectedOrder.status === 'dispatched' && (
            <Button 
              color="primary" 
              onClick={() => {
                toggleDetailsModal();
                toggleUpdateModal(selectedOrder);
              }}
            >
              Update Status
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default DeliveryDashboard;
