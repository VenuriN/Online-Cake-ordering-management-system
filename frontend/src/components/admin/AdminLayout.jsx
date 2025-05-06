import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Button,
  Container,
  Spinner
} from 'reactstrap';
import { FaHome, FaShoppingBag, FaUsers, FaList, FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    
    if (!adminData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      localStorage.removeItem('admin');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Navbar color="dark" dark expand="md" className="mb-4">
        <Container fluid>
          <NavbarBrand tag={Link} to="/admin/dashboard">
            The Holy Spatula Admin
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/admin/dashboard">
                  <FaHome className="me-1" /> Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/admin/orders">
                  <FaShoppingBag className="me-1" /> Orders
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/admin/categories">
                  <FaList className="me-1" /> Categories
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/admin/addons">
                  <FaPlusCircle className="me-1" /> Addons
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/admin/users">
                  <FaUsers className="me-1" /> Users
                </NavLink>
              </NavItem>
            </Nav>
            <Nav navbar>
              <NavItem>
                <span className="navbar-text me-3">
                  Welcome, {admin?.name || 'Admin'}
                </span>
              </NavItem>
              <NavItem>
                <Button color="danger" size="sm" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-light text-center py-3 mt-5">
        <Container>
          <p className="mb-0">© {new Date().getFullYear()} The Holy Spatula Admin Panel</p>
        </Container>
      </footer>
    </div>
  );
};

export default AdminLayout;
