import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, CardHeader, CardBody,
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Alert, Spinner, Badge
} from 'reactstrap';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

const DeliveryPersonsPage = () => {
  // State for delivery persons list
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for cities (for dropdown)
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  
  // State for add/edit modal
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Add Delivery Person');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    nic: '',
    city: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [personToDelete, setPersonToDelete] = useState(null);
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchDeliveryPersons();
    fetchCities();
  }, []);

  // Fetch all delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:4000/api/delivery-persons');
      
      if (response.data.code === 200) {
        setDeliveryPersons(response.data.data.deliveryPersons || []);
      } else {
        setError('Failed to load delivery persons');
      }
    } catch (error) {
      console.error('Error fetching delivery persons:', error);
      setError('An error occurred while loading delivery persons');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all cities for dropdown
  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      
      const response = await axios.get('http://localhost:4000/api/cities');
      
      if (response.data.code === 200) {
        setCities(response.data.data.cities || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Toggle add/edit modal
  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setFormErrors({});
      setFormSuccess('');
    } else {
      // Reset form when closing
      resetForm();
    }
  };

  // Toggle delete modal
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
    if (deleteModal) {
      setPersonToDelete(null);
      setDeleteError('');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      contact: '',
      nic: '',
      city: '',
      isActive: true
    });
    setFormErrors({});
    setFormSuccess('');
    setEditMode(false);
    setCurrentId(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!editMode && !formData.password) {
      errors.password = 'Password is required';
    } else if (!editMode && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.contact) {
      errors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact.replace(/[^0-9]/g, ''))) {
      errors.contact = 'Contact number must be 10 digits';
    }
    
    if (!formData.nic.trim()) {
      errors.nic = 'NIC is required';
    }
    
    if (!formData.city) {
      errors.city = 'City is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open modal for adding new delivery person
  const handleAddNew = () => {
    setModalTitle('Add Delivery Person');
    resetForm();
    toggleModal();
  };

  // Open modal for editing delivery person
  const handleEdit = (person) => {
    setModalTitle('Edit Delivery Person');
    setEditMode(true);
    setCurrentId(person._id);
    
    setFormData({
      name: person.name,
      email: person.email,
      password: '', // Don't populate password for security
      contact: person.contact,
      nic: person.nic,
      city: person.city._id,
      isActive: person.isActive
    });
    
    toggleModal();
  };

  // Open modal for deleting delivery person
  const handleDeleteClick = (person) => {
    setPersonToDelete(person);
    toggleDeleteModal();
  };

  // Submit form for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormLoading(true);
    setFormSuccess('');
    setFormErrors({});
    
    try {
      let response;
      
      if (editMode) {
        // Update existing delivery person
        const updateData = { ...formData };
        
        // Only include password if it's provided
        if (!updateData.password) {
          delete updateData.password;
        }
        
        response = await axios.put(
          `http://localhost:4000/api/delivery-persons/${currentId}`,
          updateData
        );
      } else {
        // Create new delivery person
        response = await axios.post(
          'http://localhost:4000/api/delivery-persons',
          formData
        );
      }
      
      if (response.data.code === 200 || response.data.code === 201) {
        setFormSuccess(editMode ? 'Delivery person updated successfully!' : 'Delivery person added successfully!');
        
        // Refresh the list
        fetchDeliveryPersons();
        
        // Close the modal after a brief delay to show success message
        setTimeout(() => {
          toggleModal();
        }, 1000);
      } else {
        setFormErrors({
          form: response.data.data.message || 'Operation failed'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle validation errors from backend
      if (error.response && error.response.data) {
        setFormErrors({
          form: error.response.data.data?.message || 'An error occurred'
        });
      } else {
        setFormErrors({
          form: 'An error occurred. Please try again.'
        });
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Delete delivery person
  const handleDelete = async () => {
    if (!personToDelete) return;
    
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/delivery-persons/${personToDelete._id}`
      );
      
      if (response.data.code === 200) {
        // Remove from list
        setDeliveryPersons(deliveryPersons.filter(p => p._id !== personToDelete._id));
        toggleDeleteModal();
      } else {
        setDeleteError(response.data.data.message || 'Failed to delete delivery person');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError(error.response?.data?.data?.message || 'An error occurred while deleting');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle delivery person active status
  const handleToggleStatus = async (person) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/delivery-persons/${person._id}`,
        { isActive: !person.isActive }
      );
      
      if (response.data.code === 200) {
        // Update the list
        setDeliveryPersons(deliveryPersons.map(p => 
          p._id === person._id ? { ...p, isActive: !p.isActive } : p
        ));
      } else {
        setError('Failed to update status');
      }
    } catch (error) {
      console.error('Status toggle error:', error);
      setError('An error occurred while updating status');
    }
  };

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Manage Delivery Persons</h1>
      
      {error && (
        <Alert color="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Delivery Persons</h5>
          <Button color="primary" onClick={handleAddNew}>
            <FaPlus className="me-1" /> Add New Delivery Person
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-3">Loading delivery persons...</p>
            </div>
          ) : deliveryPersons.length === 0 ? (
            <div className="text-center py-5">
              <p className="mb-4">No delivery persons found</p>
              <Button color="primary" onClick={handleAddNew}>
                Add Your First Delivery Person
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>NIC</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryPersons.map(person => (
                    <tr key={person._id}>
                      <td>{person.name}</td>
                      <td>{person.email}</td>
                      <td>{person.contact}</td>
                      <td>{person.nic}</td>
                      <td>{person.city.name}</td>
                      <td>
                        <Badge color={person.isActive ? 'success' : 'danger'}>
                          {person.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleEdit(person)}
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          color={person.isActive ? 'warning' : 'success'} 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleToggleStatus(person)}
                          title={person.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {person.isActive ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(person)}
                          title="Delete"
                        >
                          <FaTrash />
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
      
      {/* Add/Edit Modal */}
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>{modalTitle}</ModalHeader>
        <ModalBody>
          {formErrors.form && (
            <Alert color="danger" className="mb-4">
              {formErrors.form}
            </Alert>
          )}
          
          {formSuccess && (
            <Alert color="success" className="mb-4">
              {formSuccess}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Full Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    invalid={!!formErrors.name}
                  />
                  {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email Address *</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    invalid={!!formErrors.email}
                  />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="password">
                  Password {editMode ? '(Leave blank to keep current)' : '*'}
                  </Label>
                  <div className="input-group">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      invalid={!!formErrors.password}
                    />
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="contact">Contact Number *</Label>
                  <Input
                    type="text"
                    name="contact"
                    id="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    invalid={!!formErrors.contact}
                  />
                  {formErrors.contact && <div className="text-danger">{formErrors.contact}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="nic">NIC Number *</Label>
                  <Input
                    type="text"
                    name="nic"
                    id="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    invalid={!!formErrors.nic}
                    disabled={editMode} // NIC cannot be changed once set
                  />
                  {formErrors.nic && <div className="text-danger">{formErrors.nic}</div>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city">City *</Label>
                  <Input
                    type="select"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    invalid={!!formErrors.city}
                    disabled={loadingCities}
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>
                        {city.name} ({city.district})
                      </option>
                    ))}
                  </Input>
                  {loadingCities && <small className="text-muted">Loading cities...</small>}
                  {formErrors.city && <div className="text-danger">{formErrors.city}</div>}
                </FormGroup>
              </Col>
            </Row>
            
            <FormGroup check className="mb-3">
              <Label check>
                <Input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />{' '}
                Active Status
              </Label>
              <small className="form-text text-muted d-block">
                Inactive delivery persons cannot log in or receive new orders
              </small>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={formLoading}
          >
            {formLoading ? <Spinner size="sm" /> : (editMode ? 'Update' : 'Add')}
          </Button>
        </ModalFooter>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          {deleteError && (
            <Alert color="danger" className="mb-4">
              {deleteError}
            </Alert>
          )}
          
          {personToDelete && (
            <>
              <p>Are you sure you want to delete the following delivery person?</p>
              <div className="bg-light p-3 rounded mb-3">
                <p className="mb-1"><strong>Name:</strong> {personToDelete.name}</p>
                <p className="mb-1"><strong>Email:</strong> {personToDelete.email}</p>
                <p className="mb-1"><strong>Contact:</strong> {personToDelete.contact}</p>
                <p className="mb-0"><strong>NIC:</strong> {personToDelete.nic}</p>
              </div>
              <p className="text-danger">This action cannot be undone. All associated data will be permanently removed.</p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button 
            color="danger" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default DeliveryPersonsPage;
