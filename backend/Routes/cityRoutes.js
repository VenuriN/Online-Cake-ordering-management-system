import express from 'express';
import {
  getAllCities,
  createCity,
  updateCity,
  deleteCity
} from '../controllers/cityController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCities);

// Admin routes
router.post('/',  createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
