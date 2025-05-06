import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');
    
    if (admin) {
      navigate('/admin/dashboard');
    } else if (user) {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiError('');
    
    // Check if it's an admin login
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin1234') {
      // Create admin object
      const adminData = {
        _id: 'admin123',
        name: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      
      // Store admin in localStorage
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', formData);
      
      if (response.data.code === 200) {
        const userData = response.data.data.user;
        
        // Check if user is an admin
        if (userData.role === 'admin') {
          localStorage.setItem('admin', JSON.stringify(userData));
          navigate('/admin/dashboard');
        } else {
          // Store regular user in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/user/dashboard');
        }
      } else {
        setApiError(response.data.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.response?.data?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container mt-5 pt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow auth-card">
            <CardHeader className="text-center bg-primary text-white">
              <h2 className="mb-0">Welcome Back</h2>
              <p className="mb-0">Sign in to The Holy Spatula</p>
            </CardHeader>
            <CardBody>
              {apiError && (
                <Alert color="danger" className="mb-4">
                  {apiError}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    invalid={!!errors.email}
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </FormGroup>
                
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    invalid={!!errors.password}
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </FormGroup>
                
                <div className="text-end mb-3">
                  <Link to="/forgot-password" className="text-primary">
                    Forgot Password?
                  </Link>
                </div>
                
                <Button 
                  color="primary" 
                  block 
                  className="mt-4 auth-button"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Sign In'}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p>
                  Don't have an account? <Link to="/register" className="text-primary">Sign Up</Link>
                </p>
              </div>
              <div className="text-center mt-4">
                <p>
                  Are you a delivery person? <Link to="/delivery/login" className="text-primary">Login here</Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
