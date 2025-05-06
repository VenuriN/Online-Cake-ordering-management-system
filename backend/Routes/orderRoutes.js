import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  assignDeliveryPerson,
  updateOrderDeliveryDetails,
  cancelOrder,
  getDeliveryPersonOrders,
  updateDeliveryStatus
} from '../controllers/orderController.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Configure file upload middleware
router.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  createParentPath: true
}));

// Public routes
router.post('/', createOrder);

// User routes
router.get('/user/:userId', getUserOrders);
router.get('/:id',  getOrderById);
router.put('/:id/delivery-details',  updateOrderDeliveryDetails);
router.put('/:id/cancel',  cancelOrder);

// Admin routes
router.get('/',  getAllOrders);
router.put('/:id/status', updateOrderStatus);




// Delivery person routes
router.get('/delivery-person/:deliveryPersonId', getDeliveryPersonOrders);
router.put('/:id/delivery-status',  updateDeliveryStatus);
router.put('/:id/assign-delivery', assignDeliveryPerson);


export default router;
