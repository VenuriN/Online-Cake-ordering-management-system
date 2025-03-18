import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge,
  Collapse,
  NavbarToggler,
  Container
} from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBell, FaSignOutAlt, FaCog, FaUser, FaTachometerAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <Navbar color="dark" dark expand="md" className="shadow-sm py-3" container={false}>
      <Container fluid>
        <NavbarBrand tag={Link} to="/admin/dashboard" className="d-flex align-items-center">
          <span className="h4 mb-0 me-2">🍰</span> 
          <div>
            <div className="fw-bold">Sweet Delights</div>
            <div className="small text-primary">Admin Portal</div>
          </div>
        </NavbarBrand>
        
        <NavbarToggler onClick={toggle} />
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/admin/dashboard">
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/orders">
                Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/products">
                Products
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/users">
                Users
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/admin/reports">
                Reports
              </NavLink>
            </NavItem>
          </Nav>
          
          <Nav className="ms-auto" navbar>
            <NavItem className="position-relative me-3 my-1 my-md-0">
              <Button color="link" className="text-light p-0">
                <FaBell size={20} />
                <Badge color="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  3
                </Badge>
              </Button>
            </NavItem>
            
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="d-flex align-items-center">
                <FaUserCircle size={20} className="me-2" />
                <span className="d-none d-md-inline">Admin</span>
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem header>Admin Account</DropdownItem>
                
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
