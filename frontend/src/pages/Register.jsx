import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
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
    setSuccess('');
    
    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      };
      
      const response = await axios.post('http://localhost:4000/api/users/register', registerData);
      
      if (response.data.code === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setApiError(response.data.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.response?.data?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow auth-card">
            <CardHeader className="text-center bg-primary text-white">
              <h2 className="mb-0">Create an Account</h2>
              <p className="mb-0">Join The Holy Spatula Cake Shop</p>
            </CardHeader>
            <CardBody>
              {apiError && (
                <Alert color="danger" className="mb-4">
                  {apiError}
                </Alert>
              )}
              
              {success && (
                <Alert color="success" className="mb-4">
                  {success}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="name">Full Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        invalid={!!errors.name}
                      />
                      {errors.name && <div className="text-danger">{errors.name}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        invalid={!!errors.phone}
                      />
                      {errors.phone && <div className="text-danger">{errors.phone}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="confirmPassword">Confirm Password</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        invalid={!!errors.confirmPassword}
                      />
                      {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                
                <Button 
                  color="primary" 
                  block 
                  className="mt-4 auth-button"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Create Account'}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p>
                  Already have an account? <Link to="/login" className="text-primary">Sign In</Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
