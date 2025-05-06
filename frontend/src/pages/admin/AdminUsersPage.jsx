import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, Table, 
  Button, Spinner, Alert, Badge, Modal, ModalHeader, 
  ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import axios from 'axios';

const AdminUsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModal, setUserModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:4000/api/users');
      
      if (response.data.code === 200) {
        setUsers(response.data.data.users || []);
      } else {
        setError('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred while loading users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      setOrderLoading(true);
      
      const response = await axios.get(`http://localhost:4000/api/orders/user/${userId}`);
      
      if (response.data.code === 200) {
        setOrderHistory(response.data.data.orders || []);
      } else {
        setOrderHistory([]);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setOrderHistory([]);
    } finally {
      setOrderLoading(false);
    }
  };

  const toggleUserModal = (user = null) => {
    setUserModal(!userModal);
    if (user) {
      setSelectedUser(user);
      fetchUserOrders(user._id);
    } else {
      setSelectedUser(null);
      setOrderHistory([]);
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
    <Container fluid className="my-4">
      <h1 className="mb-4">Manage Users</h1>
      
      <Card className="shadow-sm">
        <CardHeader>
          <h4 className="mb-0">Registered Users ({users.length})</h4>
        </CardHeader>
        <CardBody>
          {users.length === 0 ? (
            <div className="text-center py-5">
              <h4>No users found</h4>
              <p className="text-muted">No registered users in the system</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>{user.orderCount || 0}</td>
                      <td>
                        <Button 
                          color="primary" 
                          size="sm"
                          onClick={() => toggleUserModal(user)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* User Details Modal */}
      <Modal isOpen={userModal} toggle={() => toggleUserModal()} size="lg">
        <ModalHeader toggle={() => toggleUserModal()}>
          User Details
        </ModalHeader>
        <ModalBody>
          {selectedUser && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Personal Information</h5>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                  <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                </Col>
                <Col md={6}>
                  <h5>Address Information</h5>
                  {selectedUser.address ? (
                    <>
                      <p><strong>Street:</strong> {selectedUser.address.street}</p>
                      <p><strong>City:</strong> {selectedUser.address.city}</p>
                      <p><strong>State:</strong> {selectedUser.address.state}</p>
                      <p><strong>Postal Code:</strong> {selectedUser.address.postalCode}</p>
                    </>
                  ) : (
                    <p>No address information available</p>
                  )}
                </Col>
              </Row>
              
              <h5 className="mb-3">Order History</h5>
              {orderLoading ? (
                <div className="text-center py-4">
                  <Spinner color="primary" />
                </div>
              ) : orderHistory.length === 0 ? (
                <Alert color="info">
                  This user has not placed any orders yet.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover size="sm">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Cake</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map(order => (
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
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleUserModal()}>Close</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminUsersPage;
