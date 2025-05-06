import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, ListGroup, 
  ListGroupItem, Badge, Button, Spinner, Alert, Row, Col,
  FormGroup, Label, Input, Form, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOrderDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [statusModal, setStatusModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [deliveryPersonModal, setDeliveryPersonModal] = useState(false);
  const [designImageModal, setDesignImageModal] = useState(false);
  const [receiptImageModal, setReceiptImageModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/orders/${id}`);
        
        if (response.data.code === 200) {
          const orderData = response.data.data.order;
          setOrder(orderData);
          setNewStatus(orderData.status);
          setNewPaymentStatus(orderData.payment.status);
          
          // Fetch delivery persons if needed
          if (['accepted', 'preparing', 'ready'].includes(orderData.status)) {
            fetchDeliveryPersons();
          }
        } else {
          setError('Failed to load order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('An error occurred while loading order details');
      } finally {
        setLoading(false);
      }
    };

    const fetchDeliveryPersons = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/delivery-persons');
        
        if (response.data.code === 200) {
          setDeliveryPersons(response.data.data.deliveryPersons || []);
        }
      } catch (error) {
        console.error('Error fetching delivery persons:', error);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

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

  const toggleStatusModal = () => setStatusModal(!statusModal);
  const togglePaymentModal = () => setPaymentModal(!paymentModal);
  const toggleDeliveryPersonModal = () => setDeliveryPersonModal(!deliveryPersonModal);
  const toggleDesignImageModal = () => setDesignImageModal(!designImageModal);
  const toggleReceiptImageModal = () => setReceiptImageModal(!receiptImageModal);

  const handleUpdateStatus = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess('');
      
      const response = await axios.put(`http://localhost:4000/api/orders/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.code === 200) {
        setOrder(response.data.data.order);
        setUpdateSuccess('Order status updated successfully');
        toggleStatusModal();
        
        // If status is now ready or accepted, we might need delivery persons
        if (['accepted', 'preparing', 'ready'].includes(newStatus)) {
          const deliveryResponse = await axios.get('http://localhost:4000/api/delivery-persons');
          if (deliveryResponse.data.code === 200) {
            setDeliveryPersons(deliveryResponse.data.data.deliveryPersons || []);
          }
        }
      } else {
        setUpdateError(response.data.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setUpdateError(error.response?.data?.data?.message || 'An error occurred while updating order status');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdatePayment = async () => {
    try {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess('');
      
      // Check if order has payment information
      if (!order || !order.payment) {
        setUpdateError('Payment information not available');
        setUpdateLoading(false);
        return;
      }
      
      // First, get the payment ID for this order
      let paymentId;
      
      try {
        const paymentResponse = await axios.get(`http://localhost:4000/api/payments/order/${id}`);
        if (paymentResponse.data.code === 200 && paymentResponse.data.data.payment) {
          paymentId = paymentResponse.data.data.payment._id;
        }
      } catch (error) {
        console.error('Error fetching payment:', error);
        // If we can't get the payment ID, we'll try to use the order ID as a fallback
      }
      
      // If we couldn't get a payment ID, log an error and return
      if (!paymentId) {
        console.error('Could not determine payment ID');
        setUpdateError('Could not find payment information for this order');
        setUpdateLoading(false);
        return;
      }
      
      // Now update the payment with the correct payment ID
      const response = await axios.put(`http://localhost:4000/api/payments/${paymentId}/status`, {
        status: newPaymentStatus,
        adminNote: "Updated by admin"
      });
      
      if (response.data.code === 200) {
        // If the response includes the updated order, use it
        if (response.data.data.order) {
          setOrder(response.data.data.order);
        } else {
          // Otherwise, fetch the latest order data
          const orderResponse = await axios.get(`http://localhost:4000/api/orders/${id}`);
          if (orderResponse.data.code === 200) {
            setOrder(orderResponse.data.data.order);
          }
        }
        
        setUpdateSuccess('Payment status updated successfully');
        togglePaymentModal();
      } else {
        setUpdateError(response.data.data.message || 'Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setUpdateError(error.response?.data?.data?.message || 'An error occurred while updating payment status');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  
  const handleAssignDeliveryPerson = async () => {
    if (!selectedDeliveryPerson) {
      setUpdateError('Please select a delivery person');
      return;
    }
    
    try {
      setUpdateLoading(true);
      setUpdateError('');
      setUpdateSuccess('');
      
      const response = await axios.put(`http://localhost:4000/api/orders/${id}/assign-delivery`, {
        deliveryPersonId: selectedDeliveryPerson
      });
      
      
      if (response.data.code === 200) {
        setOrder(response.data.data.order);
        setUpdateSuccess('Delivery person assigned successfully');
        toggleDeliveryPersonModal();
      } else {
        setUpdateError(response.data.data.message || 'Failed to assign delivery person');
      }
    } catch (error) {
      console.error('Error assigning delivery person:', error);
      setUpdateError(error.response?.data?.data?.message || 'An error occurred while assigning delivery person');
    } finally {
      setUpdateLoading(false);
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
          <Link to="/admin/orders">
            <Button color="primary">Return to Orders</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order Details</h1>
        <Link to="/admin/orders">
          <Button color="secondary">Back to Orders</Button>
        </Link>
      </div>
      
      {updateSuccess && (
        <Alert color="success" className="mb-4">
          {updateSuccess}
        </Alert>
      )}
      
      {updateError && (
        <Alert color="danger" className="mb-4">
          {updateError}
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Order #{order.orderNumber}</h4>
              <Badge color={getStatusBadgeColor(order.status)} pill size="lg">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
              </Badge>
            </CardHeader>
            <CardBody>
              <Row className="mb-4">
                <Col md={6}>
                  <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</p>
                </Col>
                <Col md={6} className="text-md-end">
                  <Button 
                    color="primary" 
                    onClick={toggleStatusModal}
                    className="me-2"
                  >
                    Update Status
                  </Button>
                  <Button 
                    color="info" 
                    onClick={togglePaymentModal}
                  >
                    Update Payment
                  </Button>
                </Col>
              </Row>
              
              <h5 className="mb-3">Cake Details</h5>
              <ListGroup flush className="mb-4">
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
                    <strong>Cake Design Image:</strong>
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
              
              <h5 className="mb-3">Delivery Details</h5>
              <ListGroup flush className="mb-4">
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
              
              {order.deliveryPerson ? (
                <div>
                  <h5 className="mb-3">Delivery Person</h5>
                  <ListGroup flush className="mb-4">
                    <ListGroupItem>
                      <strong>Name:</strong> {order.deliveryPerson.name}
                    </ListGroupItem>
                    <ListGroupItem>
                      <strong>Contact:</strong> {order.deliveryPerson.contact}
                    </ListGroupItem>
                    {order.estimatedDeliveryTime && (
                      <ListGroupItem>
                        <strong>Estimated Delivery Time:</strong> {formatDate(order.estimatedDeliveryTime)}
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </div>
              ) : (
                ['accepted', 'preparing', 'ready'].includes(order.status) && (
                  <div className="text-center mb-4">
                    <p>No delivery person assigned yet</p>
                    <Button color="primary" onClick={toggleDeliveryPersonModal}>
                      Assign Delivery Person
                    </Button>
                  </div>
                )
              )}
            </CardBody>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm mb-4">
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
              
              {order.payment.method === 'bank' && order.payment.receiptImage && (
                <div className="mt-3">
                  <h5>Payment Receipt</h5>
                  <img 
                    src={`http://localhost:4000${order.payment.receiptImage}`} 
                    alt="Payment Receipt" 
                    className="img-fluid mt-2 border rounded"
                    style={{ cursor: 'pointer' }}
                    onClick={toggleReceiptImageModal}
                  />
                  <div className="mt-1">
                    <Button color="link" size="sm" onClick={toggleReceiptImageModal}>
                      View Larger Image
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <h4 className="mb-0">Order Timeline</h4>
            </CardHeader>
            <CardBody>
              <div className="timeline">
                {order.statusHistory && order.statusHistory.map((statusChange, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-badge bg-primary">
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="timeline-content">
                      <h6 className="mb-1">
                        {statusChange.status.charAt(0).toUpperCase() + statusChange.status.slice(1).replace('-', ' ')}
                      </h6>
                      <p className="text-muted mb-0 small">
                        {formatDate(statusChange.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      {/* Status Update Modal */}
      <Modal isOpen={statusModal} toggle={toggleStatusModal}>
        <ModalHeader toggle={toggleStatusModal}>Update Order Status</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="status">Select New Status</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="not-delivered">Not Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleStatusModal}>Cancel</Button>
          <Button 
            color="primary" 
            onClick={handleUpdateStatus}
            disabled={updateLoading}
          >
            {updateLoading ? <Spinner size="sm" /> : 'Update Status'}
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Payment Update Modal */}
      <Modal isOpen={paymentModal} toggle={togglePaymentModal}>
        <ModalHeader toggle={togglePaymentModal}>Update Payment Status</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="paymentStatus">Select Payment Status</Label>
            <Input
              type="select"
              name="paymentStatus"
              id="paymentStatus"
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Accept</option>
              <option value="rejected">Reject</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={togglePaymentModal}>Cancel</Button>
          <Button 
            color="primary" 
            onClick={handleUpdatePayment}
            disabled={updateLoading}
          >
            {updateLoading ? <Spinner size="sm" /> : 'Update Payment'}
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Delivery Person Modal */}
      <Modal isOpen={deliveryPersonModal} toggle={toggleDeliveryPersonModal}>
        <ModalHeader toggle={toggleDeliveryPersonModal}>Assign Delivery Person</ModalHeader>
        <ModalBody>
          {deliveryPersons.length === 0 ? (
            <Alert color="warning">
              No delivery persons available. Please add delivery persons first.
            </Alert>
          ) : (
            <FormGroup>
              <Label for="deliveryPerson">Select Delivery Person</Label>
              <Input
                type="select"
                name="deliveryPerson"
                id="deliveryPerson"
                value={selectedDeliveryPerson}
                onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
              >
                <option value="">Select a delivery person</option>
                {deliveryPersons.map(person => (
                  <option key={person._id} value={person._id}>
                    {person.name} - {person.contact}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeliveryPersonModal}>Cancel</Button>
          <Button 
            color="primary" 
            onClick={handleAssignDeliveryPerson}
            disabled={updateLoading || deliveryPersons.length === 0}
          >
            {updateLoading ? <Spinner size="sm" /> : 'Assign'}
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Design Image Modal */}
      <Modal isOpen={designImageModal} toggle={toggleDesignImageModal} size="lg">
        <ModalHeader toggle={toggleDesignImageModal}>Cake Design Image</ModalHeader>
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
      
      {/* Receipt Image Modal */}
      <Modal isOpen={receiptImageModal} toggle={toggleReceiptImageModal} size="lg">
        <ModalHeader toggle={toggleReceiptImageModal}>Payment Receipt Image</ModalHeader>
        <ModalBody className="text-center">
          {order.payment.receiptImage && (
            <img 
              src={`http://localhost:4000${order.payment.receiptImage}`} 
              alt="Payment Receipt" 
              style={{ maxWidth: '100%' }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleReceiptImageModal}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminOrderDetailsPage;

