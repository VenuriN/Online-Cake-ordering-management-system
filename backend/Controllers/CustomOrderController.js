import User from '../models/User.js';
import CustomOrder from '../models/CustomOrder.js';
import path from 'path';
// Pricing configuration
const PRICE_CONFIG = {
  basePrices: {
    '1': 2500,   // Small cake (1-10 people)
    '2': 4500,   // Medium cake (11-25 people)
    '3': 7500,   // Large cake (26-50 people)
    '4': 12000,  // X-Large cake (50+ people)
  },
  toppingPrices: {
    'sprinkles': 200,
    'chocolate_chips': 300,
    'fruits': 500,
    'nuts': 400,
    'candy': 350,
    'custom_decoration': 1000,
    'edible_image': 800,
    'cookies': 400,
    'macarons': 600,
  },
  deliveryFees: {
    'colombo_01': 300,
    'colombo_02': 300,
    'colombo_03': 400,
    'colombo_04': 400,
    'colombo_05': 500,
    'colombo_06': 500,
    'dehiwala': 600,
    'mount_lavinia': 700,
    'ratmalana': 800,
    'nugegoda': 600,
    'maharagama': 800,
    'battaramulla': 700,
    'kaduwela': 900,
    'malabe': 900,
    'piliyandala': 800,
    'kesbewa': 1000,
    'homagama': 1100,
    'kottawa': 1000,
    'ja_ela': 1200,
    'kadawatha': 1100,
    'wattala': 1000,
    'kiribathgoda': 900,
  }
};

// Fetch available options for custom orders
export const getCustomOrderOptions = (req, res) => {
  try {
    const cakeFlavors = [
      { value: 'vanilla', label: 'Vanilla' },
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'red_velvet', label: 'Red Velvet' },
      { value: 'black_forest', label: 'Black Forest' },
      { value: 'carrot', label: 'Carrot' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'coconut', label: 'Coconut' },
      { value: 'coffee', label: 'Coffee' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'pineapple', label: 'Pineapple' }
    ];
    
    const frostings = [
      { value: 'buttercream', label: 'Buttercream' },
      { value: 'cream_cheese', label: 'Cream Cheese' },
      { value: 'whipped_cream', label: 'Whipped Cream' },
      { value: 'chocolate_ganache', label: 'Chocolate Ganache' },
      { value: 'fondant', label: 'Fondant' },
      { value: 'meringue', label: 'Meringue' }
    ];
    
    const toppings = [
      { value: 'sprinkles', label: 'Sprinkles', price: 200 },
      { value: 'chocolate_chips', label: 'Chocolate Chips', price: 300 },
      { value: 'fruits', label: 'Fresh Fruits', price: 500 },
      { value: 'nuts', label: 'Nuts', price: 400 },
      { value: 'candy', label: 'Candy', price: 350 },
      { value: 'custom_decoration', label: 'Custom Decoration', price: 1000 },
      { value: 'edible_image', label: 'Edible Image', price: 800 },
      { value: 'cookies', label: 'Cookies', price: 400 },
      { value: 'macarons', label: 'Macarons', price: 600 }
    ];
    
    const cities = Object.entries(PRICE_CONFIG.deliveryFees).map(([key, value]) => ({
      value: key,
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      fee: value
    }));
    
    res.status(200).json({
      success: true,
      data: {
        cakeFlavors,
        frostings,
        toppings,
        cities
      }
    });
  } catch (error) {
    console.error('Error fetching custom order options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch custom order options'
    });
  }
};

// Calculate price for custom order
export const calculatePrice = (req, res) => {
  try {
    const { cakeSize, toppings, city } = req.body;
    
    // Base price based on cake size
    const basePrice = PRICE_CONFIG.basePrices[cakeSize] || PRICE_CONFIG.basePrices['1'];
    // Calculate add-ons price
    let addonsPrice = 0;
    if (toppings && Array.isArray(toppings)) {
      toppings.forEach(topping => {
        if (PRICE_CONFIG.toppingPrices[topping]) {
          addonsPrice += PRICE_CONFIG.toppingPrices[topping];
        }
      });
    }
    
    // Calculate delivery fee
    let deliveryFee = 0;
    if (city && city.value) {
      deliveryFee = PRICE_CONFIG.deliveryFees[city.value] || 0;
    }
    
    // Calculate total price
    const totalPrice = basePrice + addonsPrice + deliveryFee;
    
    res.status(200).json({
      success: true,
      data: {
        basePrice,
        addonsPrice,
        deliveryFee,
        totalPrice
      }
    });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate price'
    });
  }
};

// Create a new custom order
export const createCustomOrder = async (req, res) => {
    try {
      const {
        cakeSize, cakeShape, cakeFlavor, frosting, toppings,
        specialInstructions, name, email, phone,
        deliveryDate, deliveryAddress, city, totalPrice
      } = req.body;
  
      if (!cakeSize || !cakeShape || !cakeFlavor || !frosting) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all cake details'
        });
      }
  
      if (!name || !email || !phone || !deliveryDate || !deliveryAddress || !city) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all delivery details'
        });
      }
  
      const basePrice = PRICE_CONFIG.basePrices[cakeSize] || PRICE_CONFIG.basePrices['1'];
  
      let addonsPrice = 0;
      if (toppings && Array.isArray(toppings)) {
        toppings.forEach(topping => {
          if (PRICE_CONFIG.toppingPrices[topping]) {
            addonsPrice += PRICE_CONFIG.toppingPrices[topping];
          }
        });
      }
  
      const deliveryFee = PRICE_CONFIG.deliveryFees[city] || 0;
      const calculatedTotal = basePrice + addonsPrice + deliveryFee;
  
      const newOrder = new CustomOrder({
        userId: req.user.id,
        cakeSize,
        cakeShape,
        cakeFlavor,
        frosting,
        toppings: toppings || [],
        specialInstructions,
        name,
        email,
        phone,
        deliveryDate,
        deliveryAddress,
        city,
        basePrice,
        addonsPrice,
        deliveryFee,
        totalPrice: calculatedTotal
      });
  
      await newOrder.save();
  
      res.status(201).json({
        success: true,
        message: 'Custom order created successfully',
        data: {
          orderId: newOrder._id // Use the default _id field
        }
      });
    } catch (error) {
      console.error('Error creating custom order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create custom order'
      });
    }
  };

// Get a single order by ID
export const getCustomOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await CustomOrder.findById(orderId); // Ensure this uses findById
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await CustomOrder.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await CustomOrder.countDocuments({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await CustomOrder.findOne({
      orderId: orderId,
      userId: req.user.id
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Only allow cancellation if order is still pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }
    
    // Update order status
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Cancelled by customer'
    });
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, note } = req.body;
      
      // Validate status
      const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }
      
      const order = await CustomOrder.findById(orderId);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      
      // Update order status
      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`
      });
      
      await order.save();
      
      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: {
          orderId: order._id,
          status: order.status
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
  };

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const orders = await CustomOrder.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await CustomOrder.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};
export default {
  getCustomOrderOptions,
  calculatePrice,
  createCustomOrder,
  getCustomOrderById,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  getAllOrders
};
