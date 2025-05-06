import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import response from '../Utils/ResponseHandler/ResponseHandler.js';
import ResTypes from '../Utils/ResponseHandler/ResTypes.js';

// Get all payments (admin only)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('orderId')
      .populate('userId')
      .populate('processedBy')
      .sort({ createdAt: -1 });
    
    return response(res, 200, { payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ orderId })
      .populate('orderId')
      .populate('userId')
      .populate('processedBy');
    
    if (!payment) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    return response(res, 200, { payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return response(res, 400, { message: 'Invalid status value' });
    }
    
    // Make sure id is valid
    if (!id || id === 'undefined') {
      return response(res, 400, { message: 'Invalid payment ID' });
    }
    
    const payment = await Payment.findById(id);
    
    if (!payment) {
      return response(res, 404, ResTypes.errors.not_found);
    }
    
    // Update payment
    payment.status = status;
    payment.adminNote = adminNote || '';
    payment.processedAt = new Date();
    // Remove dependency on req.user
    // payment.processedBy = req.user ? req.user._id : null;
    
    await payment.save();
    
    // Also update the payment status in the order
    // Make sure orderId exists before trying to update the order
    if (payment.orderId) {
      await Order.findByIdAndUpdate(
        payment.orderId,
        { 'payment.status': status, 'payment.paymentNote': adminNote || '' }
      );
    }
    
    // Fetch the updated order to return
    const order = payment.orderId ? await Order.findById(payment.orderId) : null;
    
    return response(res, 200, { 
      message: 'Payment status updated successfully',
      payment,
      order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return response(res, 500, ResTypes.errors.server_error);
  }
};

