import React, { useState, useEffect } from 'react';
import { 
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavbarText,
  NavItem,
  NavLink,
  Nav,
  Container,
  Button,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { 
  FaBirthdayCake, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaCog, 
  FaUserPlus, 
  FaSignInAlt, 
  FaShoppingCart 
} from 'react-icons/fa';
import { GiCupcake } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  useEffect(() => {
    const checkUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    // Initial check
    checkUserData();

    // Set up interval for real-time checks
    const interval = setInterval(checkUserData, 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
      clearInterval(interval);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar
        expand="lg"
        fixed="top"
        className={`py-3 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent backdrop-blur-md'}`}
        style={{ transition: 'all 0.3s ease-in-out' }}
      >
        <Container fluid="xl" className="d-flex align-items-center justify-content-between">
          <NavbarBrand tag={Link} to="/" className="d-flex align-items-center flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <GiCupcake size={35} className="me-2 text-primary" />
            </motion.div>
            <span className="brand-text">Holy Spatula</span>
          </NavbarBrand>
          
          <NavbarToggler onClick={toggle} className="border-0 shadow-none custom-toggler" />
          <Collapse isOpen={isOpen} navbar className="nav-collapse">
            <Nav className="mx-auto" navbar>
              {['Home', 'Menu', 'Custom Orders', 'About Us', 'Contact'].map((item) => (
                <NavItem key={item} className="d-inline-block mx-1">
                  <NavLink
                    tag={Link}
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="nav-link mx-2 position-relative"
                  >
                    <motion.span
                      whileHover={{ y: -3 }}
                      className="d-inline-block"
                    >
                      {item}
                    </motion.span>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
            
            <Nav className="ms-auto d-flex flex-row align-items-center gap-3" navbar>
             
              {user ? (
                <UncontrolledDropdown>
                  <DropdownToggle
                    tag="div"
                    className="d-flex align-items-center user-dropdown"
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-primary rounded-circle p-2 text-white user-avatar d-flex align-items-center justify-content-center shadow-sm"
                    >
                    </motion.div>
                    <span className="ms-2 d-none d-sm-inline fw-medium">{user.name}</span>
                  </DropdownToggle>
                  
                  <DropdownMenu end className="mt-2 border-0 shadow-lg rounded-4" style={{ minWidth: '180px' }}>
                    <DropdownItem header className="border-bottom">
                      <div className="text-center py-3">
                        <div className="fw-bold mb-1">{`${user.email}`}</div>
                      </div>
                    </DropdownItem>
                    
                    <div className="py-2">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="dropdown-item-wrapper"
                      >
                        <DropdownItem tag={Link} to="/user/dashboard" className="py-2 px-4">
                          <FaUserCircle className="me-2 text-primary" size={18} />
                          <span>Profile</span>
                        </DropdownItem>
                      </motion.div>
                    </div>
                    
                    <DropdownItem divider className="my-2" />
                    
                    <div className="py-2">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="dropdown-item-wrapper"
                      >
                        <DropdownItem onClick={handleLogout} className="py-2 px-4 text-danger">
                          <FaSignOutAlt className="me-2" size={18} />
                          <span>Logout</span>
                        </DropdownItem>
                      </motion.div>
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      color="outline-primary" 
                      size="sm"
                      className="px-3 py-2 rounded-pill fw-medium"
                      tag={Link}
                      to="/login"
                    >
                      <FaSignInAlt className="me-2" size={16} /> Sign In
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      color="primary" 
                      size="sm"
                      className="px-3 py-2 rounded-pill fw-medium"
                      tag={Link}
                      to="/register"
                    >
                      <FaUserPlus className="me-2" size={16} /> Sign Up
                    </Button>
                  </motion.div>
                </div>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <style jsx>{`
        .user-avatar {
          width: 40px;
          height: 40px;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }
        
      `}</style>
    </motion.div>
  );
};

export default Header;