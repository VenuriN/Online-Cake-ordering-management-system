import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, FormGroup, 
  Label, Input, Button, Alert, Badge, ListGroup, ListGroupItem,
  Spinner
} from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaFacebook, FaInstagram, FaTwitter, FaPinterest,
  FaUtensils, FaBirthdayCake, FaHeart, FaQuestion,
  FaPaperPlane
} from 'react-icons/fa';
import axios from 'axios';
import FallingSweets from '../components/FallingSweets';

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userId: '',
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data;
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        userId: userData._id || ''
      }));
      console.log(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!formData.name || !formData.email || !formData.message) {
    setFormError('Please fill in all required fields.');
    return;
  }
  
  try {
    setIsSubmitting(true);
    setFormError(null);
    
    // Get user token if logged in
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const submissionData = {
      ...formData,
      userId: user._id || null
    };

    console.log('Submitting with user ID:', submissionData.userId);
    
    // Submit inquiry to backend
    const response = await axios.post(
      'http://localhost:4000/api/v1/inquiries', 
      submissionData,
      { headers }
    );
    
    if (response.data.success) {
      setFormSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        userId: user._id || null
      });
    }
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    setFormError(error.response?.data?.message || 'Failed to submit your inquiry. Please try again later.');
  } finally {
    setIsSubmitting(false);
  }
};

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="contact-us">
      <FallingSweets count={10} speed={0.6} />
      
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container className="py-5">
          <motion.div
            initial={fadeIn.initial}
            animate={fadeIn.animate}
            transition={fadeIn.transition}
            className="text-center"
          >
            <h1 className="display-4 fw-bold mb-4">Get in Touch</h1>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
              Have questions about our products, need to place a special order, or just want to say hello?
              We'd love to hear from you!
            </p>
            <div className="d-flex justify-content-center gap-3 mb-4">
              <Badge color="primary" pill className="px-3 py-2">Order Inquiries</Badge>
              <Badge color="secondary" pill className="px-3 py-2">Custom Cakes</Badge>
              <Badge color="info" pill className="px-3 py-2">Catering</Badge>
              <Badge color="success" pill className="px-3 py-2">Feedback</Badge>
            </div>
          </motion.div>
        </Container>
      </section>
      
      {/* Contact Information & Form Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4">Contact Information</h2>
                <Card className="border-0 shadow mb-4">
                  <CardBody>
                    <ListGroup flush>
                      <ListGroupItem className="border-0 px-0 py-3">
                        <div className="d-flex">
                          <div className="rounded-pill bg-primary bg-opacity-10 p-3 me-3">
                            <FaPhone className="text-primary" />
                          </div>
                          <div>
                            <h5 className="mb-1">Phone</h5>
                            <p className="mb-0">+1 (555) 123-4567</p>
                            <small className="text-muted">Monday to Friday, 9am to 6pm</small>
                          </div>
                        </div>
                      </ListGroupItem>
                      
                      <ListGroupItem className="border-0 px-0 py-3">
                        <div className="d-flex">
                          <div className="rounded-pill bg-primary bg-opacity-10 p-3 me-3">
                            <FaEnvelope className="text-primary" />
                          </div>
                          <div>
                            <h5 className="mb-1">Email</h5>
                            <p className="mb-0">hello@sweetdelightsbakery.com</p>
                            <small className="text-muted">We'll respond within 24 hours</small>
                          </div>
                        </div>
                      </ListGroupItem>
                      
                      <ListGroupItem className="border-0 px-0 py-3">
                        <div className="d-flex">
                          <div className="rounded-pill bg-primary bg-opacity-10 p-3 me-3">
                            <FaMapMarkerAlt className="text-primary" />
                          </div>
                          <div>
                            <h5 className="mb-1">Location</h5>
                            <p className="mb-0">123 Bakery Street, Sweet City, SC 12345</p>
                            <small className="text-muted">Visit our bakery in person</small>
                          </div>
                        </div>
                      </ListGroupItem>
                      
                      <ListGroupItem className="border-0 px-0 py-3">
                        <div className="d-flex">
                          <div className="rounded-pill bg-primary bg-opacity-10 p-3 me-3">
                            <FaClock className="text-primary" />
                          </div>
                          <div>
                            <h5 className="mb-1">Hours</h5>
                            <p className="mb-0">Mon-Sat: 8:00 AM - 8:00 PM</p>
                            <p className="mb-0">Sunday: 9:00 AM - 5:00 PM</p>
                          </div>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
                
                <h4 className="mb-3">Connect With Us</h4>
                <div className="d-flex gap-3 mb-4">
                  <Button color="primary" className="rounded-circle p-3">
                    <FaFacebook />
                  </Button>
                  <Button color="danger" className="rounded-circle p-3">
                    <FaInstagram />
                  </Button>
                  <Button color="info" className="rounded-circle p-3">
                    <FaTwitter />
                  </Button>
                  <Button color="danger" className="rounded-circle p-3">
                    <FaPinterest />
                  </Button>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow">
                  <CardBody className="p-4">
                    <h2 className="mb-4">Send Us a Message</h2>
                    
                    {formSubmitted ? (
                      <Alert color="success" className="mb-4">
                        <div className="text-center py-3">
                          <FaPaperPlane size={40} className="mb-3 text-success" />
                          <h4>Thank you for your message!</h4>
                          <p className="mb-0">We've received your inquiry and will get back to you shortly.</p>
                          {localStorage.getItem('token') && (
                            <div className="mt-3">
                              <Button color="primary" onClick={() => window.location.href = '/user/inquiries'}>
                                View Your Inquiries
                              </Button>
                            </div>
                          )}
                        </div>
                      </Alert>
                    ) : (
                      <Form onSubmit={handleSubmit}>
                        {formError && (
                          <Alert color="danger" className="mb-4">
                            {formError}
                          </Alert>
                        )}
                        
                        <Row>
                          <Col md={6}>
                            <FormGroup floating>
                              <Input
                                 id="name"
                                 name="name"
                                 placeholder="Your Name"
                                 type="text"
                                 value={formData.firstName}
                                 onChange={handleInputChange}
                                 required
                               />
                               <Label for="name">Your Name*</Label>
                             </FormGroup>
                           </Col>
                           
                           <Col md={6}>
                             <FormGroup floating>
                               <Input
                                 id="email"
                                 name="email"
                                 placeholder="Email Address"
                                 type="email"
                                 value={formData.email}
                                 onChange={handleInputChange}
                                 required
                                 disabled={isLoggedIn}
                               />
                               <Label for="email">Email Address*</Label>
                             </FormGroup>
                           </Col>
                         </Row>
                         
                         <Row>
                           <Col md={6}>
                             <FormGroup floating>
                               <Input
                                 id="phone"
                                 name="phone"
                                 placeholder="Phone Number"
                                 type="tel"
                                 value={formData.phone}
                                 onChange={handleInputChange}
                                 disabled={isLoggedIn}
                               />
                               <Label for="phone">Phone Number</Label>
                             </FormGroup>
                           </Col>
                           
                           <Col md={6}>
                             <FormGroup floating>
                               <Input
                                 id="subject"
                                 name="subject"
                                 type="select"
                                 value={formData.subject}
                                 onChange={handleInputChange}
                               >
                                 <option value="">Select a subject</option>
                                 <option value="Order Inquiry">Order Inquiry</option>
                                 <option value="Custom Cake">Custom Cake</option>
                                 <option value="Catering">Catering</option>
                                 <option value="Feedback">Feedback</option>
                                 <option value="Other">Other</option>
                               </Input>
                               <Label for="subject">Subject</Label>
                             </FormGroup>
                           </Col>
                         </Row>
                         
                         <FormGroup floating>
                           <Input
                             id="message"
                             name="message"
                             placeholder="Your Message"
                             type="textarea"
                             style={{ height: '150px' }}
                             value={formData.message}
                             onChange={handleInputChange}
                             required
                           />
                           <Label for="message">Your Message*</Label>
                         </FormGroup>
                         
                         <div className="d-grid mt-4">
                           <Button color="primary" size="lg" type="submit" disabled={isSubmitting}>
                             {isSubmitting ? (
                               <>
                                 <Spinner size="sm" className="me-2" /> Sending...
                               </>
                             ) : (
                               'Send Message'
                             )}
                           </Button>
                         </div>
                       </Form>
                     )}
                   </CardBody>
                 </Card>
               </motion.div>
             </Col>
           </Row>
         </Container>
       </section>
       
       {/* FAQ Section */}
       <section className="py-5 bg-light">
         <Container>
           <motion.div
             initial={fadeIn.initial}
             whileInView={fadeIn.animate}
             transition={fadeIn.transition}
             viewport={{ once: true }}
             className="text-center mb-5"
           >
             <h2 className="mb-4">Frequently Asked Questions</h2>
             <p className="lead mb-0 mx-auto" style={{ maxWidth: '700px' }}>
               Find quick answers to our most commonly asked questions
             </p>
           </motion.div>
           
           <Row className="g-4">
             {[
               {
                 question: "How far in advance should I order a custom cake?",
                 answer: "For custom cakes, we recommend placing your order at least one week in advance. For wedding cakes or large events, 1-3 months notice is preferred to ensure availability and allow time for design consultations.",
                 icon: FaBirthdayCake,
                 color: "success"
               },
               {
                 question: "Do you offer delivery services?",
                 answer: "Yes, we offer delivery within a 25-mile radius of our bakery. Delivery fees vary based on distance. For wedding cakes and large orders, we provide setup services as well.",
                 icon: FaUtensils,
                 color: "success"
               },
               {
                 question: "Can you accommodate dietary restrictions?",
                 answer: "Absolutely! We offer gluten-free, dairy-free, nut-free, and vegan options. Please inform us of any allergies or dietary restrictions when placing your order so we can ensure your safety and satisfaction.",
                 icon: FaHeart,
                 color: "danger"
               },
               {
                 question: "How do I place an order for a special occasion?",
                 answer: "You can place an order by calling us, visiting our bakery in person, or filling out the contact form on this page. For custom cakes, we'll schedule a consultation to discuss your vision, flavors, and design preferences.",
                 icon: FaQuestion,
                 color: "info"
               }
             ].map((faq, index) => (
               <Col md={6} key={index}>
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   viewport={{ once: true }}
                 >
                   <Card className="border-0 shadow h-100">
                     <CardBody className="p-4">
                       <div className="d-flex mb-3">
                         <div className={`rounded-circle bg-${faq.color} bg-opacity-10 p-3 me-3`}>
                           <faq.icon className={`text-${faq.color}`} />
                         </div>
                         <h4 className="mt-2">{faq.question}</h4>
                       </div>
                       <p className="mb-0">{faq.answer}</p>
                     </CardBody>
                   </Card>
                 </motion.div>
               </Col>
             ))}
           </Row>
         </Container>
       </section>
     </div>
   );
 };
 
 export default ContactUs;