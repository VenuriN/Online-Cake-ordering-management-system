import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaCog, FaUser, FaTachometerAlt, FaExclamationTriangle, FaBoxes, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Collapse, NavbarToggler, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Container, Badge } from 'reactstrap';
import { toast } from 'react-toastify';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch low stock and expiring items on component mount
  useEffect(() => {
    fetchAlerts();
    
    // Set up interval to check for alerts every 3 seconds
    const interval = setInterval(fetchAlerts,  3000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch low stock items
      const lowStockResponse = await axios.get('http://localhost:4000/api/v1/inventory/low-stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (lowStockResponse.data.success) {
        setLowStockItems(lowStockResponse.data.data);
      }
      
      // Fetch soon to expire items
      const expiringResponse = await axios.get('http://localhost:4000/api/v1/inventory/soon-to-expire', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (expiringResponse.data.success) {
        setExpiringItems(expiringResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to fetch inventory alerts');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => setIsOpen(!isOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('admin');
    
    // Navigate to login page
    navigate('/login');
  };

  const handleAlertClick = (itemId, alertType) => {
    // Navigate to inventory page with filter for specific alert type
    navigate('/admin/inventory', { 
      state: { 
        activeTab: alertType === 'lowStock' ? '2' : '3', // '2' for low stock, '3' for expiring
        highlightItem: itemId // Optional: to highlight the specific item
      } 
    });
    
    // Close the notifications dropdown
    setNotificationsOpen(false);
  };
  
  // Get total number of alerts
  const totalAlerts = lowStockItems.length + expiringItems.length;
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Navbar color="dark" dark expand="md" className="shadow-sm py-3" container={false}>
      <Container fluid>
        <NavbarBrand tag={Link} to="/admin/dashboard" className="d-flex align-items-center">
          <span className="h4 mb-0 me-2">🍰</span> 
          <div>
            <div className="fw-bold">HOLY SPATULA</div>
            <div className="small text-primary">Admin Portal</div>
          </div>
        </NavbarBrand>
        
        <NavbarToggler onClick={toggle} />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/admin/dashboard">
                <FaTachometerAlt className="me-1" /> Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/orders">
                Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/inventory">
                Inventory
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/users">
                Users
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/inquiries">
                Inquiries
              </NavLink>
            </NavItem>
          </Nav>
          
          <Nav className="ms-auto" navbar>
            <UncontrolledDropdown nav inNavbar className="me-3 my-1 my-md-0">
              <DropdownToggle nav className="text-light p-0 position-relative">
                <FaBell size={20} />
                {totalAlerts > 0 && (
                  <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {totalAlerts}
                  </Badge>
                )}
              </DropdownToggle>
              <DropdownMenu end className="dropdown-menu-lg shadow-lg py-0">
                <div className="p-3 border-bottom">
                  <h6 className="mb-0">Inventory Alerts</h6>
                </div>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {totalAlerts === 0 ? (
                    <div className="p-3 text-center text-muted">
                      <FaBoxes className="mb-2" size={20} />
                      <p className="mb-0">No inventory alerts</p>
                    </div>
                  ) : (
                    <>
                      {/* Low Stock Alerts */}
                      {lowStockItems.length > 0 && (
                        <div className="p-2 bg-light border-bottom">
                          <small className="text-uppercase text-muted fw-bold">Low Stock Items</small>
                        </div>
                      )}
                      {lowStockItems.map(item => (
                        <DropdownItem 
                          key={`stock-${item._id}`}
                          onClick={() => handleAlertClick(item._id, 'lowStock')}
                          className="p-3 border-bottom"
                        >
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div className="bg-warning text-white rounded-circle p-2">
                                <FaExclamationTriangle />
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-0">{item.name}</h6>
                              <div className="small text-muted">
                                {item.quantity} {item.unit} remaining (Min: {item.minStockLevel})
                              </div>
                            </div>
                          </div>
                        </DropdownItem>
                      ))}
                      
                      {/* Expiring Items Alerts */}
                      {expiringItems.length > 0 && (
                        <div className="p-2 bg-light border-bottom">
                          <small className="text-uppercase text-muted fw-bold">Expiring Soon</small>
                        </div>
                      )}
                      {expiringItems.map(item => {
                        const daysLeft = getDaysUntilExpiry(item.expiryDate);
                        return (
                          <DropdownItem 
                            key={`expiry-${item._id}`}
                            onClick={() => handleAlertClick(item._id, 'expiring')}
                            className="p-3 border-bottom"
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div className={`bg-${daysLeft <= 3 ? 'danger' : 'info'} text-white rounded-circle p-2`}>
                                  <FaClock />
                                </div>
                              </div>
                              <div>
                                <h6 className="mb-0">{item.name}</h6>
                                <div className="small text-muted">
                                  Expires on {formatDate(item.expiryDate)} ({daysLeft} days left)
                                </div>
                              </div>
                            </div>
                          </DropdownItem>
                        );
                      })}
                    </>
                  )}
                </div>
                
                {totalAlerts > 0 && (
                  <div className="p-2 border-top">
                    <div className="d-flex justify-content-between">
                      {lowStockItems.length > 0 && (
                        <Button 
                          color="link" 
                          size="sm" 
                          className="text-warning w-100 me-1"
                          onClick={() => navigate('/admin/inventory', { state: { activeTab: '2' } })}
                        >
                          View Low Stock
                        </Button>
                      )}
                      {expiringItems.length > 0 && (
                        <Button 
                          color="link" 
                          size="sm" 
                          className="text-info w-100 ms-1"
                          onClick={() => navigate('/admin/inventory', { state: { activeTab: '3' } })}
                        >
                          View Expiring Items
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
            
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="d-flex align-items-center">
                <FaUserCircle size={20} className="me-2" />
                <span className="d-none d-md-inline">Admin</span>
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem header>Admin Account</DropdownItem>
                <DropdownItem tag={Link} to="/admin/dashboard">
                  <FaUser className="me-2" /> Profile
                </DropdownItem>
                <DropdownItem tag={Link} to="/admin/settings">
                  <FaCog className="me-2" /> Settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
