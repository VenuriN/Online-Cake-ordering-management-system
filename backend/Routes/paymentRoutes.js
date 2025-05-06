import express from 'express';
import {
  getAllPayments,
  getPaymentByOrderId,
  updatePaymentStatus
} from '../controllers/paymentController.js';

const router = express.Router();

// User routes
router.get('/order/:orderId', getPaymentByOrderId);

// Admin routes
router.get('/', getAllPayments);
router.put('/:id/status',  updatePaymentStatus);

export default router;
