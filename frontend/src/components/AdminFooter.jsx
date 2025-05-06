import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-3 mb-md-0 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <span className="h5 mb-0 me-2">🍰</span>
              <div>
                <div className="fw-bold">HOLY SPATULA</div>
                <div className="small text-primary">Administration System</div>
              </div>
            </div>
          </Col>
          
          <Col md={6} className="text-center text-md-end">
            <div className="mb-2">
              <small>
                <p className="text-white mb-0">Admin Panel v1.0.0</p>
              </small>            </div>
            <small className="text-white">
              &copy; {currentYear} Sweet Delights Admin Panel. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AdminFooter;
