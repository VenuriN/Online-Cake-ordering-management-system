import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader
} from 'reactstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // Get email and OTP from location state if available
    if (location.state?.email && location.state?.otp) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email,
        otp: location.state.otp
      }));
    } else {
      // If there's no state, user might have navigated here directly
      // Redirect them back to the OTP verification
      navigate('/verify-otp');
    }
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post('http://localhost:4000/api/users/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      
      if (response.data.code === 200) {
        setSuccess(true);
        // Reset form
        setFormData({
          email: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setApiError(response.data.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setApiError(error.response?.data?.data?.message || 'An error occurred during password reset');
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
              <h2 className="mb-0">Reset Password</h2>
              <p className="mb-0">Create a new password</p>
            </CardHeader>
            <CardBody>
              {success ? (
                <div className="text-center py-4">
                  <div className="mb-4">
                    <i className="fas fa-check-circle fa-4x text-success"></i>
                  </div>
                  <h4 className="mb-3">Password Reset Successful!</h4>
                  <p className="mb-4">
                    Your password has been successfully reset. You will be redirected to the login page.
                  </p>
                  <Link to="/login" className="btn btn-primary">
                    Go to Login
                  </Link>
                </div>
              ) : (
                <>
                  {apiError && (
                    <Alert color="danger" className="mb-4">
                      {apiError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="newPassword">New Password</Label>
                      <Input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        placeholder="Enter your new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        invalid={!!errors.newPassword}
                      />
                      {errors.newPassword && (
                        <div className="text-danger">{errors.newPassword}</div>
                      )}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label for="confirmPassword">Confirm Password</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        invalid={!!errors.confirmPassword}
                      />
                      {errors.confirmPassword && (
                        <div className="text-danger">{errors.confirmPassword}</div>
                      )}
                    </FormGroup>
                    
                    <Button 
                      color="primary" 
                      block 
                      className="mt-4"
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : 'Reset Password'}
                    </Button>
                  </Form>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
