import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody,
  Button, Table, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Alert, Spinner, Badge
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [modal, setModal] = useState(false);
  const [modalAction, setModalAction] = useState('create'); // 'create' or 'edit'
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Deletion confirmation modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:4000/api/users/admin');
      
      if (response.data.code === 200) {
        setAdmins(response.data.data.admins);
      } else {
        setError(response.data.data.message || 'Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError(error.response?.data?.data?.message || 'An error occurred while fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      // Reset form data when closing modal
      resetForm();
    }
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = 'Name is required';
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (modalAction === 'create' && !formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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

  const handleCreateClick = () => {
    setModalAction('create');
    resetForm();
    toggleModal();
  };

  const handleEditClick = (admin) => {
    setModalAction('edit');
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', // Don't populate password for security
      phone: admin.phone
    });
    toggleModal();
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    toggleDeleteModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      
      if (modalAction === 'create') {
        response = await axios.post('http://localhost:4000/api/users/admin', formData);
      } else { // edit
        response = await axios.put(`http://localhost:4000/api/users/admin/${currentAdmin._id}`, formData);
      }
      
      if (response.data.code === 200 || response.data.code === 201) {
        setSuccess(modalAction === 'create' ? 'Admin created successfully!' : 'Admin updated successfully!');
        toggleModal();
        fetchAdmins(); // Refresh the admins list
      } else {
        setError(response.data.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Admin operation error:', error);
      setError(error.response?.data?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.delete(`http://localhost:4000/api/users/admin/${adminToDelete._id}`);
      
      if (response.data.code === 200) {
        setSuccess('Admin deleted successfully!');
        toggleDeleteModal();
        fetchAdmins(); // Refresh the admins list
      } else {
        setError(response.data.data.message || 'Deletion failed');
      }
    } catch (error) {
      console.error('Admin deletion error:', error);
      setError(error.response?.data?.data?.message || 'An error occurred during deletion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="my-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Management</h2>
        <Button color="primary" onClick={handleCreateClick}>
          <i className="fas fa-plus me-1"></i> Create New Admin
        </Button>
      </div>
      
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert color="success" className="mb-4">
          {success}
        </Alert>
      )}
      
      <Card className="shadow-sm">
        <CardHeader className="bg-light">
          <h5 className="mb-0">Administrators</h5>
        </CardHeader>
        <CardBody>
          {loading && !admins.length ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No administrators found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2 bg-primary">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h6 className="mb-0">{admin.name}</h6>
                          </div>
                        </div>
                      </td>
                      <td>{admin.email}</td>
                      <td>{admin.phone}</td>
                      <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2" 
                          onClick={() => handleEditClick(admin)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm" 
                          onClick={() => handleDeleteClick(admin)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
      
      {/* Create/Edit Admin Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {modalAction === 'create' ? 'Create New Admin' : 'Edit Admin'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter admin name"
                value={formData.name}
                onChange={handleChange}
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
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                invalid={!!formErrors.email}
              />
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
            </FormGroup>
            
            <FormGroup>
              <Label for="password">
                Password
                {modalAction === 'edit' && <span className="text-muted ms-1">(Leave blank to keep current)</span>}
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder={modalAction === 'create' ? "Enter password" : "Enter new password (optional)"}
                value={formData.password}
                onChange={handleChange}
                invalid={!!formErrors.password}
              />
              {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
            </FormGroup>
            
            <FormGroup>
              <Label for="phone">Phone Number</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                invalid={!!formErrors.phone}
              />
              {formErrors.phone && <div className="text-danger">{formErrors.phone}</div>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : modalAction === 'create' ? 'Create' : 'Update'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the admin <strong>{adminToDelete?.name}</strong>?
          This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
      
      <style>
        {`
          .avatar-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
        `}
      </style>
    </Container>
  );
};

export default AdminManagement;
