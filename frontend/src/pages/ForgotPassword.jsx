import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:4000/api/users/request-password-reset', { email });
      
      if (response.data.code === 200) {
        setEmailSent(true);
      } else {
        setError(response.data.data.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setError(error.response?.data?.data?.message || 'An error occurred. Please try again.');
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
              <h2 className="mb-0">Forgot Password</h2>
              <p className="mb-0">Reset your password</p>
            </CardHeader>
            <CardBody>
              {emailSent ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="fas fa-envelope-open-text fa-4x text-success"></i>
                  </div>
                  <h4 className="mb-3">Email Sent!</h4>
                  <p className="mb-4">
                    We've sent a password reset OTP to <strong>{email}</strong>. 
                    Please check your email and follow the instructions.
                  </p>
                  <div className="d-flex justify-content-between mt-4">
                    <Link to="/login" className="btn btn-outline-secondary">
                      Back to Login
                    </Link>
                    <Link to="/verify-otp" className="btn btn-primary">
                      Enter OTP
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {error && <Alert color="danger">{error}</Alert>}
                  
                  <p className="mb-4">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                  
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="email">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </FormGroup>
                    
                    <Button 
                      color="primary" 
                      block 
                      className="mt-4"
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : 'Send Reset OTP'}
                    </Button>
                  </Form>
                  
                  <div className="text-center mt-4">
                    <p>
                      Remember your password? <Link to="/login" className="text-primary">Sign In</Link>
                    </p>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
