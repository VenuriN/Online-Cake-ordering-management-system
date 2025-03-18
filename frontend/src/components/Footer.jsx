
import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h4 className="mb-4 text-primary">Holy Spatula</h4>
            <p className="text-white">
              Delivering happiness to your doorstep. Enjoy the finest selection of cakes from top-rated restaurants in your area.
            </p>
            <div className="d-flex gap-3 mt-4">
              <Button color="light" className="rounded-circle p-2">
                <FaFacebook className="text-primary" />
              </Button>
              <Button color="light" className="rounded-circle p-2">
                <FaTwitter className="text-info" />
              </Button>
              <Button color="light" className="rounded-circle p-2">
                <FaInstagram className="text-danger" />
              </Button>
              <Button color="light" className="rounded-circle p-2">
                <FaLinkedin className="text-primary" />
              </Button>
              <Button color="light" className="rounded-circle p-2">
                <FaGithub className="text-dark" />
              </Button>
            </div>
          </Col>

          <Col md={2}>
            <h5 className="mb-4 text-primary">Quick Links</h5>
            <ListGroup flush className="border-0">
              <ListGroupItem tag={Link} to="/" className="bg-transparent text-light border-0 ps-0 pt-0">Home</ListGroupItem>
              <ListGroupItem tag={Link} to="/about" className="bg-transparent text-light border-0 ps-0">About</ListGroupItem>
              <ListGroupItem tag={Link} to="/menu" className="bg-transparent text-light border-0 ps-0">Menu</ListGroupItem>
              <ListGroupItem tag={Link} to="/contact" className="bg-transparent text-light border-0 ps-0">Contact</ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={3}>
            <h5 className="mb-4 text-primary">Opening Hours</h5>
            <ListGroup flush className="border-0">
              <ListGroupItem className="bg-transparent text-light border-0 ps-0 pt-0">Monday - Friday: 8am - 10pm</ListGroupItem>
              <ListGroupItem className="bg-transparent text-light border-0 ps-0">Saturday: 9am - 11pm</ListGroupItem>
              <ListGroupItem className="bg-transparent text-light border-0 ps-0">Sunday: 10am - 9pm</ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={3}>
            <h5 className="mb-4 text-primary">Contact Info</h5>
            <ListGroup flush className="border-0">
              <ListGroupItem className="bg-transparent text-light border-0 ps-0 pt-0">
                <FaMapMarkerAlt className="me-2 text-primary" />
                123 Food Street, Cuisine City
              </ListGroupItem>
              <ListGroupItem className="bg-transparent text-light border-0 ps-0">
                <FaPhone className="me-2 text-primary" />
                +1 234 567 8900
              </ListGroupItem>
              <ListGroupItem className="bg-transparent text-light border-0 ps-0">
                <FaEnvelope className="me-2 text-primary" />
                info@fooddelivery.com
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="text-center border-top pt-4">
            <p className="mb-0 text-muted">
              © {new Date().getFullYear()} Food Delivery. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
