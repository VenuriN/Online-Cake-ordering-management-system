import express from 'express';
import {
  getAllCakeCategories,
  createCakeCategory,
  updateCakeCategory,
  deleteCakeCategory
} from '../controllers/cakeCategoryController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCakeCategories);

// Admin routes
router.post('/',  createCakeCategory);
router.put('/:id',  updateCakeCategory);
router.delete('/:id', deleteCakeCategory);

export default router;
