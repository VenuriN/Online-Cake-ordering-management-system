import React, { useState, useEffect } from 'react';
import { 
  Container, Card, CardBody, CardHeader, Table, 
  Button, Spinner, Alert, Row, Col, Modal, ModalHeader, 
  ModalBody, ModalFooter, Form, FormGroup, Label, Input
} from 'reactstrap';
import axios from 'axios';

const AdminCategoriesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    additionalPrice: 0
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('http://localhost:4000/api/cake-categories');
      console.log(response.data)
      if (response.data.code === 200) {
        setCategories(response.data.data.categories || []);
      } else {
        setError('Failed to load cake categories');
      }
    } catch (error) {
      console.error('Error fetching cake categories:', error);
      setError('An error occurred while loading cake categories');
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
        additionalPrice: 0,
      });
      setFormError('');
      setFormSuccess('');
    }
  };

  const toggleEditModal = (category = null) => {
    setEditModal(!editModal);
    if (category) {
      setEditId(category._id);
      setFormData({
        name: category.name,
        description: category.description || '',
        additionalPrice: category.additionalPrice || 0,
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Category name is required');
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
      formDataToSend.append('additionalPrice', formData.additionalPrice);

      const response = await axios.post(
        'http://localhost:4000/api/cake-categories', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 201) {
        setFormSuccess('Category added successfully');
        fetchCategories();
        setTimeout(() => {
          toggleModal();
        }, 1500);
      } else {
        setFormError(response.data.data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while adding the category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Category name is required');
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
      formDataToSend.append('additionalPrice', formData.additionalPrice);

      
      const response = await axios.put(
        `http://localhost:4000/api/cake-categories/${editId}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 200) {
        setFormSuccess('Category updated successfully');
        fetchCategories();
        setTimeout(() => {
          toggleEditModal();
        }, 1500);
      } else {
        setFormError(response.data.data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while updating the category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setFormLoading(true);
      
      const response = await axios.delete(`http://localhost:4000/api/cake-categories/${deleteId}`);
      
      if (response.data.code === 200) {
        fetchCategories();
        toggleDeleteModal();
      } else {
        setFormError(response.data.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setFormError(error.response?.data?.data?.message || 'An error occurred while deleting the category');
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
        <h1>Manage Cake Categories</h1>
        <Button color="primary" onClick={toggleModal}>
          Add New Category
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <h4 className="mb-0">Cake Categories ({categories.length})</h4>
        </CardHeader>
        <CardBody>
          {categories.length === 0 ? (
            <div className="text-center py-5">
              <h4>No categories found</h4>
              <p className="text-muted">Add your first cake category</p>
              <Button color="primary" onClick={toggleModal}>
                Add Category
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Additional Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category._id}>
                      
                      <td>{category.name}</td>
                      <td>{category.description || 'N/A'}</td>
                      <td>Rs. {category.additionalPrice?.toFixed(2) || '0.00'}</td>
                      <td>
                        <Button 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => toggleEditModal(category)}
                        >
                          Edit
                        </Button>
                        <Button 
                          color="danger" 
                          size="sm"
                          onClick={() => toggleDeleteModal(category._id)}
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
      
      {/* Add Category Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Add New Cake Category</ModalHeader>
        <Form onSubmit={handleAddCategory}>
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
              <Label for="name">Category Name *</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter category name"
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
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="additionalPrice">Additional Price (Rs.)</Label>
              <Input
                type="number"
                name="additionalPrice"
                id="additionalPrice"
                placeholder="0.00"
                value={formData.additionalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
            <Button 
              color="primary" 
              type="submit"
              disabled={formLoading}
            >
              {formLoading ? <Spinner size="sm" /> : 'Add Category'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Edit Category Modal */}
      <Modal isOpen={editModal} toggle={() => toggleEditModal()}>
        <ModalHeader toggle={() => toggleEditModal()}>Edit Cake Category</ModalHeader>
        <Form onSubmit={handleEditCategory}>
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
              <Label for="editName">Category Name *</Label>
              <Input
                type="text"
                name="name"
                id="editName"
                placeholder="Enter category name"
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
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="editAdditionalPrice">Additional Price (Rs.)</Label>
              <Input
                type="number"
                name="additionalPrice"
                id="editAdditionalPrice"
                placeholder="0.00"
                value={formData.additionalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </FormGroup>
            
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleEditModal()}>Cancel</Button>
            <Button 
              color="primary" 
              type="submit"
              disabled={formLoading}
            >
              {formLoading ? <Spinner size="sm" /> : 'Update Category'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => toggleDeleteModal()}>
        <ModalHeader toggle={() => toggleDeleteModal()}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this category? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleDeleteModal()}>Cancel</Button>
          <Button 
            color="danger" 
            onClick={handleDeleteCategory}
            disabled={formLoading}
          >
            {formLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdminCategoriesPage;
