import City from '../models/City.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';

// Get all cities
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    return response(res, 200, { cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Create a new city (admin only)
export const createCity = async (req, res) => {
  try {
    const { name, deliveryFee } = req.body;
    
    // Validate required fields
    if (!name || deliveryFee === undefined) {
      return response(res, 400, ResTypes.errors.missing_fields);
    }
    
    const newCity = new City({
      name,
      deliveryFee
    });
    
    await newCity.save();
    return response(res, 201, { 
      message: 'City created successfully',
      city: newCity 
    });
  } catch (error) {
    console.error('Error creating city:', error);
    return response(res, 500, ResTypes.errors.create_error);
  }
};

// Update a city (admin only)
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, deliveryFee, isActive } = req.body;
    
    const updatedCity = await City.findByIdAndUpdate(
      id,
      { name, deliveryFee, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedCity) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'City updated successfully',
      city: updatedCity 
    });
  } catch (error) {
    console.error('Error updating city:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};

// Delete a city (admin only)
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCity = await City.findByIdAndDelete(id);
    
    if (!deletedCity) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'City deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    return response(res, 500, ResTypes.errors.delete_error);
  }
};
