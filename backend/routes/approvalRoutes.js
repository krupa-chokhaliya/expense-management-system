import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';
import { myPendingApprovals, actOnApproval, adminOverride } from '../controllers/approvalController.js';

const router = express.Router();

router.use(protect);
router.get('/my', allowRoles('Admin', 'Manager'), myPendingApprovals);
router.post('/:approvalId/action', allowRoles('Admin', 'Manager'), actOnApproval);
router.post('/override/:expenseId', allowRoles('Admin'), adminOverride);

export default router;
