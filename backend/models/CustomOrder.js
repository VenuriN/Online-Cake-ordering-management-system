// backend\models\CustomOrder.js
import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  // Remove the orderId field
  // Other fields...
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cakeSize: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4'] // Size categories
  },
  cakeShape: {
    type: String,
    required: true,
    enum: ['round', 'square', 'rectangle', 'heart', 'custom']
  },
  cakeFlavor: {
    type: String,
    required: true
  },
  frosting: {
    type: String,
    required: true
  },
  toppings: {
    type: [String],
    default: []
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  addonsPrice: {
    type: Number,
    required: true,
    default: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: {
        type: String
      }
    }
  ],
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  }
}, {
  timestamps: true
});

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;
