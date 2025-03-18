import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardTitle, CardText, Button, Modal, ModalHeader, 
  ModalBody, Form, FormGroup, Label, Input, Row, Col, Alert,
  Container, Badge, CardHeader, CardFooter
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/v1/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("response",response)
      // Update this to match the backend response structure
      const { data } = response.data;
      setUserData({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phone
      });
    } catch (error) {
      setError('Failed to fetch user data');
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
};



  const toggleModal = () => {
    setModal(!modal);
    setError('');
    setSuccess('');
  };

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      // Split name into firstName and lastName
      const [firstName, lastName] = userData.name.split(' ');
      
      const updateData = {
        firstName,
        lastName,
        email: userData.email,
        phone: userData.contact,
        password: userData.password
      };

      const response = await axios.put('http://localhost:4000/api/v1/user/update', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        setTimeout(() => {
          toggleModal();
          fetchUserData(); // Refresh user data
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    }
  };


const handleDelete = async () => {
    try {
      if (!confirmPassword) {
        setError('Please enter your password to confirm deletion');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:4000/api/v1/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { password: confirmPassword }
      });

      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Account deletion failed');
    }
};


  const navigationCards = [
    { title: 'My Orders', icon: '📦', path: '/orders', color: 'info' },
    { title: 'My Wishlist', icon: '❤️', path: '/wishlist', color: 'success' },
    { title: 'Browse Cakes', icon: '🎂', path: '/cakes', color: 'primary' },
    { title: 'Special Offers', icon: '🎉', path: '/offers', color: 'warning' }
  ];

  return (
    <Container className="py-5 mt-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <CardHeader className="bg-primary text-white">
              <h4 className="mb-0">Welcome, {userData.name}!</h4>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={8}>
                  <CardText>
                    <strong>Email:</strong> {userData.email}<br />
                    <strong>Contact:</strong> {userData.contact}
                  </CardText>
                </Col>
                <Col md={4} className="text-end">
                  <Button color="primary" onClick={toggleModal} className="me-2">
                    Edit Profile
                  </Button>
                </Col>
              </Row>
            </CardBody>

          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        {navigationCards.map((card, index) => (
          <Col md={3} sm={6} className="mb-3" key={index}>
            <Card 
              className="h-100 shadow-sm text-center hover-lift"
              onClick={() => navigate(card.path)}
              style={{ cursor: 'pointer' }}
            >
              <CardBody>
                <h1>{card.icon}</h1>
                <CardTitle tag="h5">{card.title}</CardTitle>
                <Badge color={card.color} pill>Click to view</Badge>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-danger mt-5">
        <CardHeader className="bg-danger text-white">
          <h5 className="mb-0">⚠️ Danger Zone</h5>
        </CardHeader>
        <CardBody>
          <CardText>
            Once you delete your account, there is no going back. Please be certain.
          </CardText>
          <Button color="danger" onClick={toggleDeleteModal}>
            Delete Account
          </Button>
        </CardBody>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Edit Profile</ModalHeader>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input type="text" name="name" value={userData.name} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" name="email" value={userData.email} onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="contact">Contact</Label>
                  <Input type="text" name="contact" value={userData.contact} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="password">New Password (optional)</Label>
                  <Input type="password" name="password" value={userData.password} onChange={handleChange} />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" onClick={handleUpdate} className="w-100">
              Update Profile
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal} className="bg-danger text-white">
          Confirm Account Deletion
        </ModalHeader>
        <ModalBody>
          <Alert color="warning">
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          <FormGroup>
            <Label for="confirmPassword">Enter your password to confirm</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormGroup>
          <Button color="danger" onClick={handleDelete} className="w-100">
            Permanently Delete Account
          </Button>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Dashboard;
