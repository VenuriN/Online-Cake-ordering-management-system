import InventoryItem from '../models/InventoryItem.js'

// Get all inventory items
export const getAllItems = async (req, res) => {
  try {
    const items = await InventoryItem.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: items,
      message: 'Inventory items fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await InventoryItem.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] },
      isActive: true
    });
    return res.status(200).json({
      success: true,
      data: lowStockItems,
      message: 'Low stock items fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get soon to expire items (within a week)
export const getSoonToExpireItems = async (req, res) => {
  try {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);
    
    const soonToExpireItems = await InventoryItem.find({
      expiryDate: { $gte: today, $lte: oneWeekLater },
      isActive: true
    });
    
    return res.status(200).json({
      success: true,
      data: soonToExpireItems,
      message: 'Soon to expire items fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching soon to expire items:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new inventory item
export const createItem = async (req, res) => {
  try {
    const { name, quantity, unit, price, category, description, minStockLevel, expiryDate } = req.body;
    
    // Validate expiry date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (new Date(expiryDate) < today) {
      return res.status(400).json({
        success: false,
        message: 'Expiry date cannot be in the past'
      });
    }
    
    const newItem = new InventoryItem({
      name,
      quantity,
      unit,
      price,
      category,
      description,
      minStockLevel: minStockLevel || 5,
      expiryDate
    });
    
    await newItem.save();
    return res.status(201).json({
      success: true,
      data: newItem,
      message: 'Inventory item created successfully'
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating inventory item'
    });
  }
};

// Update inventory item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate expiry date is not in the past if it's being updated
    if (updates.expiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (new Date(updates.expiryDate) < today) {
        return res.status(400).json({
          success: false,
          message: 'Expiry date cannot be in the past'
        });
      }
    }
    
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Inventory item updated successfully'
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating inventory item'
    });
  }
};

// Delete inventory item (soft delete)
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await InventoryItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: item,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting inventory item'
    });
  }
};

// Get single inventory item
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await InventoryItem.findById(id);
    
    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: item,
      message: 'Inventory item fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
