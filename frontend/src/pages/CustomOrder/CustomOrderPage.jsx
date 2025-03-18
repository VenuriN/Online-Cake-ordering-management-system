import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardBody, CardHeader, Form, FormGroup,
  Label, Input, Button, Alert, Badge, Spinner, ListGroup, ListGroupItem,
  InputGroup, InputGroupText, CardFooter, Modal, ModalHeader, ModalBody,
  FormFeedback, FormText
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { FaCheckCircle, FaCreditCard, FaMoneyBillAlt, FaUpload } from 'react-icons/fa';

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);

  const [user, setUser] = useState('');

  // Calculate minimum delivery date (3 days from today)
  const getMinDeliveryDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    return minDate.toISOString().split('T')[0];
  };
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    cakeSize: '1',
    cakeFlavor: '',
    cakeShape: 'round',
    frosting: '',
    toppings: [],
    specialInstructions: '',
    name: '',
    email: '',
    phone: '',
    deliveryDate: '',
    deliveryAddress: '',
    city: null,
    paymentMethod: 'cash',
    bankSlip: null,
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  // Pricing data
  const [priceDetails, setPriceDetails] = useState({
    basePrice: 0,
    addonsPrice: 0,
    deliveryFee: 0,
    totalPrice: 0
  });
  
  // Available options
  const [options, setOptions] = useState({
    cakeFlavors: [],
    frostings: [],
    toppings: [],
    cities: []
  });

// Check if user is logged in and redirect if not
useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/custom-order' } });
    } else {
      fetchUserData();
    }
  }, []);

  
  // Update form fields when user data changes
  useEffect(() => {
    if (user) {
      setOrderForm(prevForm => ({
        ...prevForm,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user]);
  // Fetch logged in user's data
  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { data } = response.data;
      setUser(data); // Set user data
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is invalid or expired, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login', { state: { from: '/custom-order' } });
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch options and initial pricing data
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/custom-order/options');
        if (response.data.success) {
          setOptions(response.data.data);
        }
      } catch (error) {
        setError('Failed to load custom order options');
      }
    };
    
    fetchOptions();
    
    // Set default base price
    updatePriceCalculation({ cakeSize: '1' });
  }, []);

  // Calculate price whenever order form changes
  useEffect(() => {
    updatePriceCalculation(orderForm);
  }, [orderForm.cakeSize, orderForm.toppings, orderForm.city]);

  const updatePriceCalculation = async (formData) => {
    if (!formData.cakeSize) return;
    
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/custom-order/calculate-price',
        formData
      );
      
      if (response.data.success) {
        setPriceDetails(response.data.data);
      }
    } catch (error) {
      console.error('Price calculation error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
    
    // Clear validation error when the user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleToppingToggle = (toppingValue) => {
    const currentToppings = [...orderForm.toppings];
    const index = currentToppings.indexOf(toppingValue);
    
    if (index >= 0) {
      currentToppings.splice(index, 1);
    } else {
      currentToppings.push(toppingValue);
    }
    
    setOrderForm({ ...orderForm, toppings: currentToppings });
  };
  
  const handleCityChange = (selectedOption) => {
    setOrderForm({ ...orderForm, city: selectedOption });
    if (formErrors.city) {
      setFormErrors({ ...formErrors, city: null });
    }
  };
  
  const handleFileChange = (e) => {
    setOrderForm({ ...orderForm, bankSlip: e.target.files[0] });
    if (formErrors.bankSlip) {
      setFormErrors({ ...formErrors, bankSlip: null });
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Cake details validation
    if (!orderForm.cakeFlavor) {
      errors.cakeFlavor = 'Please select a cake flavor';
      isValid = false;
    }
    
    if (!orderForm.frosting) {
      errors.frosting = 'Please select a frosting type';
      isValid = false;
    }
    
    // Customer details validation
    if (!orderForm.name) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!orderForm.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(orderForm.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!orderForm.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(orderForm.phone.replace(/[^\d]/g, ''))) {
      errors.phone = 'Phone number should have 10 digits';
      isValid = false;
    }
    
    // Delivery validation
    if (!orderForm.deliveryDate) {
      errors.deliveryDate = 'Delivery date is required';
      isValid = false;
    } else {
      const selectedDate = new Date(orderForm.deliveryDate);
      const minDate = new Date(getMinDeliveryDate());
      
      if (selectedDate < minDate) {
        errors.deliveryDate = 'Delivery date must be at least 3 days from today';
        isValid = false;
      }
    }
    
    if (!orderForm.city) {
      errors.city = 'Please select a delivery area';
      isValid = false;
    }
    
    if (!orderForm.deliveryAddress) {
      errors.deliveryAddress = 'Delivery address is required';
      isValid = false;
    }
    
    // Payment validation
    if (orderForm.paymentMethod === 'cash' && !orderForm.bankSlip) {
      errors.bankSlip = 'Please upload bank slip';
      isValid = false;
    }
    
    if (orderForm.paymentMethod === 'card') {
      if (!orderForm.cardNumber || orderForm.cardNumber.replace(/\s/g, '').length !== 16) {
        errors.cardNumber = 'Valid card number is required';
        isValid = false;
      }
      
      if (!orderForm.cardName) {
        errors.cardName = 'Name on card is required';
        isValid = false;
      }
      
      if (!orderForm.cardExpiry || !/^\d{2}\/\d{2}$/.test(orderForm.cardExpiry)) {
        errors.cardExpiry = 'Valid expiry date (MM/YY) is required';
        isValid = false;
      }
      
      if (!orderForm.cardCvv || !/^\d{3,4}$/.test(orderForm.cardCvv)) {
        errors.cardCvv = 'Valid CVV is required';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setValidated(true);
      window.scrollTo(0, 0);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/custom-order' } });
        return;
      }
      
      // Create form data object for file upload
      const formData = new FormData();
      
      // Append all order form data
      Object.keys(orderForm).forEach(key => {
        if (key === 'city') {
          formData.append(key, orderForm[key]?.value || '');
        } else if (key === 'toppings') {
          formData.append(key, JSON.stringify(orderForm[key]));
        } else if (key === 'bankSlip' && orderForm[key]) {
          formData.append(key, orderForm[key]);
        } else if (key !== 'bankSlip') {
          formData.append(key, orderForm[key]);
        }
      });
      
      // Add total price
      formData.append('totalPrice', priceDetails.totalPrice);
      
      const response = await axios.post(
        'http://localhost:4000/api/v1/custom-order/create',
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        setSuccess('Your custom order has been placed successfully!');
        setTimeout(() => {
          navigate(`/order-tracking/${response.data.data.orderId}`);
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place your order');
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <CardHeader className="bg-primary text-white">
              <h3 className="mb-0">Create Your Dream Cake</h3>
              <p className="mb-0">Customize every detail for your special occasion</p>
            </CardHeader>
            
            <CardBody>
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit} noValidate validated={validated.toString()}>
                <h5 className="border-bottom pb-2 mb-4">Cake Details</h5>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="cakeSize">Cake Size (Number of people)</Label>
                      <Input 
                        type="select" 
                        name="cakeSize" 
                        id="cakeSize"
                        value={orderForm.cakeSize}
                        onChange={handleInputChange}
                      >
                        <option value="1">Small (1-10 people)</option>
                        <option value="2">Medium (11-25 people)</option>
                        <option value="3">Large (26-50 people)</option>
                        <option value="4">X-Large (50+ people)</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  
                  <Col md={6}>
                    <FormGroup>
                      <Label for="cakeShape">Cake Shape</Label>
                      <Input 
                        type="select" 
                        name="cakeShape" 
                        id="cakeShape"
                        value={orderForm.cakeShape}
                        onChange={handleInputChange}
                      >
                        <option value="round">Round</option>
                        <option value="square">Square</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="heart">Heart</option>
                        <option value="custom">Custom Shape</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="cakeFlavor">Cake Flavor</Label>
                      <Input 
                        type="select" 
                        name="cakeFlavor" 
                        id="cakeFlavor"
                        value={orderForm.cakeFlavor}
                        onChange={handleInputChange}
                        invalid={!!formErrors.cakeFlavor}
                      >
                        <option value="">Select flavor...</option>
                        {options.cakeFlavors.map((flavor, index) => (
                          <option key={index} value={flavor.value}>
                            {flavor.label}
                          </option>
                        ))}
                      </Input>
                      <FormFeedback>{formErrors.cakeFlavor}</FormFeedback>
                    </FormGroup>
                  </Col>
                  
                  <Col md={6}>
                    <FormGroup>
                      <Label for="frosting">Frosting Type</Label>
                      <Input 
                        type="select" 
                        name="frosting" 
                        id="frosting"
                        value={orderForm.frosting}
                        onChange={handleInputChange}
                        invalid={!!formErrors.frosting}
                      >
                        <option value="">Select frosting...</option>
                        {options.frostings.map((frosting, index) => (
                          <option key={index} value={frosting.value}>
                            {frosting.label}
                          </option>
                        ))}
                      </Input>
                      <FormFeedback>{formErrors.frosting}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                
                <FormGroup>
                  <Label className="d-block">Toppings (Select all that apply)</Label>
                  <div className="d-flex flex-wrap">
                    {options.toppings.map((topping, index) => (
                      <div key={index} className="custom-control custom-checkbox custom-control-inline mb-2 mr-4">
                        <input
                          type="checkbox"
                          id={`topping-${topping.value}`}
                          className="custom-control-input"
                          checked={orderForm.toppings.includes(topping.value)}
                          onChange={() => handleToppingToggle(topping.value)}
                        />
                        <label className="custom-control-label" htmlFor={`topping-${topping.value}`}>
                          {topping.label} <Badge color="info">+Rs.{topping.price}</Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label for="specialInstructions">Special Instructions</Label>
                  <Input 
                    type="textarea" 
                    name="specialInstructions" 
                    id="specialInstructions"
                    rows="3"
                    value={orderForm.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special requests, allergies, or decorations..."
                  />
                </FormGroup>
                
                <h5 className="border-bottom pb-2 mb-4 mt-5">Delivery Information</h5>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Full Name</Label>
                      <Input 
                        type="text" 
                        name="name" 
                        id="name"
                        value={user.firstName}
                        onChange={handleInputChange}
                        invalid={!!formErrors.name}
                        required
                        disabled
                      />
                      <FormFeedback>{formErrors.name}</FormFeedback>
                    </FormGroup>
                  </Col>
                  
                  <Col md={6}>
                    <FormGroup>
                      <Label for="phone">Phone Number</Label>
                      <Input 
                        type="tel" 
                        name="phone" 
                        id="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        invalid={!!formErrors.phone}
                        required
                        disabled
                      />
                      <FormFeedback>{formErrors.phone}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                
                <FormGroup>
                  <Label for="email">Email Address</Label>
                  <Input 
                    type="email" 
                    name="email" 
                    id="email"
                    value={user.email}
                    onChange={handleInputChange}
                    invalid={!!formErrors.email}
                    required
                    disabled
                  />
                  <FormFeedback>{formErrors.email}</FormFeedback>
                </FormGroup>
                
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="deliveryDate">Delivery Date</Label>
                      <Input 
                        type="date" 
                        name="deliveryDate" 
                        id="deliveryDate"
                        value={orderForm.deliveryDate}
                        onChange={handleInputChange}
                        min={getMinDeliveryDate()}
                        invalid={!!formErrors.deliveryDate}
                        required
                      />
                      <FormFeedback>{formErrors.deliveryDate}</FormFeedback>
                      <FormText>Delivery is available only 3 days after order date</FormText>
                    </FormGroup>
                  </Col>
                  
                  <Col md={6}>
                    <FormGroup>
                      <Label for="city">Delivery Area</Label>
                      <Select
                        id="city"
                        name="city"
                        value={orderForm.city}
                        onChange={handleCityChange}
                        options={options.cities}
                        placeholder="Select delivery area..."
                        required
                        className={formErrors.city ? 'is-invalid' : ''}
                      />
                      {formErrors.city && <div className="invalid-feedback d-block">{formErrors.city}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                
                <FormGroup>
                  <Label for="deliveryAddress">Delivery Address</Label>
                  <Input 
                    type="textarea" 
                    name="deliveryAddress" 
                    id="deliveryAddress"
                    rows="2"
                    value={orderForm.deliveryAddress}
                    onChange={handleInputChange}
                    invalid={!!formErrors.deliveryAddress}
                    required
                  />
                  <FormFeedback>{formErrors.deliveryAddress}</FormFeedback>
                </FormGroup>
                
                <h5 className="border-bottom pb-2 mb-4 mt-5">Payment Information</h5>
                
                <FormGroup tag="fieldset">
                  <legend className="col-form-label">Payment Method</legend>
                  <div className="d-flex">
                    <FormGroup check className="me-4">
                      <Label check>
                        <Input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={orderForm.paymentMethod === 'cash'}
                          onChange={handleInputChange}
                        />
                        <FaMoneyBillAlt className="me-2" />
                        Cash / Bank Transfer
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={orderForm.paymentMethod === 'card'}
                          onChange={handleInputChange}
                        />
                        <FaCreditCard className="me-2" />
                        Credit / Debit Card
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
                
                {orderForm.paymentMethod === 'cash' && (
                  <Card className="mb-4 bg-light">
                    <CardBody>
                      <h6 className="mb-3">Bank Transfer Details</h6>
                      <p>Please transfer the total amount to the following bank account:</p>
                      <ListGroup className="mb-3">
                        <ListGroupItem>Bank: <strong>Commercial Bank</strong></ListGroupItem>
                        <ListGroupItem>Account Name: <strong>Sweet Delights Cakes</strong></ListGroupItem>
                        <ListGroupItem>Account Number: <strong>1234-5678-9012</strong></ListGroupItem>
                        <ListGroupItem>Branch: <strong>Colombo Main</strong></ListGroupItem>
                      </ListGroup>
                      
                      <FormGroup>
                        <Label for="bankSlip">Upload Bank Transfer Receipt</Label>
                        <InputGroup>
                          <Input
                            type="file"
                            name="bankSlip"
                            id="bankSlip"
                            onChange={handleFileChange}
                            invalid={!!formErrors.bankSlip}
                          />
                          <InputGroupText>
                            <FaUpload />
                          </InputGroupText>
                        </InputGroup>
                        <FormFeedback>{formErrors.bankSlip}</FormFeedback>
                        <FormText>Please upload a copy of your bank transfer receipt (JPG, PNG or PDF)</FormText>
                      </FormGroup>
                    </CardBody>
                  </Card>
                )}
                
                {orderForm.paymentMethod === 'card' && (
                  <Card className="mb-4 bg-light">
                    <CardBody>
                      <h6 className="mb-3">Card Payment Details</h6>
                      
                      <FormGroup>
                        <Label for="cardNumber">Card Number</Label>
                        <Input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={orderForm.cardNumber}
                          onChange={handleInputChange}
                          invalid={!!formErrors.cardNumber}
                        />
                        <FormFeedback>{formErrors.cardNumber}</FormFeedback>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label for="cardName">Name on Card</Label>
                        <Input
                          type="text"
                          name="cardName"
                          id="cardName"
                          placeholder="John Doe"
                          value={orderForm.cardName}
                          onChange={handleInputChange}
                          invalid={!!formErrors.cardName}
                        />
                        <FormFeedback>{formErrors.cardName}</FormFeedback>
                      </FormGroup>
                      
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="cardExpiry">Expiry Date</Label>
                            <Input
                              type="text"
                              name="cardExpiry"
                              id="cardExpiry"
                              placeholder="MM/YY"
                              value={orderForm.cardExpiry}
                              onChange={handleInputChange}
                              invalid={!!formErrors.cardExpiry}
                            />
                            <FormFeedback>{formErrors.cardExpiry}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="cardCvv">CVV</Label>
                            <Input
                              type="text"
                              name="cardCvv"
                              id="cardCvv"
                              placeholder="123"
                              value={orderForm.cardCvv}
                              onChange={handleInputChange}
                              invalid={!!formErrors.cardCvv}
                            />
                            <FormFeedback>{formErrors.cardCvv}</FormFeedback>
                          </FormGroup>
                        </Col>
                      </Row>
                      
                      <div className="text-end mt-2">
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" 
                          alt="Accepted payment methods" 
                          height="30"
                        />
                      </div>
                    </CardBody>
                  </Card>
                )}
                
                <Row className="mt-4">
                  <Col sm={6}>
                    <Button color="secondary" type="button" block onClick={togglePreview}>
                      Preview Order
                    </Button>
                  </Col>
                  <Col sm={6}>
                    <Button color="primary" type="submit" block disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Processing...
                        </>
                      ) : (
                        'Place Custom Order'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm position-sticky" style={{ top: '2rem' }}>
            <CardHeader className="bg-primary text-white">
              <h4 className="mb-0">Order Summary</h4>
            </CardHeader>
            <CardBody>
              <ListGroup flush>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Base Cake Price:</span>
                  <span>Rs. {priceDetails.basePrice.toFixed(2)}</span>
                </ListGroupItem>
                
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Add-ons:</span>
                  <span>Rs. {priceDetails.addonsPrice.toFixed(2)}</span>
                </ListGroupItem>
                
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Delivery Fee:</span>
                  <span>Rs. {priceDetails.deliveryFee.toFixed(2)}</span>
                </ListGroupItem>
                
                <ListGroupItem className="d-flex justify-content-between align-items-center fw-bold">
                  <span>Total:</span>
                  <span>Rs. {priceDetails.totalPrice.toFixed(2)}</span>
                </ListGroupItem>
              </ListGroup>
              
              <div className="mt-4">
                <Badge color="info" className="p-2 mb-2 d-block">
                  Delivery is available within Colombo and surrounding areas
                </Badge>
                <Alert color="warning" className="mt-3 mb-0">
                  <small>
                    <strong>Important:</strong> Custom orders require at least 3 days notice.
                    Orders for weekends should be placed by Thursday.
                  </small>
                </Alert>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      {/* Order Preview Modal */}
      <Modal isOpen={showPreview} toggle={togglePreview} size="lg">
        <ModalHeader toggle={togglePreview} className="bg-primary text-white">
          <FaCheckCircle className="me-2" /> Order Preview
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <h5 className="border-bottom pb-2">Cake Details</h5>
              <p><strong>Size:</strong> {
                orderForm.cakeSize === '1' ? 'Small (1-10 people)' :
                orderForm.cakeSize === '2' ? 'Medium (11-25 people)' :
                orderForm.cakeSize === '3' ? 'Large (26-50 people)' :
                'X-Large (50+ people)'
              }</p>
              <p><strong>Shape:</strong> {orderForm.cakeShape.charAt(0).toUpperCase() + orderForm.cakeShape.slice(1)}</p>
              <p><strong>Flavor:</strong> {options.cakeFlavors.find(f => f.value === orderForm.cakeFlavor)?.label || 'Not selected'}</p>
              <p><strong>Frosting:</strong> {options.frostings.find(f => f.value === orderForm.frosting)?.label || 'Not selected'}</p>
              
              <p><strong>Toppings:</strong></p>
              <ul>
                {orderForm.toppings.length > 0 ? (
                  orderForm.toppings.map((topping, index) => (
                    <li key={index}>{options.toppings.find(t => t.value === topping)?.label}</li>
                  ))
                ) : (
                  <li>No toppings selected</li>
                )}
              </ul>
              
              <p><strong>Special Instructions:</strong></p>
              <p>{orderForm.specialInstructions || 'None'}</p>
            </Col>
            
            <Col md={6}>
              <h5 className="border-bottom pb-2">Delivery Information</h5>
              <p><strong>Name:</strong> {orderForm.name}</p>
              <p><strong>Phone:</strong> {orderForm.phone}</p>
              <p><strong>Email:</strong> {orderForm.email}</p>
              <p><strong>Delivery Date:</strong> {orderForm.deliveryDate}</p>
              <p><strong>Delivery Area:</strong> {orderForm.city?.label || 'Not selected'}</p>
              <p><strong>Address:</strong> {orderForm.deliveryAddress}</p>
              
              <h5 className="border-bottom pb-2 mt-4">Payment Information</h5>
              <p><strong>Payment Method:</strong> {orderForm.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash/Bank Transfer'}</p>
              
              <h5 className="border-top pt-3 mt-4">Price Summary</h5>
              <p><strong>Base Price:</strong> Rs. {priceDetails.basePrice.toFixed(2)}</p>
              <p><strong>Add-ons:</strong> Rs. {priceDetails.addonsPrice.toFixed(2)}</p>
              <p><strong>Delivery Fee:</strong> Rs. {priceDetails.deliveryFee.toFixed(2)}</p>
              <p className="fw-bold"><strong>Total:</strong> Rs. {priceDetails.totalPrice.toFixed(2)}</p>
            </Col>
          </Row>
          
          <div className="text-center mt-3">
            <Button color="primary" onClick={togglePreview}>
              Continue Editing
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CustomOrderPage;
