import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, CardFooter,
  Badge, Button, Spinner, Alert, Dropdown, DropdownToggle, DropdownMenu, 
  DropdownItem, Input, InputGroup, Pagination, PaginationItem, PaginationLink,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [orderStatuses] = useState(['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled']);
  
  // For status update modal
  const [statusModal, setStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Toggle dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
      }
      
      let url = `http://localhost:4000/api/v1/custom-order/admin/all`;
      
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
        
        // Initialize dropdown states
        const dropdownStates = {};
        response.data.data.forEach(order => {
          dropdownStates[order._id] = false;
        });
        setDropdownOpen(dropdownStates);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
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

  const toggleDropdown = (orderId) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId]
    }));
  };

  const openStatusModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setStatusNote('');
    setStatusModal(true);
  };

  const closeStatusModal = () => {
    setStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
    setStatusNote('');
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:4000/api/v1/custom-order/${selectedOrder._id}/status`,
        { status: newStatus, note: statusNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === selectedOrder._id 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        closeStatusModal();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
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
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container fluid className="flex-grow-1 py-4">
        <h2 className="mb-4">Custom Cake Orders Management</h2>
        
        {/* Filters and Search */}
        <Row className="mb-4">
          <Col md={4} className="mb-3 mb-md-0">
            <InputGroup>
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button color="primary" onClick={handleSearch}>
                Search
              </Button>
            </InputGroup>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <Input
              type="select"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Input>
          </Col>
          
          <Col md={5} className="d-flex">
            <Input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="me-2"
              placeholder="Start Date"
            />
            <Input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="me-2"
              placeholder="End Date"
            />
            <Button 
              color="secondary"
              onClick={() => {
                if (dateRange.startDate && dateRange.endDate) {
                  setCurrentPage(1);
                  fetchOrders();
                }
              }}
            >
              Filter
            </Button>
          </Col>
        </Row>
        
        {/* Orders Display */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <p className="mt-3">Loading orders...</p>
          </div>
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : orders.length === 0 ? (
          <Alert color="info">No orders found.</Alert>
        ) : (
          <>
            <Row>
              {orders.map(order => (
                <Col lg={12} md={6} className="mb-4" key={order._id}>
                  <Card className="h-100 shadow hover-shadow">
                    <CardHeader className={`bg-${getStatusBadgeColor(order.status)} bg-opacity-10 d-flex justify-content-between align-items-center p-3`}>
                      <h5 className="mb-0 fw-bold">Order #{order._id.substr(0, 8)}</h5>
                      <Badge color={getStatusBadgeColor(order.status)} pill className="px-3 py-2">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </CardHeader>
                    
                    <CardBody className="p-4">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="customer-info p-3 bg-light rounded">
                            <h6 className="text-primary mb-3">Customer Information</h6>
                            <p className="mb-3">
                              <strong>Name:</strong> {order.name}<br />
                              <strong>Email:</strong> {order.email}<br />
                              <strong>Phone:</strong> {order.phone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="col-md-6 mb-4">
                          <div className="cake-details p-3 bg-light rounded">
                            <h6 className="text-primary mb-3">Cake Details</h6>
                            <p className="mb-3">
                              <strong>Size:</strong> {
                                order.cakeSize === '1' ? 'Small (1-10 people)' :
                                order.cakeSize === '2' ? 'Medium (11-25 people)' :
                                order.cakeSize === '3' ? 'Large (26-50 people)' :
                                'X-Large (50+ people)'
                              }<br />
                              <strong>Shape:</strong> {order.cakeShape.charAt(0).toUpperCase() + order.cakeShape.slice(1)}<br />
                              <strong>Flavor:</strong> {order.cakeFlavor}<br />
                              <strong>Frosting:</strong> {order.frosting}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-4 mb-md-0">
                          <div className="order-details p-3 bg-light rounded">
                            <h6 className="text-primary mb-3">Order Details</h6>
                            <p className="mb-0">
                              <strong>Created:</strong> {formatDate(order.createdAt)}<br />
                              <strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}<br />
                              <strong>Delivery Address:</strong> {order.deliveryAddress}, {order.city}
                            </p>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="price-details p-3 bg-light rounded">
                            <h6 className="text-primary mb-3">Price Details</h6>
                            <p className="mb-0">
                              <strong>Base Price:</strong> Rs. {order.basePrice.toFixed(2)}<br />
                              <strong>Add-ons:</strong> Rs. {order.addonsPrice.toFixed(2)}<br />
                              <strong>Delivery Fee:</strong> Rs. {order.deliveryFee.toFixed(2)}<br />
                              <strong>Total:</strong> <span className="text-primary fw-bold fs-5">Rs. {order.totalPrice.toFixed(2)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    
                    <CardFooter className="bg-white d-flex justify-content-between align-items-center p-3">
                      <Button color="info" className="px-4 py-2" onClick={() => navigate(`/order-tracking/${order._id}`)}>
                        View Details
                      </Button>
                      
                      <Dropdown isOpen={dropdownOpen[order._id]} toggle={() => toggleDropdown(order._id)}>
                        <DropdownToggle caret color="primary" className="px-4 py-2">
                          Update Status
                        </DropdownToggle>
                        <DropdownMenu end>
                          {orderStatuses.map(status => (
                            <DropdownItem 
                              key={status} 
                              onClick={() => openStatusModal(order, status)}
                              disabled={order.status === status}
                              className={order.status === status ? 'active' : ''}
                            >
                              <Badge color={getStatusBadgeColor(status)} pill className="me-2">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </CardFooter>
                  </Card>
                </Col>
              ))}
            </Row>

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
        
        {/* Status Update Modal */}
        <Modal isOpen={statusModal} toggle={closeStatusModal}>
          <ModalHeader toggle={closeStatusModal}>
            Update Order Status
          </ModalHeader>
          <ModalBody>
            {selectedOrder && (
              <Form>
                <FormGroup>
                  <Label for="newStatus">New Status</Label>
                  <Input
                    type="select"
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                
                <FormGroup>
                  <Label for="statusNote">Status Note (Optional)</Label>
                  <Input
                    type="textarea"
                    id="statusNote"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    rows={3}
                  />
                </FormGroup>
                
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <strong>Current Status: </strong>
                    <Badge color={getStatusBadgeColor(selectedOrder.status)} className="ms-1">
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <strong>New Status: </strong>
                    {newStatus && (
                      <Badge color={getStatusBadgeColor(newStatus)} className="ms-1">
                        {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </Form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={closeStatusModal}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onClick={updateOrderStatus} 
              disabled={!newStatus || updatingStatus}
            >
              {updatingStatus ? (
                <>
                  <Spinner size="sm" className="me-2" /> Updating...
                </>
              ) : 'Update Status'}
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </div>
  );
};

export default CustomOrders;