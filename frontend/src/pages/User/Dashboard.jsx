import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, Button, 
  Modal, ModalHeader, ModalBody, ModalFooter, Form, 
  FormGroup, Label, Input, Alert, Spinner, Nav, NavItem, 
  NavLink, TabContent, TabPane, Table, Badge
} from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  
  // Edit Profile Modal
  const [editModal, setEditModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  
  // Delete Account Modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Populate form with user data
    setProfileForm({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      address: parsedUser.address || '',
      city: parsedUser.city || '',
      postalCode: parsedUser.postalCode || ''
    });
    
    setLoading(false);
  }, [navigate]);
  
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  
  const toggleEditModal = () => {
    setEditModal(!editModal);
    setUpdateError('');
    setUpdateSuccess('');
    setFormErrors({});
  };
  
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!profileForm.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileForm.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;
    
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/profile/${user._id}`,
        profileForm
      );
      
      if (response.data.code === 200) {
        // Update user in localStorage
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setUpdateSuccess('Profile updated successfully!');
        setTimeout(() => {
          toggleEditModal();
        }, 1500);
      } else {
        setUpdateError(response.data.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setUpdateError(error.response?.data?.data?.message || 'An error occurred while updating profile');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/users/profile/${user._id}`
      );
      
      if (response.data.code === 200) {
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(response.data.data.message || 'Failed to delete account');
        toggleDeleteModal();
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setError(error.response?.data?.data?.message || 'An error occurred while deleting account');
      toggleDeleteModal();
    } finally {
      setDeleteLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }
  
  return (
    <Container className="dashboard-container py-5">
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow profile-card">
            <CardBody className="text-center">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h3 className="mt-3">{user.name}</h3>
              <p className="text-muted">{user.email}</p>
              <div className="d-grid gap-2 mt-4">
                <Button color="primary" onClick={toggleEditModal}>
                  Edit Profile
                </Button>
                <Link to="/user/my-orders" className="btn btn-success">
                  My Orders
                </Link>
                <Button color="danger" outline onClick={toggleDeleteModal}>
                  Delete Account
                </Button>
                <Button color="secondary" outline onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow">
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === '1' ? 'active' : ''}
                    onClick={() => toggleTab('1')}
                  >
                    Profile Details
                  </NavLink>
                </NavItem> 
              </Nav>
              
              <TabContent activeTab={activeTab} className="pt-4">
                <TabPane tabId="1">
                  <h4 className="mb-4">Profile Information</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">Full Name</p>
                      <p className="fw-bold">{user.name}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">Email Address</p>
                      <p className="fw-bold">{user.email}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">Phone Number</p>
                      <p className="fw-bold">{user.phone || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">Member Since</p>
                      <p className="fw-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </Col>
                  </Row>
                  
                  <h4 className="mb-4 mt-4">Address Information</h4>
                  <Row>
                    <Col md={12} className="mb-3">
                      <p className="text-muted mb-1">Address</p>
                      <p className="fw-bold">{user.address || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">City</p>
                      <p className="fw-bold">{user.city || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p className="text-muted mb-1">Postal Code</p>
                      <p className="fw-bold">{user.postalCode || 'Not provided'}</p>
                    </Col>
                  </Row>
                </TabPane> 
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Profile Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Profile</ModalHeader>
        <ModalBody>
          {updateError && (
            <Alert color="danger" className="mb-4">
              {updateError}
            </Alert>
          )}
          
          {updateSuccess && (
            <Alert color="success" className="mb-4">
              {updateSuccess}
            </Alert>
          )}
          
          <Form>
            <FormGroup>
              <Label for="name">Full Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                invalid={!!formErrors.name}
              />
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
            </FormGroup>
            
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                invalid={!!formErrors.email}
              />
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
            </FormGroup>
            
            <FormGroup>
              <Label for="phone">Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                invalid={!!formErrors.phone}
              />
              {formErrors.phone && <div className="text-danger">{formErrors.phone}</div>}
            </FormGroup>
            
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={profileForm.address}
                onChange={handleProfileChange}
              />
            </FormGroup>
            
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    value={profileForm.city}
                    onChange={handleProfileChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="postalCode">Postal Code</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    value={profileForm.postalCode}
                    onChange={handleProfileChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleUpdateProfile}
            disabled={updateLoading}
          >
            {updateLoading ? <Spinner size="sm" /> : 'Save Changes'}
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Account</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p className="text-danger fw-bold">All your data will be permanently removed.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button 
            color="danger" 
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner size="sm" /> : 'Delete Account'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}
export default Dashboard;
