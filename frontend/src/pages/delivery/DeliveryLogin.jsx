import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeliveryLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    nic: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if delivery person is already logged in
    const deliveryPerson = localStorage.getItem('deliveryPerson');
    if (deliveryPerson) {
      navigate('/delivery/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.nic) {
      newErrors.nic = 'NIC is required';
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
    
    try {
      const response = await axios.post('http://localhost:4000/api/delivery-persons/login', formData);
      
      if (response.data.code === 200) {
        // Store delivery person in localStorage
        localStorage.setItem('deliveryPerson', JSON.stringify(response.data.data.deliveryPerson));
        navigate('/delivery/dashboard');
      } else {
        setApiError(response.data.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.response?.data?.data?.message || 'Invalid email or NIC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container mt- pt-5">
      <Row className="justify-content-center mt-5">
        <Col md={6} lg={5}>
          <Card className="shadow auth-card">
            <CardHeader className="text-center bg-primary text-white">
              <h2 className="mb-0">Delivery Staff Login</h2>
              <p className="mb-0">The Holy Spatula - Delivery Portal</p>
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
                  <Label for="nic">NIC Number</Label>
                  <Input
                    type="text"
                    name="nic"
                    id="nic"
                    placeholder="Enter your NIC number"
                    value={formData.nic}
                    onChange={handleChange}
                    invalid={!!errors.nic}
                  />
                  {errors.nic && <div className="text-danger">{errors.nic}</div>}
                </FormGroup>
                
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
                  <small className="text-muted">
                    For delivery staff only. If you're a customer, please <a href="/login">login here</a>.
                  </small>
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DeliveryLogin;
