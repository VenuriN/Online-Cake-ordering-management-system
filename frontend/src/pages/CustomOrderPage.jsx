import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, 
  FormGroup, Label, Input, Button, Alert, 
  Spinner, CardHeader, ListGroup, ListGroupItem
} from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import theme from '../styles/theme';

const CustomOrderPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [cakeCategories, setCakeCategories] = useState([]);
  const [addons, setAddons] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  // Preview state for design image
  const [designImagePreview, setDesignImagePreview] = useState(null);
  
  const [orderData, setOrderData] = useState({
    // Cake details
    cakeSize: 'medium',
    cakeCategory: '',
    selectedAddons: [],
    specialInstructions: '',
    designImage: null,
    
    // Delivery details
    name: '',
    email: '',
    contact: '',
    city: '',
    address: '',
    
    // Payment details
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    receiptImage: null
  });
  
  const [pricing, setPricing] = useState({
    basePrice: 0,
    addonsPrice: 0,
    deliveryFee: 0,
    totalPrice: 0
  });
  
  // Base prices for different cake sizes
  const sizePrices = {
    small: 2000,
    medium: 3500,
    large: 5000
  };
  
  useEffect(() => {
    // Fetch cake categories, addons, and cities when component mounts
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [categoriesRes, addonsRes, citiesRes] = await Promise.all([
          axios.get('http://localhost:4000/api/cake-categories'),
          axios.get('http://localhost:4000/api/addons'),
          axios.get('http://localhost:4000/api/cities')
        ]);
        
        setCakeCategories(categoriesRes.data.data.categories || []);
        setAddons(addonsRes.data.data.addons || []);
        setCities(citiesRes.data.data.cities || []);
        
        // Set default category if available
        if (categoriesRes.data.data.categories && categoriesRes.data.data.categories.length > 0) {
          setOrderData(prev => ({
            ...prev,
            cakeCategory: categoriesRes.data.data.categories[0]._id
          }));
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiError('Failed to load necessary data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate pricing whenever relevant data changes
  useEffect(() => {
    const calculatePricing = () => {
      // Base price based on size
      const basePrice = sizePrices[orderData.cakeSize] || 0;
      
      // Additional price based on cake category
      const selectedCategory = cakeCategories.find(cat => cat._id === orderData.cakeCategory);
      const categoryPrice = selectedCategory ? selectedCategory.additionalPrice : 0;
      
      // Calculate addons price
      const selectedAddonIds = Array.isArray(orderData.selectedAddons) ? orderData.selectedAddons : [];
      const addonsPrice = addons
        .filter(addon => selectedAddonIds.includes(addon._id))
        .reduce((sum, addon) => sum + addon.price, 0);
      
      // Calculate delivery fee
      const selectedCity = cities.find(city => city._id === orderData.city);
      const deliveryFee = selectedCity ? selectedCity.deliveryFee : 0;
      
      // Calculate total
      const totalPrice = basePrice + categoryPrice + addonsPrice + deliveryFee;
      
      setPricing({
        basePrice: basePrice + categoryPrice,
        addonsPrice,
        deliveryFee,
        totalPrice
      });
    };
    
    calculatePricing();
  }, [orderData.cakeSize, orderData.cakeCategory, orderData.selectedAddons, orderData.city, cakeCategories, addons, cities]);
  
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      // Handle addon checkboxes
      if (name === 'addon') {
        const addonId = value;
        let updatedAddons = [...orderData.selectedAddons];
        
        if (checked) {
          updatedAddons.push(addonId);
        } else {
          updatedAddons = updatedAddons.filter(id => id !== addonId);
        }
        
        setOrderData({
          ...orderData,
          selectedAddons: updatedAddons
        });
      } else {
        setOrderData({
          ...orderData,
          [name]: checked
        });
      }
    } else if (type === 'file') {
      // Handle file uploads
      if (name === 'designImage' && files[0]) {
        // Create preview URL for design image
        const previewUrl = URL.createObjectURL(files[0]);
        setDesignImagePreview(previewUrl);
      }
      
      setOrderData({
        ...orderData,
        [name]: files[0]
      });
    } else {
      setOrderData({
        ...orderData,
        [name]: value
      });
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!orderData.cakeCategory) {
      newErrors.cakeCategory = 'Please select a cake category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!orderData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!orderData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!orderData.contact) {
      newErrors.contact = 'Contact number is required';
    }
    
    if (!orderData.city) {
      newErrors.city = 'Please select a city';
    }
    
    if (!orderData.address) {
      newErrors.address = 'Delivery address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors = {};
    
    if (orderData.paymentMethod === 'card') {
      if (!orderData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(orderData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!orderData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!orderData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(orderData.expiryDate)) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      }
      
      if (!orderData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(orderData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (orderData.paymentMethod === 'bank') {
      if (!orderData.receiptImage) {
        newErrors.receiptImage = 'Please upload a receipt image';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        setApiError('You must be logged in to place an order');
        setLoading(false);
        return;
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('cakeSize', orderData.cakeSize);
      formData.append('cakeCategory', orderData.cakeCategory);
      
      // Append addons as array
      orderData.selectedAddons.forEach(addonId => {
        formData.append('selectedAddons', addonId);
      });
      
      formData.append('specialInstructions', orderData.specialInstructions);
      
      // Append design image if available
      if (orderData.designImage) {
        formData.append('designImage', orderData.designImage);
      }
      
      formData.append('name', orderData.name);
      formData.append('email', orderData.email);
      formData.append('contact', orderData.contact);
      formData.append('city', orderData.city);
      formData.append('address', orderData.address);
      formData.append('paymentMethod', orderData.paymentMethod);
      
      if (orderData.paymentMethod === 'card') {
        formData.append('cardNumber', orderData.cardNumber);
        formData.append('cardName', orderData.cardName);
        formData.append('expiryDate', orderData.expiryDate);
        formData.append('cvv', orderData.cvv);
      } else if (orderData.paymentMethod === 'bank' && orderData.receiptImage) {
        formData.append('receiptImage', orderData.receiptImage);
      }
      
      // Append pricing information
      formData.append('basePrice', pricing.basePrice);
      formData.append('addonsPrice', pricing.addonsPrice);
      formData.append('deliveryFee', pricing.deliveryFee);
      formData.append('totalPrice', pricing.totalPrice);
      
      const response = await axios.post('http://localhost:4000/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.code === 201) {
        // Order placed successfully, redirect to order confirmation page
        navigate(`/user/my-orders`);
      } else {
        setApiError(response.data.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setApiError(error.response?.data?.data?.message || 'An error occurred while placing your order');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !cakeCategories.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }
  
  return (
    <Container className="my-5">
      <Card className="shadow">
        <CardHeader className="bg-primary text-white">
          <h2 className="mb-0">Custom Cake Order</h2>
        </CardHeader>
        <CardBody>
          {apiError && (
            <Alert color="danger" className="mb-4">
              {apiError}
            </Alert>
          )}
          
          {step === 1 && (
            <Form>
              <h3 className="mb-4">Step 1: Cake Details</h3>
              
              <FormGroup>
                <Label for="cakeSize">Cake Size</Label>
                <div>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="cakeSize"
                        value="small"
                        checked={orderData.cakeSize === 'small'}
                        onChange={handleChange}
                      />{' '}
                      Small (6") - Rs. {sizePrices.small}
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="cakeSize"
                        value="medium"
                        checked={orderData.cakeSize === 'medium'}
                        onChange={handleChange}
                      />{' '}
                      Medium (8") - Rs. {sizePrices.medium}
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="cakeSize"
                        value="large"
                        checked={orderData.cakeSize === 'large'}
                        onChange={handleChange}
                      />{' '}
                      Large (10") - Rs. {sizePrices.large}
                    </Label>
                  </FormGroup>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label for="cakeCategory">Cake Category</Label>
                <Input
                  type="select"
                  name="cakeCategory"
                  id="cakeCategory"
                  value={orderData.cakeCategory}
                  onChange={handleChange}
                  invalid={!!errors.cakeCategory}
                >
                  <option value="">Select a cake category</option>
                  {cakeCategories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name} (+Rs. {category.additionalPrice})
                    </option>
                  ))}
                </Input>
                {errors.cakeCategory && <div className="text-danger">{errors.cakeCategory}</div>}
              </FormGroup>
              
              <FormGroup>
                <Label>Addons</Label>
                <div className="addon-list">
                  {addons.map(addon => (
                    <FormGroup check key={addon._id}>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="addon"
                          value={addon._id}
                          checked={orderData.selectedAddons.includes(addon._id)}
                          onChange={handleChange}
                        />{' '}
                        {addon.name} (+Rs. {addon.price})
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label for="designImage">Cake Design Image (Optional)</Label>
                <Input
                  type="file"
                  name="designImage"
                  id="designImage"
                  onChange={handleChange}
                  accept="image/*"
                />
                <small className="form-text text-muted">
                  Upload a reference image for your cake design if you have one.
                </small>
                
                {designImagePreview && (
                  <div className="mt-3">
                    <p>Preview:</p>
                    <img 
                      src={designImagePreview} 
                      alt="Design Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label for="specialInstructions">Special Instructions</Label>
                <Input
                  type="textarea"
                  name="specialInstructions"
                  id="specialInstructions"
                  placeholder="Any special requirements for your cake..."
                  value={orderData.specialInstructions}
                  onChange={handleChange}
                  rows={4}
                />
              </FormGroup>
              
              <div className="d-flex justify-content-between mt-4">
                <div></div>
                <Button color="primary" onClick={handleNext}>
                  Next: Delivery Details
                </Button>
              </div>
            </Form>
          )}
          
          {step === 2 && (
            <Form>
              <h3 className="mb-4">Step 2: Delivery Details</h3>
              
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="name">Full Name</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your full name"
                      value={orderData.name}
                      onChange={handleChange}
                      invalid={!!errors.name}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      value={orderData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </FormGroup>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contact">Contact Number</Label>
                    <Input
                      type="text"
                      name="contact"
                      id="contact"
                      placeholder="Enter your contact number"
                      value={orderData.contact}
                      onChange={handleChange}
                      invalid={!!errors.contact}
                    />
                    {errors.contact && <div className="text-danger">{errors.contact}</div>}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input
                      type="select"
                      name="city"
                      id="city"
                      value={orderData.city}
                      onChange={handleChange}
                      invalid={!!errors.city}
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city._id} value={city._id}>
                          {city.name} (Delivery Fee: Rs. {city.deliveryFee})
                        </option>
                      ))}
                    </Input>
                    {errors.city && <div className="text-danger">{errors.city}</div>}
                  </FormGroup>
                </Col>
              </Row>
              
              <FormGroup>
                <Label for="address">Delivery Address</Label>
                <Input
                  type="textarea"
                  name="address"
                  id="address"
                  placeholder="Enter your full delivery address"
                  value={orderData.address}
                  onChange={handleChange}
                  invalid={!!errors.address}
                  rows={3}
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </FormGroup>
              
              <div className="d-flex justify-content-between mt-4">
                <Button color="secondary" onClick={handleBack}>
                  Back: Cake Details
                </Button>
                <Button color="primary" onClick={handleNext}>
                  Next: Payment
                </Button>
              </div>
            </Form>
          )}
          
          {step === 3 && (
            <Form onSubmit={handleSubmit}>
              <h3 className="mb-4">Step 3: Payment Details</h3>
              
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <CardBody>
                      <h4>Order Summary</h4>
                      <ListGroup flush>
                        <ListGroupItem className="d-flex justify-content-between">
                          <span>Base Price:</span>
                          <span>Rs. {pricing.basePrice.toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem className="d-flex justify-content-between">
                          <span>Addons:</span>
                          <span>Rs. {pricing.addonsPrice.toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem className="d-flex justify-content-between">
                          <span>Delivery Fee:</span>
                          <span>Rs. {pricing.deliveryFee.toFixed(2)}</span>
                        </ListGroupItem>
                        <ListGroupItem className="d-flex justify-content-between fw-bold">
                          <span>Total:</span>
                          <span>Rs. {pricing.totalPrice.toFixed(2)}</span>
                        </ListGroupItem>
                      </ListGroup>
                    </CardBody>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <FormGroup tag="fieldset">
                    <legend>Payment Method</legend>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={orderData.paymentMethod === 'card'}
                          onChange={handleChange}
                        />{' '}
                        Credit/Debit Card
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={orderData.paymentMethod === 'bank'}
                          onChange={handleChange}
                        />{' '}
                        Bank Transfer
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
              
              {orderData.paymentMethod === 'card' && (
                <div>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cardNumber">Card Number</Label>
                        <Input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={orderData.cardNumber}
                          onChange={handleChange}
                          invalid={!!errors.cardNumber}
                        />
                        {errors.cardNumber && <div className="text-danger">{errors.cardNumber}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cardName">Name on Card</Label>
                        <Input
                          type="text"
                          name="cardName"
                          id="cardName"
                          placeholder="John Doe"
                          value={orderData.cardName}
                          onChange={handleChange}
                          invalid={!!errors.cardName}
                        />
                        {errors.                        cardName && <div className="text-danger">{errors.cardName}</div>}
                      </FormGroup>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="expiryDate">Expiry Date</Label>
                        <Input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={orderData.expiryDate}
                          onChange={handleChange}
                          invalid={!!errors.expiryDate}
                        />
                        {errors.expiryDate && <div className="text-danger">{errors.expiryDate}</div>}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="cvv">CVV</Label>
                        <Input
                          type="text"
                          name="cvv"
                          id="cvv"
                          placeholder="123"
                          value={orderData.cvv}
                          onChange={handleChange}
                          invalid={!!errors.cvv}
                        />
                        {errors.cvv && <div className="text-danger">{errors.cvv}</div>}
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
              )}
              
              {orderData.paymentMethod === 'bank' && (
                <div>
                  <Alert color="info">
                    <h5>Bank Transfer Instructions</h5>
                    <p>Please transfer the total amount to the following bank account:</p>
                    <p>
                      <strong>Bank:</strong> Holy Spatula Bank<br />
                      <strong>Account Name:</strong> The Holy Spatula Cakes<br />
                      <strong>Account Number:</strong> 1234567890<br />
                      <strong>Branch Code:</strong> 001
                    </p>
                    <p>After making the payment, please upload a screenshot or photo of the payment receipt below.</p>
                  </Alert>
                  
                  <FormGroup>
                    <Label for="receiptImage">Upload Payment Receipt</Label>
                    <Input
                      type="file"
                      name="receiptImage"
                      id="receiptImage"
                      onChange={handleChange}
                      invalid={!!errors.receiptImage}
                      accept="image/*"
                    />
                    {errors.receiptImage && <div className="text-danger">{errors.receiptImage}</div>}
                  </FormGroup>
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                <Button color="secondary" onClick={handleBack}>
                  Back: Delivery Details
                </Button>
                <Button 
                  color="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Place Order'}
                </Button>
              </div>
            </Form>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default CustomOrderPage;

