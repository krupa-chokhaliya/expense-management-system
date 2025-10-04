import express from 'express';
import { body } from 'express-validator';
import { signup, login, me } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('companyName').notEmpty(),
    body('baseCurrency').isString().isLength({ min: 3, max: 3 }),
  ],
  signup
);

router.post('/login', login);
router.get('/me', protect, me);

export default router;
