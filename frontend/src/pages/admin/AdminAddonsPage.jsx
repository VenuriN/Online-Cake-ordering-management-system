import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, Table, 
  Button, Spinner, Alert, Row, Col, Modal, ModalHeader, 
  ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';

const AdminAddonsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addons, setAddons] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:4000/api/addons');
      
      if (response.data.code === 200) {
        setAddons(response.data.data.addons || []);
      } else {
        setError('Failed to load addons');
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
      setError('An error occurred while loading addons');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      // Reset form when opening
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: null
      });
      setFormError('');
      setFormSuccess('');
    }
  };

  const toggleEditModal = (addon = null) => {
    setEditModal(!editModal);
    if (addon) {
      setEditId(addon._id);
      setFormData({
        name: addon.name,
        description: addon.description || '',
        price: addon.price || 0,
        image: null // Don't set image when editing
      });
      setFormError('');
      setFormSuccess('');
    }
  };

  const toggleDeleteModal = (id = null) => {
    setDeleteModal(!deleteModal);
    if (id) {
      setDeleteId(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddAddon = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Addon name is required');
      return;
    }
    
    try {
      setFormLoading(true);
      setFormError('');
      setFormSuccess('');
      
      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await axios.post(
        'http://localhost:4000/api/addons', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 201) {
        setFormSuccess('Addon added successfully');
        fetchAddons();
        setTimeout(() => {
          toggleModal();
        }, 1500);
      } else {
        setFormError(response.data.data.message || 'Failed to add addon');
      }
    } catch (error) {
      console.error('Error adding addon:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while adding the addon');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAddon = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Addon name is required');
      return;
    }
    
    try {
      setFormLoading(true);
      setFormError('');
      setFormSuccess('');
      
      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await axios.put(
        `http://localhost:4000/api/addons/${editId}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 200) {
        setFormSuccess('Addon updated successfully');
        fetchAddons();
        setTimeout(() => {
          toggleEditModal();
        }, 1500);
      } else {
        setFormError(response.data.data.message || 'Failed to update addon');
      }
    } catch (error) {
      console.error('Error updating addon:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while updating the addon');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAddon = async () => {
    try {
      setFormLoading(true);
      
      const response = await axios.delete(`http://localhost:4000/api/addons/${deleteId}`);
      
      if (response.data.code === 200) {
        fetchAddons();
        toggleDeleteModal();
      } else {
        setFormError(response.data.data.message || 'Failed to delete addon');
      }
    } catch (error) {
      console.error('Error deleting addon:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while deleting the addon');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert color="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Addons</h1>
        <Button color="primary" onClick={toggleModal}>
          Add New Addon
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <h4 className="mb-0">Cake Addons ({addons.length})</h4>
        </CardHeader>
        <CardBody>
          {addons.length === 0 ? (
            <div className="text-center py-5">
              <h4>No addons found</h4>
              <p className="text-muted">Add your first cake addon</p>
              <Button color="primary" onClick={toggleModal}>
                Add Addon
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addons.map(addon => (
                    <tr key={addon._id}>
                      <td>
                        {addon.image ? (
                          <img 
                            src={addon.image} 
                            alt={addon.name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        ) : (
                          <div 
                            className="bg-light d-flex align-items-center justify-content-center rounded" 
                            style={{ width: '50px', height: '50px' }}
                          >
                            No Image
                          </div>
                        )}
                      </td>
                      <td>{addon.name}</td>
                      <td>{addon.description || 'N/A'}</td>
                      <td>Rs. {addon.price?.toFixed(2) || '0.00'}</td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => toggleEditModal(addon)}
                        >
                          Edit
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => toggleDeleteModal(addon._id)}
                        >
                          Delete
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
      
      {/* Add Addon Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add New Cake Addon</ModalHeader>
        <Form onSubmit={handleAddAddon}>
          <ModalBody>
            {formError && (
              <Alert color="danger">
                {formError}
              </Alert>
            )}
            
            {formSuccess && (
              <Alert color="success">
                {formSuccess}
              </Alert>
            )}
            
            <FormGroup>
              <Label for="name">Addon Name *</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter addon name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter addon description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="price">Price (Rs.) *</Label>
              <Input
                type="number"
                name="price"
                id="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="image">Addon Image</Label>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleInputChange}
                accept="image/*"
              />
              <small className="text-muted">
                Recommended size: 300x300 pixels
              </small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
            <Button 
              color="primary" 
              type="submit"
              disabled={formLoading}
            >
              {formLoading ? <Spinner size="sm" /> : 'Add Addon'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Edit Addon Modal */}
      <Modal isOpen={editModal} toggle={() => toggleEditModal()}>
        <ModalHeader toggle={() => toggleEditModal()}>Edit Cake Addon</ModalHeader>
        <Form onSubmit={handleEditAddon}>
          <ModalBody>
            {formError && (
              <Alert color="danger">
                {formError}
              </Alert>
            )}
            
            {formSuccess && (
              <Alert color="success">
                {formSuccess}
              </Alert>
            )}
            
            <FormGroup>
              <Label for="editName">Addon Name *</Label>
              <Input
                type="text"
                name="name"
                id="editName"
                placeholder="Enter addon name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="editDescription">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="editDescription"
                placeholder="Enter addon description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="editPrice">Price (Rs.) *</Label>
              <Input
                type="number"
                name="price"
                id="editPrice"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="editImage">Addon Image</Label>
              <Input
                type="file"
                name="image"
                id="editImage"
                onChange={handleInputChange}
                accept="image/*"
              />
              <small className="text-muted">
                Leave empty to keep the current image
              </small>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
            <Button 
              color="primary" 
              type="submit"
              disabled={formLoading}
            >
              {formLoading ? <Spinner size="sm" /> : 'Update Addon'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => toggleDeleteModal()}>
        <ModalHeader toggle={() => toggleDeleteModal()}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this addon? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleDeleteModal()}>Cancel</Button>
          <Button 
            color="danger" 
            onClick={handleDeleteAddon}
            disabled={formLoading}
          >
            {formLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminAddonsPage;
