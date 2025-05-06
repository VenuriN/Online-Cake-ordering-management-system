import CakeCategory from '../models/CakeCategory.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';

// Get all cake categories
export const getAllCakeCategories = async (req, res) => {
  try {
    const categories = await CakeCategory.find();
    return response(res, 200, { categories });
  } catch (error) {
    console.error('Error fetching cake categories:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Create a new cake category (admin only)
export const createCakeCategory = async (req, res) => {
  try {
    const { name, description, additionalPrice } = req.body;
    
    // Validate required fields
    if (!name || additionalPrice === undefined) {
      return response(res, 400, ResTypes.errors.missing_fields);
    }
    
    const newCategory = new CakeCategory({
      name,
      description,
      additionalPrice
    });
    
    await newCategory.save();
    return response(res, 201, { 
      message: 'Cake category created successfully',
      category: newCategory 
    });
  } catch (error) {
    console.error('Error creating cake category:', error);
    return response(res, 500, ResTypes.errors.create_error);
  }
};

// Update a cake category (admin only)
export const updateCakeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, additionalPrice, isActive } = req.body;
    
    const updatedCategory = await CakeCategory.findByIdAndUpdate(
      id,
      { name, description, additionalPrice, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Cake category updated successfully',
      category: updatedCategory 
    });
  } catch (error) {
    console.error('Error updating cake category:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};

// Delete a cake category (admin only)
export const deleteCakeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCategory = await CakeCategory.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Cake category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting cake category:', error);
    return response(res, 500, ResTypes.errors.delete_error);
  }
};
