import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, FormGroup, 
  Label, Input, Button, Alert, InputGroup, InputGroupText,
  Spinner, Progress
} from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, 
  FaPhone, FaCheckCircle, FaCookieBite
} from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationStep, setRegistrationStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Password strength criteria
  const passwordCriteria = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'At least one uppercase letter' },
    { regex: /[a-z]/, text: 'At least one lowercase letter' },
    { regex: /[0-9]/, text: 'At least one number' },
    { regex: /[^A-Za-z0-9]/, text: 'At least one special character' }
  ];
  
  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    passwordCriteria.forEach(criteria => {
      if (criteria.regex.test(password)) {
        strength += 20;
      }
    });
    setPasswordStrength(strength);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // First step validation
    if (registrationStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    }
    
    // Second step validation
    if (registrationStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength < 80) {
        newErrors.password = 'Password is not strong enough';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (registrationStep === 1) {
        setRegistrationStep(2);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await axios.post('http://localhost:4000/api/v1/auth/register', formData);
        console.log('Registration successful:', response.data);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } catch (error) {
        setErrors({
          submit: error.response?.data?.message || 'Registration failed. Please try again.'
        });
        console.log('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <Container className="py-5 my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
          >
            <Card className="border-0 shadow-lg rounded-3">
              <div className="bg-primary text-white text-center py-4">
                <FaCookieBite size={50} className="mb-3" />
                <h2 className="fw-bold">Create Account</h2>
                <p className="mb-0">Join the Sweet Delights family</p>
              </div>
              
              <CardBody className="p-4 p-md-5">
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Registration Progress</span>
                    <span>{registrationStep === 1 ? '50%' : '100%'}</span>
                  </div>
                  <Progress
                    value={registrationStep === 1 ? 50 : 100}
                    className="rounded-pill"
                    style={{ height: '8px' }}
                  />
                </div>
                
                {/* Error message */}
                {errors.submit && (
                  <Alert color="danger" className="mb-4">
                    {errors.submit}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  {registrationStep === 1 ? (
                    // Step 1: Personal Information
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Row>
                        <Col md={6}>
                          <FormGroup floating>
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder="First Name"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              invalid={!!errors.firstName}
                            />
                            <Label for="firstName">
                              <FaUser className="me-2" /> First Name
                            </Label>
                            {errors.firstName && (
                              <div className="text-danger small mt-1">
                                {errors.firstName}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        
                        <Col md={6}>
                          <FormGroup floating>
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder="Last Name"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              invalid={!!errors.lastName}
                            />
                            <Label for="lastName">
                              <FaUser className="me-2" /> Last Name
                            </Label>
                            {errors.lastName && (
                              <div className="text-danger small mt-1">
                                {errors.lastName}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      
                      <FormGroup floating>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          invalid={!!errors.email}
                        />
                        <Label for="email">
                          <FaEnvelope className="me-2" /> Email Address
                        </Label>
                        {errors.email && (
                          <div className="text-danger small mt-1">
                            {errors.email}
                          </div>
                        )}
                      </FormGroup>
                      
                      <FormGroup floating>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          invalid={!!errors.phone}
                        />
                        <Label for="phone">
                          <FaPhone className="me-2" /> Phone Number
                        </Label>
                        {errors.phone && (
                          <div className="text-danger small mt-1">
                            {errors.phone}
                          </div>
                        )}
                      </FormGroup>
                    </motion.div>
                  ) : (
                    // Step 2: Password Setup
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FormGroup floating>
                        <InputGroup>
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            invalid={!!errors.password}
                          />
                          <InputGroupText 
                            className="bg-transparent cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: 'pointer' }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                        </InputGroup>
                        {errors.password && (
                          <div className="text-danger small mt-1">
                            {errors.password}
                          </div>
                        )}
                      </FormGroup>
                      
                      {/* Password strength indicator */}
                      <div className="mb-4">
                        <h6 className="mb-2">Password Strength:</h6>
                        <Progress 
                          value={passwordStrength} 
                          className="rounded-pill mb-2"
                          style={{ height: '8px' }}
                          color={
                            passwordStrength < 40 ? 'danger' :
                            passwordStrength < 80 ? 'warning' : 'success'
                          }
                        />
                        <div className="small">
                          {passwordCriteria.map((criteria, index) => (
                            <div 
                              key={index}
                              className={`d-flex align-items-center ${
                                criteria.regex.test(formData.password) 
                                  ? 'text-success' 
                                  : 'text-muted'
                              }`}
                            >
                              <FaCheckCircle 
                                className="me-2" 
                                size={12}
                              />
                              {criteria.text}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <FormGroup floating>
                        <InputGroup>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            invalid={!!errors.confirmPassword}
                          />
                          <InputGroupText 
                            className="bg-transparent cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ cursor: 'pointer' }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroupText>
                        </InputGroup>
                        {errors.confirmPassword && (
                          <div className="text-danger small mt-1">
                            {errors.confirmPassword}
                          </div>
                        )}
                      </FormGroup>
                    </motion.div>
                  )}
                  
                  <div className="d-flex justify-content-between mt-4">
                    {registrationStep === 2 && (
                      <Button
                        color="light"
                        onClick={() => setRegistrationStep(1)}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      color="primary"
                      size="lg"
                      className="rounded-pill px-4 ms-auto"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : registrationStep === 1 ? (
                        'Next'
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </div>
                </Form>
                
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-primary text-decoration-none fw-bold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardBody>
            </Card>
            
            <div className="text-center mt-4">
              <p className="text-muted small mb-0">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
              </p>
            </div>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
