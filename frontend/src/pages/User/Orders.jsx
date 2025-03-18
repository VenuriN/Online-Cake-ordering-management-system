import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, Table, Badge,
  Button, Spinner, Alert, Pagination, PaginationItem, PaginationLink,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
  InputGroup, Input, InputGroupText
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaSearch, FaFilter, FaSortAmountDown, FaCalendarAlt } from 'react-icons/fa';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { state: { from: '/orders' } });
        return;
      }
      
      let url = `http://localhost:4000/api/v1/custom-order/my-orders?page=${currentPage}`;
      
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      
      if (dateRange.startDate && dateRange.endDate) {
        url += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    // This would typically be done on the server side
    // For now, we'll just filter the orders client-side
    fetchOrders();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-5 mt-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Orders</h3>
              <Button color="light" size="sm" onClick={() => navigate('/custom-orders')}>
                Place New Order
              </Button>
            </CardHeader>
            
            <CardBody>
              {/* Search and Filter Controls */}
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <form onSubmit={handleSearch}>
                    <InputGroup>
                      <Input
                        placeholder="Search by order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <InputGroupText className="bg-primary text-white" style={{ cursor: 'pointer' }} onClick={handleSearch}>
                        <FaSearch />
                      </InputGroupText>
                    </InputGroup>
                  </form>
                </Col>
                
                <Col md={3} className="mb-3 mb-md-0">
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="light" className="w-100">
                      <FaFilter className="me-2" /> 
                      {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => handleStatusFilter('')}>All Statuses</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => handleStatusFilter('pending')}>Pending</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('accepted')}>Accepted</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('preparing')}>Preparing</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('ready')}>Ready</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('dispatched')}>Dispatched</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('delivered')}>Delivered</DropdownItem>
                      <DropdownItem onClick={() => handleStatusFilter('cancelled')}>Cancelled</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Col>
                
                <Col md={3}>
                  <UncontrolledDropdown>
                    <DropdownToggle caret color="light" className="w-100">
                      <FaCalendarAlt className="me-2" /> Date Range
                    </DropdownToggle>
                    <DropdownMenu className="p-3" style={{ width: '300px' }}>
                      <div className="mb-2">
                        <label className="form-label">Start Date</label>
                        <Input
                          type="date"
                          name="startDate"
                          value={dateRange.startDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">End Date</label>
                        <Input
                          type="date"
                          name="endDate"
                          value={dateRange.endDate}
                          onChange={handleDateRangeChange}
                        />
                      </div>
                      <Button 
                        color="primary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => {
                          if (dateRange.startDate && dateRange.endDate) {
                            setCurrentPage(1);
                          }
                        }}
                      >
                        Apply Filter
                      </Button>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Col>
              </Row>
              
              {/* Orders Table */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-3">Loading your orders...</p>
                </div>
              ) : error ? (
                <Alert color="danger">{error}</Alert>
              ) : orders.length === 0 ? (
                <Alert color="info">
                  You haven't placed any orders yet. <Button color="link" onClick={() => navigate('/custom-orders')}>Place your first order</Button>
                </Alert>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover bordered className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Cake Details</th>
                          <th>Delivery Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <span className="fw-bold">{order._id.substring(0, 8)}...</span>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              {order.cakeFlavor} {order.cakeShape} Cake
                              <div className="small text-muted">
                                Size: {
                                  order.cakeSize === '1' ? 'Small' :
                                  order.cakeSize === '2' ? 'Medium' :
                                  order.cakeSize === '3' ? 'Large' :
                                  'X-Large'
                                }
                              </div>
                            </td>
                            <td>{formatDate(order.deliveryDate)}</td>
                            <td className="fw-bold">Rs. {order.totalPrice.toFixed(2)}</td>
                            <td>
                              <Badge color={getStatusBadgeColor(order.status)} pill>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => handleViewOrder(order._id)}
                              >
                                <FaEye className="me-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                        </PaginationItem>
                        
                        {[...Array(totalPages).keys()].map(page => (
                          <PaginationItem key={page + 1} active={currentPage === page + 1}>
                            <PaginationLink onClick={() => handlePageChange(page + 1)}>
                              {page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                        </PaginationItem>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
