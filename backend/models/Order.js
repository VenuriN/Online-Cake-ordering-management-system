import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  cakeDetails: {
    cakeSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: true
    },
    cakeCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CakeCategory',
      required: true
    },
    addons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addon'
    }],
    specialInstructions: {
      type: String,
      trim: true
    },
    designImage: {
      type: String // This will store the path to the uploaded design image
    }
  },
  deliveryDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    addonsPrice: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'bank'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    cardDetails: {
        cardNumber: String,
        cardName: String,
        expiryDate: String,
        cvv: String
      },
      receiptImage: {
        type: String
      },
      paymentNote: {
        type: String
      }
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'not-delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPerson'
    },
    statusNote: {
      type: String
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
}, { timestamps: true });
  
  // Generate a unique order number before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
      // Create order number format: HSC-YYYYMMDD-XXXX (XXXX is a random 4-digit number)
      const date = new Date();
      const dateStr = date.getFullYear().toString() +
                     (date.getMonth() + 1).toString().padStart(2, '0') +
                     date.getDate().toString().padStart(2, '0');
      
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      this.orderNumber = `HSC-${dateStr}-${randomNum}`;
    }
    next();
});
  
const Order = mongoose.model('Order', orderSchema);
  
export default Order;
