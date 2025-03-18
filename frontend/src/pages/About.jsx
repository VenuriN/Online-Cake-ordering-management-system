import React from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardTitle, 
  CardText, Button, Badge, Progress
} from 'reactstrap';
import { motion } from 'framer-motion';
import { 
  FaBirthdayCake, FaHistory, FaUsers, FaMedal, 
  FaLeaf, FaHeart, FaHandsHelping, FaGlobe,
  FaUtensils, FaGraduationCap, FaShieldAlt, FaStar
} from 'react-icons/fa';
import Logo from '../assets/logo.jpg'
const AboutUs = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="about-us">      
      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={fadeIn.initial}
                animate={fadeIn.animate}
                transition={fadeIn.transition}
              >
                <h1 className="display-4 fw-bold mb-4">Our Sweet Story</h1>
                <p className="lead mb-4">
                  Welcome to Sweet Delights Bakery, where passion for baking meets artistry and tradition.
                  For over two decades, we've been crafting memorable desserts for life's special moments.
                </p>
                <div className="d-flex align-items-center mb-4">
                  <Badge color="primary" pill className="me-2 px-3 py-2">Est. 2003</Badge>
                  <Badge color="secondary" pill className="me-2 px-3 py-2">Family Owned</Badge>
                  <Badge color="info" pill className="px-3 py-2">Award Winning</Badge>
                </div>
                <Button color="primary" size="lg" className="rounded-pill px-4">
                  <FaUtensils className="me-2" /> View Our Menu
                </Button>
              </motion.div>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="position-relative">
                  <img 
                    src={Logo}
                    alt="Sweet Delights Bakery Team" 
                    className="img-fluid rounded-3 shadow"
                    style={{ objectFit: 'cover', height: '400px', width: '100%' }}
                  />
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
                    style={{ 
                      background: 'linear-gradient(to right, rgba(255,133,162,0.3), rgba(255,195,215,0.3))',
                      pointerEvents: 'none'
                    }}
                  ></div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Journey Section */}
      <section className="py-5">
        <Container>
          <motion.div
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            transition={fadeIn.transition}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Our Journey</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              From a small family kitchen to becoming the city's favorite bakery, our journey has been as sweet as our creations.
            </p>
          </motion.div>

          <Row className="g-4">
            {[
              {
                year: '2003',
                title: 'Humble Beginnings',
                description: 'Started as a small home bakery with just three signature cake recipes passed down through generations.',
                icon: FaHistory,
                color: 'primary'
              },
              {
                year: '2008',
                title: 'First Storefront',
                description: 'Opened our first physical store in downtown Sweet City, expanding our menu to include cupcakes and pastries.',
                icon: FaStore,
                color: 'info'
              },
              {
                year: '2015',
                title: 'Award-Winning Recipes',
                description: 'Won the National Bakery Award for our innovative cake designs and commitment to quality ingredients.',
                icon: FaMedal,
                color: 'warning'
              },
              {
                year: '2020',
                title: 'Expansion & Online Presence',
                description: 'Launched our online ordering system and expanded to three locations across the city to serve more customers.',
                icon: FaGlobe,
                color: 'success'
              }
            ].map((milestone, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow h-100 text-center">
                    <div className={`bg-${milestone.color} text-white p-3 rounded-top d-flex align-items-center justify-content-center`} style={{ height: '100px' }}>
                      <milestone.icon size={40} />
                    </div>
                    <CardBody>
                      <Badge color={milestone.color} pill className="mb-2 px-3 py-2">{milestone.year}</Badge>
                      <CardTitle tag="h4" className="mb-3">{milestone.title}</CardTitle>
                      <CardText>{milestone.description}</CardText>
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
            <Button color="outline-primary" size="lg" className="rounded-pill px-4">
              <FaHistory className="me-2" /> Read Our Full Story
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            transition={fadeIn.transition}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Meet Our Team</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              The talented individuals behind our delicious creations, each bringing their unique expertise and passion.
            </p>
          </motion.div>

          <Row className="g-4">
            {[
              {
                name: 'Maria Rodriguez',
                role: 'Head Pastry Chef',
                bio: 'With 15 years of experience and training in Paris, Maria brings creativity and precision to every creation.',
                expertise: ['Wedding Cakes', 'French Pastries', 'Chocolate Work'],
                image: '/images/chef-1.jpg'
              },
              {
                name: 'David Chen',
                role: 'Master Baker',
                bio: 'David specializes in artisanal bread and traditional baking techniques passed down through generations.',
                expertise: ['Artisanal Bread', 'Sourdough', 'Pastry Dough'],
                image: '/images/chef-2.jpg'
              },
              {
                name: 'Sarah Johnson',
                role: 'Cake Designer',
                bio: 'An artist at heart, Sarah transforms concepts into stunning edible masterpieces for special occasions.',
                expertise: ['3D Cakes', 'Fondant Work', 'Edible Art'],
                image: '/images/chef-3.jpg'
              },
              {
                name: 'Michael Thompson',
                role: 'Dessert Specialist',
                bio: 'Michaels innovative approach to classic desserts has created many of our signature menu items.',
                expertise: ['Fusion Desserts', 'Plated Desserts', 'Dietary Alternatives'],
                image: '/images/chef-4.jpg'
              }
            ].map((member, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="border-0 shadow h-100">
                    <div className="position-relative">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="card-img-top"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                        style={{ 
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
                          borderBottomLeftRadius: 'calc(0.375rem - 1px)',
                          borderBottomRightRadius: 'calc(0.375rem - 1px)'
                        }}>
                        <h5 className="text-white mb-0">{member.name}</h5>
                        <p className="text-white-50 mb-0">{member.role}</p>
                      </div>
                    </div>
                    <CardBody>
                      <CardText>{member.bio}</CardText>
                      <div>
                        <p className="fw-bold mb-2">Specialties:</p>
                        {member.expertise.map((skill, i) => (
                          <Badge 
                            color="primary" 
                            pill 
                            className="me-2 mb-2 bg-opacity-75" 
                            key={i}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Our Values & Quality Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={fadeIn.initial}
                whileInView={fadeIn.animate}
                transition={fadeIn.transition}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">Our Values & Quality</h2>
                <p className="lead mb-4">
                  At Sweet Delights, we believe in creating more than just desserts. We craft experiences, memories, and moments of joy through our commitment to excellence.
                </p>
                
                <div className="mb-4">
                  {[
                    { name: 'Premium Ingredients', value: 100, color: 'primary' },
                    { name: 'Sustainable Practices', value: 90, color: 'success' },
                    { name: 'Handcrafted Quality', value: 100, color: 'info' },
                    { name: 'Customer Satisfaction', value: 95, color: 'warning' }
                  ].map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <Progress
                        value={item.value}
                        color={item.color}
                        className="rounded-pill"
                        style={{ height: '10px' }}
                      />
                    </div>
                  ))}
                </div>
                
                <p className="mb-4">
                  We're proud to source locally whenever possible, supporting our community's farmers and producers while ensuring the freshest ingredients for our customers.
                </p>
                
                <Button color="primary" size="lg" className="rounded-pill px-4">
                  <FaLeaf className="me-2" /> Our Sustainability Pledge
                </Button>
              </motion.div>
            </Col>
            
            <Col lg={6} className="mt-5 mt-lg-0">
              <Row className="g-4">
                {[
                  {
                    title: 'Premium Ingredients',
                    description: 'We use only the finest ingredients, sourcing locally and organically whenever possible.',
                    icon: FaLeaf,
                    color: 'success'
                  },
                  {
                    title: 'Made with Love',
                    description: 'Every item is handcrafted with attention to detail and a passion for perfection.',
                    icon: FaHeart,
                    color: 'danger'
                  },
                  {
                    title: 'Community Focus',
                    description: 'We actively participate in community events and support local charitable initiatives.',
                    icon: FaHandsHelping,
                    color: 'info'
                  },
                  {
                    title: 'Continuous Learning',
                    description: 'Our team regularly trains with master bakers to bring you the latest techniques and flavors.',
                    icon: FaGraduationCap,
                    color: 'warning'
                  }
                ].map((value, index) => (
                  <Col sm={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow h-100">
                        <CardBody className="text-center p-4">
                          <div className={`rounded-circle bg-${value.color} bg-opacity-10 p-3 d-inline-flex mb-3`}>
                            <value.icon size={30} className={`text-${value.color}`} />
                            </div>
                          <CardTitle tag="h4" className="mb-3">{value.title}</CardTitle>
                          <CardText>{value.description}</CardText>
                        </CardBody>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Certifications & Achievements Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={fadeIn.initial}
            whileInView={fadeIn.animate}
            transition={fadeIn.transition}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">Certifications & Achievements</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Our commitment to excellence has been recognized through various awards and certifications over the years.
            </p>
          </motion.div>

          <Row className="g-4">
            <Col lg={8}>
              <Row className="g-4">
                {[
                  {
                    year: '2022',
                    award: 'Best Bakery in Sweet City',
                    organization: 'City Food & Beverage Association',
                    description: 'Recognized for exceptional quality, service, and innovation in the bakery category.'
                  },
                  {
                    year: '2021',
                    award: 'Master Baker Certification',
                    organization: 'International Baking Institute',
                    description: 'Our head baker David Chen received the prestigious Master Baker certification after rigorous testing.'
                  },
                  {
                    year: '2019',
                    award: 'Wedding Cake Designer of the Year',
                    organization: 'Wedding Industry Awards',
                    description: 'Sarah Johnson was recognized for her outstanding wedding cake designs and customer satisfaction.'
                  },
                  {
                    year: '2018',
                    award: 'Sustainable Business Certification',
                    organization: 'Green Business Alliance',
                    description: 'Awarded for our commitment to sustainable practices and reducing environmental impact.'
                  }
                ].map((achievement, index) => (
                  <Col md={6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow h-100">
                        <CardBody>
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary rounded-circle p-2 me-3">
                              <FaStar className="text-white" />
                            </div>
                            <div>
                              <Badge color="primary" pill className="mb-1">{achievement.year}</Badge>
                              <h5 className="mb-0">{achievement.award}</h5>
                            </div>
                          </div>
                          <p className="text-muted mb-2">{achievement.organization}</p>
                          <CardText>{achievement.description}</CardText>
                        </CardBody>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Col>
            
            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow h-100 bg-primary text-white">
                  <CardBody className="p-4">
                    <div className="text-center mb-4">
                      <FaShieldAlt size={50} />
                      <h3 className="mt-3">Our Certifications</h3>
                    </div>
                    
                    <div className="mb-4">
                      {[
                        'Food Safety Certification',
                        'Organic Ingredients Verified',
                        'Allergen Management Certified',
                        'Sustainable Business Practices',
                        'Fair Trade Partner',
                        'Gluten-Free Certified'
                      ].map((cert, index) => (
                        <div key={index} className="d-flex align-items-center mb-3">
                          <div className="bg-white rounded-circle p-1 me-3">
                            <FaCheck className="text-primary" />
                          </div>
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Button color="light" className="rounded-pill px-4 text-primary">
                        View All Certifications
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-5"
          >
            <p className="lead">
              Want to learn more about our bakery or have questions?
            </p>
            <Button color="primary" size="lg" className="rounded-pill px-4 me-3">
              Contact Us
            </Button>
            <Button color="outline-primary" size="lg" className="rounded-pill px-4">
              FAQ
            </Button>
          </motion.div>
        </Container>
      </section>
      
      {/* Testimonials & Community Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={5}>
              <motion.div
                initial={fadeIn.initial}
                whileInView={fadeIn.animate}
                transition={fadeIn.transition}
                viewport={{ once: true }}
              >
                <h2 className="display-5 fw-bold mb-4">What Our Community Says</h2>
                <p className="lead mb-4">
                  We're honored to be part of our customers' special moments and everyday joys. Here's what they have to say about Sweet Delights.
                </p>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="me-4 text-center">
                    <h3 className="display-4 fw-bold text-primary mb-0">4.9</h3>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-warning" />
                      ))}
                    </div>
                    <p className="mb-0 text-muted">500+ Reviews</p>
                  </div>
                  <div>
                    <div className="mb-2">
                      <span className="me-2">Quality</span>
                      <Progress value={98} color="primary" style={{ height: '8px' }} className="rounded-pill" />
                    </div>
                    <div className="mb-2">
                      <span className="me-2">Service</span>
                      <Progress value={95} color="primary" style={{ height: '8px' }} className="rounded-pill" />
                    </div>
                    <div>
                      <span className="me-2">Value</span>
                      <Progress value={92} color="primary" style={{ height: '8px' }} className="rounded-pill" />
                    </div>
                  </div>
                </div>
                
                <Button color="primary" outline className="rounded-pill px-4">
                  Read All Reviews
                </Button>
              </motion.div>
            </Col>
            
            <Col lg={7} className="mt-5 mt-lg-0">
              <Row className="g-4">
                {[
                  {
                    name: 'Jennifer L.',
                    date: 'May 15, 2023',
                    text: 'The birthday cake Sweet Delights made for my daughter was absolutely perfect! Not only was it beautiful, but it tasted amazing. Everyone at the party was asking where we got it.',
                    rating: 5
                  },
                  {
                    name: 'Robert T.',
                    date: 'March 3, 2023',
                    text: 'As someone with celiac disease, finding delicious gluten-free options has always been a challenge. Sweet Delights gluten-free cakes are the best I have ever had - you can not tell the difference!',
                    rating: 5
                  },
                  {
                    name: 'Aisha M.',
                    date: 'January 22, 2023',
                    text: 'Our wedding cake was a dream come true! The design process was so fun, and Sarah really listened to what we wanted. The cake was a showstopper and tasted even better than it looked.',
                    rating: 5
                  }
                ].map((review, index) => (
                  <Col md={index === 2 ? 12 : 6} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow h-100">
                        <CardBody>
                          <div className="d-flex justify-content-between mb-3">
                            <div>
                              <h5 className="mb-0">{review.name}</h5>
                              <small className="text-muted">{review.date}</small>
                            </div>
                            <div>
                              {[...Array(review.rating)].map((_, i) => (
                                <FaStar key={i} className="text-warning" />
                              ))}
                            </div>
                          </div>
                          <CardText>{review.text}</CardText>
                        </CardBody>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-4"
          >
            <h2 className="display-5 fw-bold mb-3">Ready to Experience Sweet Delights?</h2>
            <p className="lead mb-4">
              Whether you're celebrating a special occasion or simply craving something sweet, we're here to make your day a little sweeter.
            </p>
            <Button color="light" size="lg" className="rounded-pill px-5 py-3 fw-bold text-primary me-3">
              Order Online
            </Button>
            <Button color="outline-light" size="lg" className="rounded-pill px-5 py-3">
              Visit Our Bakery
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

// Missing icon definition
const FaStore = (props) => {
  return (
    <svg 
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 576 512" 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M602 118.6L537.1 15C531.3 5.7 521 0 510 0H106C95 0 84.7 5.7 78.9 15L14 118.6c-33.5 53.5-3.8 127.9 58.8 136.4 4.5.6 9.1.9 13.7.9 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18 20.1 44.3 33.1 73.8 33.1 29.6 0 55.8-13 73.8-33.1 18.1 20.1 44.3 33.1 73.8 33.1 4.7 0 9.2-.3 13.7-.9 62.8-8.4 92.6-82.8 59-136.4zM529.5 288c-10 0-19.9-1.5-29.5-3.8V384H116v-99.8c-9.6 2.2-19.5 3.8-29.5 3.8-6 0-12.1-.4-18-1.2-5.6-.8-11.1-2.1-16.4-3.6V480c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32V283.2c-5.4 1.6-10.8 2.9-16.4 3.6-6.1.8-12.1 1.2-18.2 1.2z"></path>
    </svg>
  );
};

// Missing icon definition
const FaCheck = (props) => {
  return (
    <svg 
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 512 512" 
      height="1em" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
    </svg>
  );
};

export default AboutUs;
