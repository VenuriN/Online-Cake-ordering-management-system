import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      cakeSize,
      cakeCategory,
      selectedAddons,
      specialInstructions,
      name,
      email,
      contact,
      city,
      address,
      paymentMethod,
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      basePrice,
      addonsPrice,
      deliveryFee,
      totalPrice
    } = req.body;
    
    // Handle file uploads (design image and receipt image)
    let receiptImagePath = null;
    let designImagePath = null;
    
    // Create uploads directories if they don't exist
    const receiptUploadDir = path.join(__dirname, '../uploads/receipts');
    const designUploadDir = path.join(__dirname, '../uploads/designs');
    
    if (!fs.existsSync(receiptUploadDir)) {
      fs.mkdirSync(receiptUploadDir, { recursive: true });
    }
    
    if (!fs.existsSync(designUploadDir)) {
      fs.mkdirSync(designUploadDir, { recursive: true });
    }
    
    // Handle receipt image upload if payment method is bank transfer
    if (paymentMethod === 'bank' && req.files && req.files.receiptImage) {
      const receiptImage = req.files.receiptImage;
      
      // Generate unique filename
      const filename = `receipt_${Date.now()}_${receiptImage.name}`;
      const filePath = path.join(receiptUploadDir, filename);
      
      // Save the file
      await receiptImage.mv(filePath);
      receiptImagePath = `/uploads/receipts/${filename}`;
    }
    
    // Handle design image upload if provided
    if (req.files && req.files.designImage) {
      const designImage = req.files.designImage;
      
      // Generate unique filename
      const filename = `design_${Date.now()}_${designImage.name}`;
      const filePath = path.join(designUploadDir, filename);
      
      // Save the file
      await designImage.mv(filePath);
      designImagePath = `/uploads/designs/${filename}`;
    }
    
    // Create new order
    const newOrder = new Order({
      orderId,
      userId,
      orderNumber: `ORD${Date.now()}`,
      cakeDetails: {
        cakeSize,
        cakeCategory,
        addons: selectedAddons ? (Array.isArray(selectedAddons) ? selectedAddons : [selectedAddons]) : [],
        specialInstructions,
        designImage: designImagePath
      },
      deliveryDetails: {
        name,
        email,
        contact,
        city,
        address
      },
      pricing: {
        basePrice: Number(basePrice),
        addonsPrice: Number(addonsPrice),
        deliveryFee: Number(deliveryFee),
        totalPrice: Number(totalPrice)
      },
      payment: {
        method: paymentMethod,
        status: 'pending',
        cardDetails: paymentMethod === 'card' ? {
          cardNumber,
          cardName,
          expiryDate,
          cvv
        } : undefined,
        receiptImage: receiptImagePath
      }
    });
    
    await newOrder.save();
    
    // Create payment record
    const newPayment = new Payment({
      orderId: newOrder._id,
      userId,
      amount: Number(totalPrice),
      method: paymentMethod,
      status: 'pending',
      cardDetails: paymentMethod === 'card' ? {
        cardNumber,
        cardName,
        expiryDate
      } : undefined,
      receiptImage: receiptImagePath
    });
    
    await newPayment.save();
    
    return response(res, 201, { 
      message: 'Order placed successfully',
      order: newOrder 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return response(res, 500, ResTypes.errors.create_error);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('cakeDetails.cakeCategory')
      .populate('cakeDetails.addons')
      .populate('deliveryDetails.city')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });
    
    return response(res, 200, { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Get orders by user ID
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const orders = await Order.find({ userId })
      .populate('cakeDetails.cakeCategory')
      .populate('cakeDetails.addons')
      .populate('deliveryDetails.city')
      .populate('deliveryPerson')
      .sort({ createdAt: -1 });
    
    return response(res, 200, { orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('cakeDetails.cakeCategory')
      .populate('cakeDetails.addons')
      .populate('deliveryDetails.city')
      .populate('deliveryPerson');
    
    if (!order) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusNote } = req.body;
    
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'not-delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return response(res, 400, { message: 'Invalid status value' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, statusNote },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Order status updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};


// Update order delivery details (user only)
export const updateOrderDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, city, address } = req.body;
    
    // Find the order first to check if it can be updated
    const order = await Order.findById(id);
    
    if (!order) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    // Check if order is in a status that allows updates
    if (order.status !== 'pending') {
      return response(res, 400, { 
        message: 'Cannot update order. Order has already been accepted or processed.' 
      });
    }
    
    // Check if order is within 24 hours
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - orderTime) / (1000 * 60 * 60); //editable
    
    if (hoursDifference > 24) {
      return response(res, 400, { 
        message: 'Cannot update order. Order is more than 24 hours old.' 
      });
    }
    
    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        'deliveryDetails.name': name,
        'deliveryDetails.email': email,
        'deliveryDetails.contact': contact,
        'deliveryDetails.city': city,
        'deliveryDetails.address': address
      },
      { new: true, runValidators: true }
    );
    
    return response(res, 200, { 
      message: 'Order delivery details updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order delivery details:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};

// Cancel order (user only)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the order first to check if it can be cancelled
    const order = await Order.findById(id);
    
    if (!order) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    // Check if order is in a status that allows cancellation
    if (order.status !== 'pending') {
      return response(res, 400, { 
        message: 'Cannot cancel order. Order has already been accepted or processed.' 
      });
    }
    
    // Check if order is within 24 hours
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (currentTime - orderTime) / (1000 * 60* 60);
    
    if (hoursDifference > 24) {
      return response(res, 400, { 
        message: 'Cannot cancel order. Order is more than 24 hours old.' 
      });
    }
    
    // Update the order status to cancelled
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );
    
    return response(res, 200, { 
      message: 'Order cancelled successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};





// DELIVERY MANAGEMENT
// Get orders assigned to delivery person
export const getDeliveryPersonOrders = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;
    
    const orders = await Order.find({ 
      deliveryPerson: deliveryPersonId,
      status: { $in: ['dispatched', 'delivered', 'not-delivered'] }
    })
      .populate('userId', 'name email phone') // Add this line to populate user data
      .populate('cakeDetails.cakeCategory')
      .populate('deliveryDetails.city')
      .sort({ updatedAt: -1 });
    
    // Transform the data to match the expected structure in the frontend
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      // Add user object that the frontend expects
      orderObj.user = orderObj.userId || {};
      // Add delivery address and city that the frontend expects
      orderObj.deliveryAddress = orderObj.deliveryDetails ? orderObj.deliveryDetails.address : '';
      orderObj.city = orderObj.deliveryDetails && orderObj.deliveryDetails.city ? 
                     orderObj.deliveryDetails.city.name : '';
      
      return orderObj;
    });    
    return response(res, 200, { orders: transformedOrders });
  } catch (error) {
    console.error('Error fetching delivery person orders:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};


// Update delivery status (delivery person only)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusNote } = req.body;
    
    // Only allow specific status updates for delivery person
    const allowedStatuses = ['delivered', 'not-delivered'];
    
    if (!allowedStatuses.includes(status)) {
      return response(res, 400, { message: 'Invalid status value for delivery person' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, statusNote },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Delivery status updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};


// Assign delivery person to order (admin only)
export const assignDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPersonId } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        deliveryPerson: deliveryPersonId,
        status: 'dispatched' // Automatically update status to dispatched
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { 
      message: 'Delivery person assigned successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error assigning delivery person:', error);
    return response(res, 500, ResTypes.errors.upadate_error);
  }
};

