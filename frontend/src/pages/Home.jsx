import React from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardImg, CardTitle, 
  CardText, Button, Badge
} from 'reactstrap';
import { FaBirthdayCake, FaShoppingCart, FaStar, FaPhone, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import FallingSweets from '../components/FallingSweets';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <FallingSweets count={20} speed={0.8} />

      <section className="hero-section py-5 mt-4">
        <Container fluid>
          <motion.div 
            className="text-center py-5 px-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="display-3 fw-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Sweet Delights Bakery
            </motion.h1>
            <motion.p 
              className="lead fs-4 my-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Crafting moments of joy, one cake at a time
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button varient="primary" size="lg" className="rounded-pill px-4 py-2 me-3">
                Order Now <FaShoppingCart className="ms-2" />
              </Button>
              <Button color="outline-dark" size="lg" className="rounded-pill px-4 py-2">
                View Menu
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2">Our Signature Cakes</h2>
            <p className="text-center text-muted mb-5">Handcrafted with love and premium ingredients</p>
            <Row>
              {[
                { name: 'Chocolate Dream', desc: 'Rich chocolate layers with ganache', price: '$42.99' },
                { name: 'Berry Bliss', desc: 'Fresh seasonal berries with cream', price: '$45.99' },
                { name: 'Wedding Special', desc: 'Elegant multi-tier masterpiece', price: '$249.99' }
              ].map((cake, index) => (
                <Col md={4} className="mb-4" key={index}>
                  <motion.div
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card className="h-100 border-0 shadow">
                      <div className="position-relative">
                        <CardImg top width="100%" src={`/images/${cake.name.toLowerCase().replace(' ', '-')}.jpg`} alt={cake.name} className="img-fluid" />
                        <Badge color="danger" pill className="position-absolute top-0 end-0 m-2">Bestseller</Badge>
                      </div>
                      <CardBody className="d-flex flex-column">
                        <CardTitle tag="h4">{cake.name}</CardTitle>
                        <CardText className="text-muted">{cake.desc}</CardText>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="fw-bold fs-5">{cake.price}</span>
                          <Button color="primary" outline className="rounded-pill">
                            <FaHeart className="me-2" /> View Details
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="about-section py-5 bg-light">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">Our Story</h2>
                <p className="lead">
                  With over 20 years of experience in crafting delectable desserts,
                  we take pride in using only the finest ingredients and traditional recipes.
                </p>
                <p className="mb-4">
                  Every cake tells a story, and we're here to make yours unforgettable.
                </p>
                <Row className="g-4 mt-2">
                  <Col xs={4}>
                    <div className="text-center p-3 rounded bg-white shadow-sm">
                      <FaStar className="text-warning fs-1 mb-2" />
                      <p className="mb-0 fw-bold">Premium Quality</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-center p-3 rounded bg-white shadow-sm">
                      <FaBirthdayCake className="text-primary fs-1 mb-2" />
                      <p className="mb-0 fw-bold">Custom Designs</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="text-center p-3 rounded bg-white shadow-sm">
                      <FaShoppingCart className="text-success fs-1 mb-2" />
                      <p className="mb-0 fw-bold">Fast Delivery</p>
                    </div>
                  </Col>
                </Row>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img src="/images/bakery-interior.jpg" alt="Our Bakery" className="img-fluid rounded-3 shadow" />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Special Offers Section */}
      <section className="offers-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2">Special Offers</h2>
            <p className="text-center text-muted mb-5">Limited time deals you don't want to miss</p>
            <Row className="g-4">
              {[
                {
                  title: "Birthday Special",
                  price: "$49.99",
                  features: ["Custom Message", "Candles Included", "Free Delivery"],
                  color: "primary"
                },
                {
                  title: "Wedding Cake",
                  price: "$299.99",
                  features: ["3-Tier Design", "Consultation Included", "Setup Service"],
                  color: "danger",
                  featured: true
                },
                {
                  title: "Party Pack",
                  price: "$89.99",
                  features: ["24 Cupcakes", "Mix & Match Flavors", "Party Decorations"],
                  color: "success"
                },
                {
                  title: "Season Special",
                  price: "$39.99",
                  features: ["Limited Edition", "Seasonal Ingredients", "Gift Wrapping"],
                  color: "warning"
                }
              ].map((offer, index) => (
                <Col md={6} lg={3} key={index}>
                  <motion.div
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Card className={`h-100 border-0 shadow ${offer.featured ? 'transform-scale-1.05' : ''}`}>
                      <div className={`bg-${offer.color} text-white text-center p-4 rounded-top`}>
                        <h3>{offer.title}</h3>
                        <p className="display-6 fw-bold mb-0">{offer.price}</p>
                      </div>
                      <CardBody className="d-flex flex-column">
                        <ul className="list-unstyled mb-4">
                          {offer.features.map((feature, i) => (
                            <li key={i} className="mb-2">
                              <FaHeart className={`text-${offer.color} me-2`} /> {feature}
                            </li>
                          ))}
                        </ul>
                        <Button color={offer.color} className="mt-auto w-100 rounded-pill">
                          Order Now
                        </Button>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2">What Our Customers Say</h2>
            <p className="text-center text-muted mb-5">Don't just take our word for it</p>
            <Row>
              {[
                { name: "Sarah Johnson", role: "Wedding Client", text: "The wedding cake exceeded all our expectations! Not only was it stunning, but it tasted amazing too." },
                { name: "Michael Chen", role: "Regular Customer", text: "I've ordered birthday cakes for my family for years. The quality and taste are consistently outstanding." },
                { name: "Emily Rodriguez", role: "Corporate Event", text: "Our company event was a hit thanks to the beautiful dessert spread. Professional service from start to finish." }
              ].map((testimonial, index) => (
                <Col md={4} className="mb-4" key={index}>
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  >
                    <Card className="h-100 border-0 shadow-sm">
                      <CardBody className="p-4">
                        <div className="mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-warning me-1" />
                          ))}
                        </div>
                        <CardText className="mb-4 fst-italic">
                          "{testimonial.text}"
                        </CardText>
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                            <small className="text-muted">{testimonial.role}</small>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2">Visit Us</h2>
            <p className="text-center text-muted mb-5">We'd love to see you in person</p>
            <Row className="g-4 justify-content-center">
              <Col md={4}>
                <Card className="h-100 border-0 shadow text-center p-4">
                  <CardBody>
                    <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                      <FaPhone className="fs-2 text-white" />
                    </div>
                    <h4>Phone</h4>
                    <p className="mb-0">+1 (555) 123-4567</p>
                    <Button color="link" className="mt-3 p-0">Call Us</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 shadow text-center p-4">
                  <CardBody>
                    <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                      <FaMapMarkerAlt className="fs-2 text-white" />
                    </div>
                    <h4>Location</h4>
                    <p className="mb-0">123 Bakery Street<br />Sweet City, SC 12345</p>
                    <Button color="link" className="mt-3 p-0">Get Directions</Button>
                  </CardBody>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 border-0 shadow text-center p-4">
                  <CardBody>
                    <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex p-3 mb-3">
                      <FaClock className="fs-2 text-white" />
                    </div>
                    <h4>Hours</h4>
                    <p className="mb-0">Mon-Sat: 8:00 AM - 8:00 PM<br />Sunday: 9:00 AM - 5:00 PM</p>
                    <Button color="link" className="mt-3 p-0">See Holiday Hours</Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container>
          <motion.div 
            className="text-center py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="display-5 fw-bold mb-3">Ready to Order Your Dream Cake?</h2>
            <p className="lead mb-4">Custom orders, special occasions, or just a sweet treat - we've got you covered!</p>
            <Button color="light" size="lg" className="rounded-pill px-5 py-2 fw-bold text-primary me-3">
              Order Online
            </Button>
            <Button color="outline-light" size="lg" className="rounded-pill px-5 py-2">
              Contact Us
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Instagram Feed Section */}
      <section className="instagram-section py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-center mb-2">Follow Us on Instagram</h2>
            <p className="text-center text-muted mb-5">@sweetdelightsbakery</p>
            <Row className="g-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Col xs={6} md={4} lg={2} key={item}>
                  <motion.div
                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  >
                    <Card className="border-0 overflow-hidden">
                      <div className="position-relative instagram-item">
                        <CardImg src={`/images/instagram-${item}.jpg`} alt="Instagram post" className="img-fluid" />
                        <div className="instagram-overlay d-flex align-items-center justify-content-center">
                          <FaHeart className="text-white me-2" /> 
                          <span className="text-white">123</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-5 bg-light">
        <Container>
          <motion.div 
            className="text-center py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <h2 className="mb-3">Join Our Sweet Community</h2>
                <p className="text-muted mb-4">Subscribe to our newsletter for special offers, new flavors, and baking tips!</p>
                <div className="d-flex">
                  <input type="email" className="form-control form-control-lg me-2" placeholder="Your email address" />
                  <Button color="primary" size="lg">Subscribe</Button>
                </div>
                <small className="text-muted mt-3 d-block">We respect your privacy. Unsubscribe at any time.</small>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
