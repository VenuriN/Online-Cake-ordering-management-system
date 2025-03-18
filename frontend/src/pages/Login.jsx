import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, FormGroup, 
  Label, Input, Button, Alert, InputGroup, InputGroupText,
  Spinner
} from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaLock, FaEnvelope, FaEye, FaEyeSlash, 
  FaFacebook, FaGoogle, FaApple, FaCookieBite
} from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FallingSweets from '../components/FallingSweets';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check for admin credentials
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin1234') {
      localStorage.setItem('user', JSON.stringify({ email: formData.email, role: 'admin' }));
      window.location.href = '/admin/dashboard';
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

      }

      // Save token to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('token', data.token);
      }      
      
      // Redirect to previous page or home
      const from = location.state?.from?.pathname || '/';
      window.location.href = from;
      
    } catch (err) {
      // Handle login error
      setError(err.message || 'Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="login-page">
      <FallingSweets count={8} speed={0.5} />
      
      <Container className="py-5 my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <motion.div
              initial={fadeIn.initial}
              animate={fadeIn.animate}
              transition={fadeIn.transition}
            >
              <Card className="border-0 shadow-lg rounded-3 overflow-hidden">
                <div className="bg-primary text-white text-center py-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <FaCookieBite size={50} className="mb-3" />
                    <h2 className="fw-bold">Welcome Back!</h2>
                    <p className="mb-0">Sign in to your Sweet Delights account</p>
                  </motion.div>
                </div>
                
                <CardBody className="p-4 p-md-5">
                  {error && (
                    <Alert color="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <FormGroup floating>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        autoFocus
                      />
                      <Label for="email">
                        <FaEnvelope className="me-2" /> Email Address
                      </Label>
                    </FormGroup>
                    
                    <FormGroup floating>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          aria-label="Password"
                          autoComplete="current-password"
                        />
                        <Label for="password">
                          <FaLock className="me-2" /> Password
                        </Label>
                    </FormGroup>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <FormGroup check>
                        <Input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <Label check for="rememberMe">
                          Remember me
                        </Label>
                      </FormGroup>
                      
                      <Link 
                        to="/forgot-password" 
                        className="text-primary text-decoration-none"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    
                    <Button
                      color="primary"
                      size="lg"
                      block
                      className="mb-4 rounded-pill"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </Form>
                  
                  <div className="text-center mb-4">
                    <p className="text-muted mb-0">Don't have an account?</p>
                    <Link 
                      to="/register" 
                      className="fw-bold text-primary text-decoration-none"
                    >
                      Create an Account
                    </Link>
                  </div>
                </CardBody>
              </Card>
              
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                </p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;