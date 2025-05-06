import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, 
  ListGroup, ListGroupItem, Button, Spinner, Alert
} from 'reactstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/orders/${orderId}`);
        
        // Check if the response has the expected structure
        if (response.data && response.data.data && response.data.data.order) {
          setOrder(response.data.data.order);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Failed to load order details. Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('An error occurred while loading your order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

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
          <Link to="/dashboard">
            <Button color="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow">
        <CardHeader className="bg-success text-white">
          <h2 className="mb-0">Order Placed Successfully!</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center mb-4">
            <i className="fa fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3">Thank you for your order</h3>
            <p className="lead">Your order has been received and is being processed.</p>
            <p>Order Number: <strong>{order.orderNumber}</strong></p>
          </div>

          <Card className="mb-4">
            <CardHeader>
              <h4 className="mb-0">Order Summary</h4>
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
                  <strong>Payment Status:</strong> <span className="badge bg-warning text-dark">Pending</span>
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

          <div className="text-center mt-4">
            <p>You will receive an email confirmation shortly.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/user/dashboard">
                <Button color="primary">Go to Dashboard</Button>
              </Link>
              <Link to="/user/orders">
                <Button color="secondary">View All Orders</Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default OrderConfirmation;
