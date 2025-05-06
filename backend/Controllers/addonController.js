import Addon from '../models/Addon.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';

// Get all addons
export const getAllAddons = async (req, res) => {
  try {
    const addons = await Addon.find();
    return response(res, 200, { addons });
  } catch (error) {
    console.error('Error fetching addons:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Create a new addon (admin only)
export const createAddon = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // Validate required fields
    if (!name || price === undefined) {
      return response(res, 400, ResTypes.errors.missing_fields);
    }
    
    const newAddon = new Addon({
      name,
      description,
      price
    });
    
    await newAddon.save();
    return response(res, 201, { 
      message: 'Addon created successfully',
      addon: newAddon 
    });
  } catch (error) {
    console.error('Error creating addon:', error);
    return response(res, 500, ResTypes.errors.create_error);
  }
};

// Update an addon (admin only)
export const updateAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive } = req.body;
    
    const updatedAddon = await Addon.findByIdAndUpdate(
      id,
      { name, description, price, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedAddon) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Addon updated successfully',
      addon: updatedAddon 
    });
  } catch (error) {
    console.error('Error updating addon:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};

// Delete an addon (admin only)
export const deleteAddon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAddon = await Addon.findByIdAndDelete(id);
    
    if (!deletedAddon) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Addon deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting addon:', error);
    return response(res, 500, ResTypes.errors.delete_error);
  }
};
