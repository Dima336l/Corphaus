import express from 'express';
import { signup, login, getCurrentUser, upgradeToPaid } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/upgrade', authenticate, upgradeToPaid);

export default router;

