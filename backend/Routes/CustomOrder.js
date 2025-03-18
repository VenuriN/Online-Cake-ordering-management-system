import express from 'express';
import {
  getCustomOrderOptions,
  calculatePrice,
  createCustomOrder,
  getCustomOrderById,
  getUserOrders,
  cancelOrder,
  updateOrderStatus,
  getAllOrders
} from '../Controllers/CustomOrderController.js';
import { VerifyToken, VerifyAdmin } from '../Utils/VerifyToken.js';
import Upload from '../Middleware/Upload.js';

const router = express.Router();

// Public routes
router.get('/options', getCustomOrderOptions);
router.post('/calculate-price', calculatePrice);

// Customer routes (protected)
router.post('/create', VerifyToken, Upload.single('bankSlip'), createCustomOrder);
router.get('/my-orders', VerifyToken, getUserOrders);
router.get('/:orderId', VerifyToken, getCustomOrderById);
router.put('/:orderId/cancel', VerifyToken, cancelOrder);

// Admin routes
router.get('/admin/all', getAllOrders);
router.put('/:orderId/status', updateOrderStatus);

export default router;
