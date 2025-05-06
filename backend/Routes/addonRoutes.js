import express from 'express';
import {
  getAllAddons,
  createAddon,
  updateAddon,
  deleteAddon
} from '../controllers/addonController.js';

const router = express.Router();

// Public routes
router.get('/', getAllAddons);

// Admin routes
router.post('/',createAddon);
router.put('/:id',updateAddon);
router.delete('/:id',  deleteAddon);

export default router;
