import express from 'express';
import {
  createDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  deleteDeliveryPerson,
  loginDeliveryPerson,
  changePassword
} from '../Controllers/DeliveryPersonController.js';

const router = express.Router();

// Public routes
router.post('/login', loginDeliveryPerson);

// Delivery person routes
router.put('/:id/change-password', changePassword);

// Admin routes
router.post('/', createDeliveryPerson);
router.get('/',  getAllDeliveryPersons);
router.get('/:id',  getDeliveryPersonById);
router.put('/:id', updateDeliveryPerson);
router.delete('/:id',deleteDeliveryPerson);

export default router;
