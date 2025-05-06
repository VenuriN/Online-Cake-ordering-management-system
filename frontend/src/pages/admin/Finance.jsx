import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardHeader, CardBody, Button, 
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, 
  Label, Input, Table, Badge, Spinner, Alert, InputGroup, 
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, 
  Pagination, PaginationItem, PaginationLink 
} from 'reactstrap';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilePdf, 
  FaSortAmountDown, FaFileDownload, FaCalendarAlt, 
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const FinanceManagement = () => {
  // State management
  const [finances, setFinances] = useState([]);
  const [filteredFinances, setFilteredFinances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const [sortOption, setSortOption] = useState('date-desc');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    startDate: '',
    endDate: '',
    type: ''
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  const [reportFormErrors, setReportFormErrors] = useState({
    startDate: '',
    endDate: ''
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isReportFormSubmitted, setIsReportFormSubmitted] = useState(false);

  // Toggle modals
  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setIsFormSubmitted(false);
    }
  };
  
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleSortDropdown = () => setSortDropdownOpen(!sortDropdownOpen);
  
  const toggleReportModal = () => {
    setReportModal(!reportModal);
    if (reportModal) {
      setIsReportFormSubmitted(false);
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setSelectedFinance(null);
    setFormErrors({
      amount: '',
      category: '',
      description: '',
      date: ''
    });
    setIsFormSubmitted(false);
  };

  // Main data fetching function
  const fetchFinances = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:4000/api/finance');
      
      if (response.data && response.data.data) {
        const allFinances = response.data.data;
        setFinances(allFinances);
        
        // Apply initial sorting and filtering
        const sorted = sortFinances(allFinances, sortOption);
        setFilteredFinances(sorted);
        
        // Set pagination based on filtered results
        calculatePagination(sorted);
      }
    } catch (err) {
      console.error('Error fetching finance records:', err);
      setError(err.response?.data?.message || 'Failed to fetch finance records');
      toast.error(err.response?.data?.message || 'Failed to fetch finance records');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/finance/categories');
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchFinances();
    fetchCategories();
  }, []);

  // Calculate pagination based on filtered results
  const calculatePagination = (data) => {
    const totalPages = Math.ceil(data.length / pagination.limit);
    setPagination({
      ...pagination,
      totalPages: totalPages > 0 ? totalPages : 1
    });
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredFinances.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination({ ...pagination, currentPage: page });
  };

  // Sort finances based on option
  const sortFinances = (data, option) => {
    const [field, direction] = option.split('-');
    
    return [...data].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, just sort all finances
      const sorted = sortFinances(finances, sortOption);
      setFilteredFinances(sorted);
      calculatePagination(sorted);
      setPagination({...pagination, currentPage: 1});
      return;
    }
    
    // Filter finances based on search query
    const query = searchQuery.toLowerCase().trim();
    const filtered = finances.filter(finance => 
      (finance.category && finance.category.toLowerCase().includes(query)) ||
      (finance.description && finance.description.toLowerCase().includes(query)) ||
      (finance.amount && finance.amount.toString().includes(query)) ||
      (finance.type && finance.type.toLowerCase().includes(query))
    );
    
    // Apply current sort to filtered results
    const sorted = sortFinances(filtered, sortOption);
    setFilteredFinances(sorted);
    
    // Reset to first page and update pagination
    calculatePagination(sorted);
    setPagination({...pagination, currentPage: 1});
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    const sorted = sortFinances(filteredFinances, option);
    setFilteredFinances(sorted);
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Amount validation
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be greater than zero';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      errors.amount = 'Amount must be a valid number with max 2 decimal places';
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
    } else if (formData.category.length < 2) {
      errors.category = 'Category must be at least 2 characters long';
    } else if (formData.category.length > 50) {
      errors.category = 'Category must not exceed 50 characters';
    }
    
    // Description validation (optional field)
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
    
    // Date validation
    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        errors.date = 'Please enter a valid date';
      } else if (selectedDate > today) {
        errors.date = 'Date cannot be in the future';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate report form
  const validateReportForm = () => {
    const errors = {};
    
    if (reportData.startDate && reportData.endDate) {
      const startDate = new Date(reportData.startDate);
      const endDate = new Date(reportData.endDate);
      
      if (startDate > endDate) {
        errors.endDate = 'End date must be after start date';
      }
    }
    
    setReportFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Only validate if form has already been submitted once
    if (isFormSubmitted) {
      const updatedErrors = { ...formErrors };
      
      switch (name) {
        case 'amount':
          if (!value) {
            updatedErrors.amount = 'Amount is required';
          } else if (parseFloat(value) <= 0) {
            updatedErrors.amount = 'Amount must be greater than zero';
          } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            updatedErrors.amount = 'Amount must be a valid number with max 2 decimal places';
          } else {
            updatedErrors.amount = '';
          }
          break;
          
        case 'category':
          if (!value) {
            updatedErrors.category = 'Category is required';
          } else if (value.length < 2) {
            updatedErrors.category = 'Category must be at least 2 characters long';
          } else if (value.length > 50) {
            updatedErrors.category = 'Category must not exceed 50 characters';
          } else {
            updatedErrors.category = '';
          }
          break;
          
        case 'description':
          if (value.length > 500) {
            updatedErrors.description = 'Description must not exceed 500 characters';
          } else {
            updatedErrors.description = '';
          }
          break;
          
        case 'date':
          if (!value) {
            updatedErrors.date = 'Date is required';
          } else {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (isNaN(selectedDate.getTime())) {
              updatedErrors.date = 'Please enter a valid date';
            } else if (selectedDate > today) {
              updatedErrors.date = 'Date cannot be in the future';
            } else {
              updatedErrors.date = '';
            }
          }
          break;
          
        default:
          break;
      }
      
      setFormErrors(updatedErrors);
    }
  };

  // Handle report form input change
  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
    
    // Validate dates in real-time only if form has been submitted
    if (isReportFormSubmitted && (name === 'startDate' || name === 'endDate')) {
      const updatedErrors = { ...reportFormErrors };
      const startDate = name === 'startDate' ? value : reportData.startDate;
      const endDate = name === 'endDate' ? value : reportData.endDate;
      
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        updatedErrors.endDate = 'End date must be after start date';
      } else {
        updatedErrors.endDate = '';
      }
      
      setReportFormErrors(updatedErrors);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (selectedFinance) {
        // Update existing finance record
        const response = await axios.put(`http://localhost:4000/api/finance/${selectedFinance._id}`, formData);
        if (response.data && response.data.data) {
          toast.success('Finance record updated successfully');
          toggleModal();
          await fetchFinances();
        }
      } else {
        // Create new finance record
        const response = await axios.post('http://localhost:4000/api/finance', formData);
        if (response.data && response.data.data) {
          toast.success('Finance record created successfully');
          toggleModal();
          await fetchFinances();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save finance record');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedFinance) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:4000/api/finance/${selectedFinance._id}`);
      
      if (response.data) {
        toast.success('Finance record deleted successfully');
        toggleDeleteModal();
        await fetchFinances();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete finance record');
    } finally {
      setLoading(false);
    }
  };

    // Generate report - FIXED VERSION
    const generateReport = async () => {
      setIsReportFormSubmitted(true);
      
      if (!validateReportForm()) {
        return;
      }
      
      try {
        setGeneratingReport(true);
        
        // Prepare query parameters to match backend expectations
        const queryParams = new URLSearchParams();
        
        // Only add parameters that have values
        if (reportData.startDate) {
          queryParams.append('startDate', reportData.startDate);
        }
        
        if (reportData.endDate) {
          queryParams.append('endDate', reportData.endDate);
        }
        
        if (reportData.type) {
          queryParams.append('type', reportData.type);
        }
        
        // Make the API request
        const url = `http://localhost:4000/api/finance/report?${queryParams.toString()}`;
        console.log('Generating report with URL:', url);
        
        const response = await axios.get(url, {
          responseType: 'blob'
        });
        
        // Create a blob from the response data
        const file = new Blob([response.data], { type: 'application/pdf' });
        
        // Create an object URL from the blob
        const fileURL = URL.createObjectURL(file);
        
        // Open the URL in a new tab
        window.open(fileURL);
        
        toggleReportModal();
        toast.success('Report generated successfully');
      } catch (err) {
        console.error('Report generation error:', err);
        toast.error('Failed to generate report');
      } finally {
        setGeneratingReport(false);
      }
    };
  

  // Edit finance record
  const editFinance = (finance) => {
    setSelectedFinance(finance);
    setFormData({
      type: finance.type,
      amount: finance.amount.toString(),
      category: finance.category,
      description: finance.description || '',
      date: new Date(finance.date).toISOString().split('T')[0]
    });
    toggleModal();
  };

  // Handle delete click
  const handleDeleteClick = (finance) => {
    setSelectedFinance(finance);
    toggleDeleteModal();
  };

  // Add new finance record
  const addNewFinance = () => {
    resetFormData();
    toggleModal();
  };

  // Format amount with currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Get sort option display name
  const getSortOptionDisplayName = (option) => {
    switch(option) {
      case 'date-desc': return 'Date (Newest First)';
      case 'date-asc': return 'Date (Oldest First)';
      case 'amount-desc': return 'Amount (Highest First)';
      case 'amount-asc': return 'Amount (Lowest First)';
      case 'category-asc': return 'Category (A-Z)';
      case 'category-desc': return 'Category (Z-A)';
      default: return 'Sort by';
    }
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
    // Previous button
    items.push(
      <PaginationItem key="prev" disabled={currentPage === 1}>
        <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key={1} active={currentPage === 1}>
        <PaginationLink onClick={() => handlePageChange(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis after first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1" disabled>
          <PaginationLink>...</PaginationLink>
        </PaginationItem>
      );
    }
    
    // Pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i} active={currentPage === i}>
          <PaginationLink onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis before last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2" disabled>
          <PaginationLink>...</PaginationLink>
        </PaginationItem>
      );
    }
    
    // Last page (if more than 1 page)
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages} active={currentPage === totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next" disabled={currentPage === totalPages}>
        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
      </PaginationItem>
    );
    
    return items;
  };

  // Calculate totals for current filtered data
  const calculateTotals = () => {
    const totalIncome = filteredFinances.reduce(
      (sum, item) => sum + (item.type === 'income' ? item.amount : 0), 
      0
    );
    
    const totalExpense = filteredFinances.reduce(
      (sum, item) => sum + (item.type === 'expense' ? item.amount : 0), 
      0
    );
    
    return { totalIncome, totalExpense };
  };

  // Get current page data
  const currentPageFinances = getCurrentPageItems();
  const { totalIncome, totalExpense } = calculateTotals();

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Finance Management</h1>
      
      <Card className="mb-4 shadow-sm">
        <CardHeader className="bg-white">
          <Row className="align-items-center">
            <Col md={6} className="d-flex gap-2">
              <Button color="primary" onClick={addNewFinance}>
                <FaPlus className="me-1" /> Add Transaction
              </Button>
              <Button color="success" onClick={toggleReportModal}>
                <FaFilePdf className="me-1" /> Generate Report
              </Button>
            </Col>
            
            <Col md={6}>
              <div className="d-flex gap-2 justify-content-md-end mt-3 mt-md-0">
                <Dropdown isOpen={sortDropdownOpen} toggle={toggleSortDropdown}>
                  <DropdownToggle color="secondary" className="d-flex align-items-center">
                    <FaSortAmountDown className="me-1" /> Sort
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem header>Sort Options</DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'date-desc'} 
                      onClick={() => handleSortChange('date-desc')}
                    >
                      Date (Newest First)
                    </DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'date-asc'} 
                      onClick={() => handleSortChange('date-asc')}
                    >
                      Date (Oldest First)
                    </DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'amount-desc'} 
                      onClick={() => handleSortChange('amount-desc')}
                    >
                      Amount (Highest First)
                    </DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'amount-asc'} 
                      onClick={() => handleSortChange('amount-asc')}
                    >
                      Amount (Lowest First)
                    </DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'category-asc'} 
                      onClick={() => handleSortChange('category-asc')}
                    >
                      Category (A-Z)
                    </DropdownItem>
                    <DropdownItem 
                      active={sortOption === 'category-desc'} 
                      onClick={() => handleSortChange('category-desc')}
                    >
                      Category (Z-A)
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                
                <InputGroup>
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <Button color="primary" onClick={handleSearch}>
                    <FaSearch />
                  </Button>
                </InputGroup>
              </div>
            </Col>
          </Row>
        </CardHeader>
        
        <CardBody>
          {loading && (
            <div className="text-center py-5">
              <Spinner color="primary" />
              <p className="mt-2">Loading finance records...</p>
            </div>
          )}
          
          {error && !loading && (
            <Alert color="danger">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}
          
          {!loading && !error && filteredFinances.length === 0 && (
            <div className="text-center py-5">
              <p className="mb-3">No finance records found</p>
              <Button color="primary" onClick={addNewFinance}>
                <FaPlus className="me-1" /> Add Your First Transaction
              </Button>
            </div>
          )}
          
          {!loading && !error && filteredFinances.length > 0 && (
            <>
              {searchQuery && (
                <Alert color="info" className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Search results for:</strong> "{searchQuery}" 
                    ({filteredFinances.length} record{filteredFinances.length !== 1 ? 's' : ''} found)
                  </div>
                  <Button 
                    color="link" 
                    className="p-0" 
                    onClick={() => {
                      setSearchQuery('');
                      setFilteredFinances(sortFinances(finances, sortOption));
                      calculatePagination(finances);
                      setPagination({...pagination, currentPage: 1});
                    }}
                  >
                    Clear search
                  </Button>
                </Alert>
              )}
            
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageFinances.map((finance) => (
                      <tr key={finance._id}>
                        <td>
                          <Badge color={finance.type === 'income' ? 'success' : 'danger'}>
                            {finance.type === 'income' ? 'Income' : 'Expense'}
                          </Badge>
                        </td>
                        <td>{formatDate(finance.date)}</td>
                        <td>{finance.category}</td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }}>
                          {finance.description || '-'}
                        </td>
                        <td className={finance.type === 'income' ? 'text-success' : 'text-danger'}>
                          {formatAmount(finance.amount)}
                        </td>
                        <td>
                          <Button color="info" size="sm" className="me-1" onClick={() => editFinance(finance)}>
                            <FaEdit />
                          </Button>
                          <Button color="danger" size="sm" onClick={() => handleDeleteClick(finance)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    {generatePaginationItems()}
                  </Pagination>
                </div>
              )}
              
              <div className="finance-summary mt-4 p-3 bg-light rounded">
                <Row>
                  <Col md={4}>
                    <h5>Summary</h5>
                    <p className="mb-1">
                      Total Records: <strong>{filteredFinances.length}</strong>
                      {filteredFinances.length !== finances.length && (
                        <span className="ms-2 text-muted">
                        (filtered from {finances.length})
                      </span>
                    )}
                  </p>
                </Col>
                <Col md={4}>
                  <h5 className="text-success">Total Income</h5>
                  <p className="text-success fw-bold">
                    {formatAmount(totalIncome)}
                  </p>
                </Col>
                <Col md={4}>
                  <h5 className="text-danger">Total Expenses</h5>
                  <p className="text-danger fw-bold">
                    {formatAmount(totalExpense)}
                  </p>
                </Col>
              </Row>
            </div>
          </>
        )}
      </CardBody>
    </Card>
    
    {/* Add/Edit Finance Modal */}
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {selectedFinance ? 'Edit Finance Record' : 'Add New Finance Record'}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup tag="fieldset">
            <legend>Transaction Type</legend>
            <div className="d-flex">
              <FormGroup check className="me-4">
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleInputChange}
                  />{' '}
                  Income
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleInputChange}
                  />{' '}
                  Expense
                </Label>
              </FormGroup>
            </div>
          </FormGroup>
          
          <FormGroup>
            <Label for="amount">Amount*</Label>
            <Input
              type="number"
              name="amount"
              id="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              invalid={!!formErrors.amount}
              step="0.01"
            />
            {formErrors.amount && (
              <div className="text-danger mt-1">{formErrors.amount}</div>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label for="category">Category*</Label>
            <Input
              type="select"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              invalid={!!formErrors.category}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
              <option value="other">Other (new category)</option>
            </Input>
            {formData.category === 'other' && (
              <Input
                type="text"
                placeholder="Enter new category"
                className="mt-2"
                name="category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            )}
            {formErrors.category && (
              <div className="text-danger mt-1">{formErrors.category}</div>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              invalid={!!formErrors.description}
              rows="3"
            />
            {formErrors.description && (
              <div className="text-danger mt-1">{formErrors.description}</div>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label for="date">Date*</Label>
            <Input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
              invalid={!!formErrors.date}
            />
            {formErrors.date && (
              <div className="text-danger mt-1">{formErrors.date}</div>
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : (selectedFinance ? 'Update' : 'Save')}
        </Button>
      </ModalFooter>
    </Modal>
    
    {/* Delete Confirmation Modal */}
    <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
      <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
      <ModalBody>
      {selectedFinance && (
          <div>
            <p>Are you sure you want to delete this finance record?</p>
            <div className="bg-light p-3 rounded">
              <p>
                <strong>Type:</strong>{' '}
                <Badge color={selectedFinance.type === 'income' ? 'success' : 'danger'}>
                  {selectedFinance.type === 'income' ? 'Income' : 'Expense'}
                </Badge>
              </p>
              <p><strong>Amount:</strong> {formatAmount(selectedFinance.amount)}</p>
              <p><strong>Category:</strong> {selectedFinance.category}</p>
              <p><strong>Date:</strong> {formatDate(selectedFinance.date)}</p>
            </div>
            <p className="text-danger mt-3">This action cannot be undone.</p>
          </div>
        )}
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
    
    {/* Generate Report Modal */}
    <Modal isOpen={reportModal} toggle={toggleReportModal}>
      <ModalHeader toggle={toggleReportModal}>Generate Finance Report</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="report-type">Transaction Type</Label>
            <Input
              type="select"
              name="type"
              id="report-type"
              value={reportData.type}
              onChange={handleReportInputChange}
            >
              <option value="">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </Input>
          </FormGroup>
          
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={reportData.startDate}
                  onChange={handleReportInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="endDate">End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={reportData.endDate}
                  onChange={handleReportInputChange}
                  invalid={!!reportFormErrors.endDate}
                />
                {reportFormErrors.endDate && (
                  <div className="text-danger mt-1">{reportFormErrors.endDate}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          
          <p className="text-muted small">
            <FaCalendarAlt className="me-1" />
            Leave dates empty to include all records
          </p>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleReportModal}>
          Cancel
        </Button>
        <Button color="primary" onClick={generateReport} disabled={generatingReport}>
          {generatingReport ? <Spinner size="sm" /> : (
            <>
              <FaFileDownload className="me-1" /> Generate PDF
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  </Container>
);
};

export default FinanceManagement;

