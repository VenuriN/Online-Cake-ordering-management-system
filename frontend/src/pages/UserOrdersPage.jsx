import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, Table, 
  Badge, Button, Spinner, Alert, Row, Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          setError('You must be logged in to view your orders');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:4000/api/orders/user/${user._id}`);
        
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

    fetchUserOrders();
  }, []);

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
        <CardHeader className="bg-primary text-white">
          <h2 className="mb-0">My Orders</h2>
        </CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <div className="text-center py-5">
              <h4>You haven't placed any orders yet</h4>
              <p className="mt-3">
                <Link to="/custom-order">
                  <Button color="primary">Place Your First Order</Button>
                </Link>
              </p>
            </div>
          ) : (
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
                        {order.cakeDetails.cakeCategory.name} - {order.cakeDetails.cakeSize.charAt(0).toUpperCase() + order.cakeDetails.cakeSize.slice(1)}
                      </td>
                      <td>Rs. {order.pricing.totalPrice.toFixed(2)}</td>
                      <td>
                        <Badge color={getStatusBadgeColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`/order/${order._id}`}>
                          <Button color="info" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default UserOrdersPage;
