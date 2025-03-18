import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Form, FormGroup, 
  Label, Input, Button, Alert, Badge, ListGroup, ListGroupItem
} from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaFacebook, FaInstagram, FaTwitter, FaPinterest,
  FaUtensils, FaBirthdayCake, FaHeart, FaQuestion
} from 'react-icons/fa';
import FallingSweets from '../components/FallingSweets';

const ContactUs = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setFormError(false);
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } else {
      setFormError(true);
    }
  };
  
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

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
                          <div className="rounded-pill w-30 h-30 bg-primary bg-opacity-10 p-3 me-3">
                            <FaPhone className="text-white" />
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
                            <FaEnvelope className="text-white" />
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
                            <FaMapMarkerAlt className="text-white" />
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
                            <FaClock className="text-white" />
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
                
                <Card className="border-0 shadow bg-primary text-white">
                  <CardBody className="p-4">
                    <h4 className="mb-3">Order Timeline</h4>
                    <p>For custom cake orders, please note our recommended timeline:</p>
                    <ul className="mb-0">
                      <li>Standard cakes: 48 hours notice</li>
                      <li>Custom design cakes: 1 week notice</li>
                      <li>Wedding cakes: 1-3 months notice</li>
                      <li>Large events: 2+ weeks notice</li>
                    </ul>
                  </CardBody>
                </Card>
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
                    
                    {formSubmitted && (
                      <Alert color="success" className="mb-4">
                        Thank you for your message! We'll get back to you shortly.
                      </Alert>
                    )}
                    
                    {formError && (
                      <Alert color="danger" className="mb-4">
                        Please fill out all required fields.
                      </Alert>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <FormGroup floating>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your Name"
                              type="text"
                              value={formData.name}
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
                        <Button color="primary" size="lg" type="submit">
                          Send Message
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Map Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            transition={fadeIn.transition}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="mb-4">Find Us</h2>
            <p className="lead mb-0">Visit our bakery in person to experience the sweet aroma and taste our fresh creations</p>
          </motion.div>
          
          <Card className="border-0 shadow overflow-hidden">
            <div className="ratio ratio-21x9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sbg!4v1579767901424!5m2!1sen!2sbg" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sweet Delights Bakery Location"
              ></iframe>
            </div>
          </Card>
        </Container>
      </section>
      
      {/* FAQ Section */}
      <section className="py-5">
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-5"
          >
            <p className="lead mb-4">
              Don't see your question here? Contact us directly and we'll be happy to help!
            </p>
            <Button color="primary" size="lg" className="rounded-pill px-4">
              View All FAQs
            </Button>
          </motion.div>
        </Container>
      </section>
      
      {/* Quick Contact Options */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow text-center h-100">
                  <CardBody className="p-4">
                    <div className="rounded-circle bg-primary mx-auto p-3 d-inline-flex mb-3" style={{ width: '70px', height: '70px' }}>
                      <FaPhone className="text-white m-auto" size={24} />
                    </div>
                    <h3 className="mb-3">Call Us</h3>
                    <p className="mb-3">Speak directly with our customer service team</p>
                    <Button color="primary" outline className="rounded-pill">
                      +1 (555) 123-4567
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
            
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow text-center h-100">
                  <CardBody className="p-4">
                    <div className="rounded-circle bg-success mx-auto p-3 d-inline-flex mb-3" style={{ width: '70px', height: '70px' }}>
                      <FaEnvelope className="text-white m-auto" size={24} />
                    </div>
                    <h3 className="mb-3">Email Us</h3>
                    <p className="mb-3">Send us your inquiries anytime, day or night</p>
                    <Button color="success" outline className="rounded-pill">
                      hello@sweetdelights.com
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
            
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow text-center h-100">
                  <CardBody className="p-4">
                    <div className="rounded-circle bg-info mx-auto p-3 d-inline-flex mb-3" style={{ width: '70px', height: '70px' }}>
                      <FaMapMarkerAlt className="text-white m-auto" size={24} />
                    </div>
                    <h3 className="mb-3">Visit Us</h3>
                    <p className="mb-3">Stop by our bakery for a sweet experience</p>
                    <Button color="info" outline className="rounded-pill">
                      Get Directions
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-4"
          >
            <h2 className="display-5 fw-bold mb-3">Stay Updated</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
              Subscribe to our newsletter for special offers, new flavors, and baking tips!
            </p>
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <div className="d-flex">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="form-control-lg me-2 rounded-pill" 
                  />
                  <Button color="light" size="lg" className="rounded-pill px-4 text-primary">
                    Subscribe
                  </Button>
                </div>
                <small className="d-block mt-2">We respect your privacy. Unsubscribe at any time.</small>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default ContactUs;
