import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { createExpense, listMyExpenses, listCompanyExpenses, listTeamExpenses, upload } from '../controllers/expenseController.js';

const router = express.Router();

router.use(protect);
router.post('/', upload.single('receipt'), createExpense);
router.get('/me', listMyExpenses);
router.get('/team', allowRoles('Manager'), listTeamExpenses);
router.get('/company', allowRoles('Admin'), listCompanyExpenses);

export default router;
