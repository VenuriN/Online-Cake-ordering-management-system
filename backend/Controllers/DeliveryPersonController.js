import DeliveryPerson from '../models/DeliveryPerson.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';
import HttpType from '../Utils/ResponseHandler/HttpType.js';

// Create a new delivery person (admin only)
export const createDeliveryPerson = async (req, res) => {
  try {
    const { name, email, password, contact, nic, city, isActive } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !contact || !nic || !city) {
      return response(res, 400, { message: 'All fields are required' });
    }
    
    // Check if delivery person with email already exists
    const existingPerson = await DeliveryPerson.findOne({ email });
    if (existingPerson) {
      return response(res, 400, { message: 'Delivery person with this email already exists' });
    }
    
    // Check if delivery person with NIC already exists
    const existingNIC = await DeliveryPerson.findOne({ nic });
    if (existingNIC) {
      return response(res, 400, { message: 'Delivery person with this NIC already exists' });
    }
    
    const newDeliveryPerson = new DeliveryPerson({
      name,
      email,
      password,
      contact,
      nic,
      city,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await newDeliveryPerson.save();
    
    // Remove password from response
    const deliveryPersonResponse = newDeliveryPerson.toObject();
    delete deliveryPersonResponse.password;
    
    return response(res, 201, { 
      message: 'Delivery person created successfully',
      deliveryPerson: deliveryPersonResponse 
    });
  } catch (error) {
    console.error('Error creating delivery person:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return response(res, 400, { message: messages.join(', ') });
    }
    
    // Check for duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return response(res, 400, { 
        message: `Delivery person with this ${field} already exists` 
      });
    }
    
    return response(res, 500, { message: 'An error occurred while creating the delivery person' });
  }
};

// Get all delivery persons (admin only)
export const getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find()
      .select('-password')
      .populate('city');
    
    return response(res, 200, { deliveryPersons });
  } catch (error) {
    console.error('Error fetching delivery persons:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Get delivery person by ID
export const getDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deliveryPerson = await DeliveryPerson.findById(id)
      .select('-password')
      .populate('city');
    
    if (!deliveryPerson) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { deliveryPerson });
  } catch (error) {
    console.error('Error fetching delivery person:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Update delivery person (admin only)
export const updateDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, contact, city, isActive } = req.body;
    
    // Check if email is being changed and already exists
    if (email) {
      const existingPerson = await DeliveryPerson.findOne({ email, _id: { $ne: id } });
      if (existingPerson) {
        return response(res, 400, { message: 'Email already in use by another delivery person' });
      }
    }
    
    // Create an update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (contact !== undefined) updateData.contact = contact;
    if (city !== undefined) updateData.city = city;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle password update separately if provided
    let deliveryPerson;
    if (password) {
      // Find user, update password and save to trigger the password hash middleware
      deliveryPerson = await DeliveryPerson.findById(id);
      if (!deliveryPerson) {
        return response(res, 404, ResTypes.errors.not_found);
      }
      
      // Apply other updates
      Object.assign(deliveryPerson, updateData);
      
      // Update password which will trigger the pre-save hook
      deliveryPerson.password = password;
      await deliveryPerson.save();
    } else {
      // Update without modifying password
      deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!deliveryPerson) {
        return response(res, 404, ResTypes.errors.not_found);
      }
    }
    
    // Populate city and remove password from response
    await deliveryPerson.populate('city');
    const deliveryPersonResponse = deliveryPerson.toObject();
    delete deliveryPersonResponse.password;
    
    return response(res, 200, { 
      message: 'Delivery person updated successfully',
      deliveryPerson: deliveryPersonResponse 
    });
  } catch (error) {
    console.error('Error updating delivery person:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return response(res, 400, { message: messages.join(', ') });
    }
    
    // Check for duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return response(res, 400, { 
        message: `Delivery person with this ${field} already exists` 
      });
    }
    
    return response(res, 500, { message: 'An error occurred while updating the delivery person' });
  }
};

// Delete delivery person (admin only)
export const deleteDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPerson = await DeliveryPerson.findByIdAndDelete(id);
    
    if (!deletedPerson) {
      return response(res, 404, ResTypes.errors.not_found);
      }
      
      return response(res, 200, { 
        message: 'Delivery person deleted successfully' 
      });
    } catch (error) {
      console.error('Error deleting delivery person:', error);
      return response(res, 500, ResTypes.errors.delete_error);
    }
  };
  
  // Toggle delivery person status (active/inactive)
  export const toggleStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        return response(res, 400, { message: 'isActive field is required' });
      }
      
      const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
        id,
        { isActive },
        { new: true, runValidators: true }
      ).select('-password').populate('city');
      
      if (!deliveryPerson) {
        return response(res, 404, ResTypes.errors.not_found);
      }
      
      const statusMessage = isActive ? 'activated' : 'deactivated';
      
      return response(res, 200, { 
        message: `Delivery person ${statusMessage} successfully`,
        deliveryPerson 
      });
    } catch (error) {
      console.error('Error toggling delivery person status:', error);
      return response(res, 500, ResTypes.errors.upadate_error);
    }
  };
  
  // Delivery person login
  export const loginDeliveryPerson = async (req, res) => {
    try {
      const { email, nic } = req.body;
      
      // Find delivery person by email
      const deliveryPerson = await DeliveryPerson.findOne({ email });
      
      if (!deliveryPerson) {
        return response(res, 401, { message: 'Invalid email or NIC' });
      }
      
      // Check if delivery person is active
      if (!deliveryPerson.isActive) {
        return response(res, 403, { message: 'Your account has been deactivated. Please contact admin.' });
      }
      
      // Verify NIC
      if (deliveryPerson.nic !== nic) {
        return response(res, 401, { message: 'Invalid email or NIC' });
      }
      
      // Create delivery person object without password
      const deliveryPersonData = deliveryPerson.toObject();
      delete deliveryPersonData.password;
      
      return response(res, 200, { 
        message: 'Login successful',
        deliveryPerson: deliveryPersonData
      });
    } catch (error) {
      console.error('Error during login:', error);
      return response(res, 500, ResTypes.errors.server_error);
    }
  };
  
  // Change delivery person password
  export const changePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return response(res, 400, { message: 'Current password and new password are required' });
      }
      
      if (newPassword.length < 6) {
        return response(res, 400, { message: 'Password must be at least 6 characters long' });
      }
      
      // Find delivery person
      const deliveryPerson = await DeliveryPerson.findById(id);
      
      if (!deliveryPerson) {
        return response(res, 404, ResTypes.errors.not_found);
      }
      
      // Verify current password
      const isPasswordValid = await deliveryPerson.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        return response(res, 401, { message: 'Current password is incorrect' });
      }
      
      // Update password
      deliveryPerson.password = newPassword;
      await deliveryPerson.save();
      
      return response(res, 200, { 
        message: 'Password changed successfully' 
      });
    } catch (error) {
      console.error('Error changing password:', error);
      return response(res, 500, ResTypes.errors.upadate_error);
    }
  };
  