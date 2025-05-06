import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.otp) {
      setError('Email and OTP are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:4000/api/users/verify-otp', formData);
      
      if (response.data.code === 200) {
        // Navigate to reset password page with email and OTP
        navigate('/reset-password', { state: { email: formData.email, otp: formData.otp } });
      } else {
        setError(response.data.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.data?.message || 'Failed to verify OTP');
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
              <h2 className="mb-0">Verify OTP</h2>
              <p className="mb-0">Enter the verification code</p>
            </CardHeader>
            <CardBody>
              {error && <Alert color="danger">{error}</Alert>}
              
              <p className="mb-4">
                Please enter the OTP sent to your email address.
              </p>
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label for="otp">OTP Code</Label>
                  <Input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                </FormGroup>
                
                <Button 
                  color="primary" 
                  block 
                  className="mt-4"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Verify OTP'}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p>
                  Didn't receive the OTP? <Link to="/forgot-password" className="text-primary">Request again</Link>
                </p>
                <p>
                  <Link to="/login" className="text-secondary">
                    <i className="fas fa-arrow-left me-1"></i> Back to Login
                  </Link>
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;
