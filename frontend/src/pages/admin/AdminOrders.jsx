import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, Table, 
  Badge, Button, Spinner, Alert, Row, Col,
  Input, FormGroup, Label, Form
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    search: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('http://localhost:4000/api/orders');
        
        if (response.data.code === 200) {
          const ordersData = response.data.data.orders || [];
          setOrders(ordersData);
          setFilteredOrders(ordersData);
        } else {
          setError('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('An error occurred while loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters state changes
    applyFilters();
  }, [filters, orders]);

  const applyFilters = () => {
    let result = [...orders];
    
    // Filter by status
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateRange) {
        const today = new Date();
        const startDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            result = result.filter(order => new Date(order.createdAt) >= startDate);
            break;
          case 'yesterday':
            startDate.setDate(today.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            const endOfYesterday = new Date(startDate);
            endOfYesterday.setHours(23, 59, 59, 999);
            result = result.filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= startDate && orderDate <= endOfYesterday;
            });
            break;
          case 'week':
            startDate.setDate(today.getDate() - 7);
            result = result.filter(order => new Date(order.createdAt) >= startDate);
            break;
          case 'month':
            startDate.setMonth(today.getMonth() - 1);
            result = result.filter(order => new Date(order.createdAt) >= startDate);
            break;
          default:
            break;
        }
      }
      
      // Filter by search term (order number or customer name)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(order => 
          order.orderNumber.toLowerCase().includes(searchTerm) || 
          order.deliveryDetails.name.toLowerCase().includes(searchTerm) ||
          order.deliveryDetails.email.toLowerCase().includes(searchTerm)
        );
      }
      
      setFilteredOrders(result);
    };
  
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const resetFilters = () => {
      setFilters({
        status: '',
        dateRange: '',
        search: ''
      });
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
        <h1 className="mb-4">Manage Orders</h1>
        
        <Card className="shadow-sm mb-4">
          <CardBody>
            <Form>
              <Row>
                <Col md={3}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                      type="select"
                      name="status"
                      id="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Statuses</option>
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
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="dateRange">Date Range</Label>
                    <Input
                      type="select"
                      name="dateRange"
                      id="dateRange"
                      value={filters.dateRange}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="search">Search</Label>
                    <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search by order # or customer name"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button color="secondary" onClick={resetFilters} className="w-100">
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <h4 className="mb-0">Orders ({filteredOrders.length})</h4>
          </CardHeader>
          <CardBody>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <h4>No orders found</h4>
                <p className="text-muted">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Cake</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td>{order.orderNumber}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.deliveryDetails.name}</td>
                        <td>
                          {order.cakeDetails.cakeCategory.name} - {order.cakeDetails.cakeSize.charAt(0).toUpperCase() + order.cakeDetails.cakeSize.slice(1)}
                        </td>
                        <td>Rs. {order.pricing.totalPrice.toFixed(2)}</td>
                        <td>
                          <Badge color={order.payment.status === 'paid' ? 'success' : 'warning'}>
                            {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <Badge color={getStatusBadgeColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                          </Badge>
                        </td>
                        <td>
                          <Link to={`/admin/orders/${order._id}`}>
                            <Button color="primary" size="sm">
                              Manage
                            </Button>
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
  
  export default AdminOrdersPage;
  
