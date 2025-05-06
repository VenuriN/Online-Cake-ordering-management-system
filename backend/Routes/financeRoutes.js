import express from 'express';
import { 
  createFinance, 
  getAllFinances, 
  getFinanceById, 
  updateFinance, 
  deleteFinance, 
  getFinanceCategories,
  generateFinanceReport
} from '../Controllers/FinanceController.js';

const router = express.Router();

// Finance CRUD routes
router.post('/', createFinance);
router.get('/', getAllFinances);
router.get('/categories', getFinanceCategories);
router.get('/report', generateFinanceReport);
router.get('/:id', getFinanceById);
router.put('/:id', updateFinance);
router.delete('/:id', deleteFinance);

export default router;
