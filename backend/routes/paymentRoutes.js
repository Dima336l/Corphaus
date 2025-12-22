import express from 'express';
import { createPaymentOrder, handleWebhook, checkPaymentStatus } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Webhook endpoint (no authentication, but should verify signature)
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-order', authenticate, createPaymentOrder);
router.get('/status/:orderId', authenticate, checkPaymentStatus);

export default router;

