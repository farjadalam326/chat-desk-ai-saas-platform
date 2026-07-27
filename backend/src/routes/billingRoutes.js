import express from 'express';
import { getUsage, createCheckoutSession, handleWebhook, getPublicPlans, confirmPayment, cancelSubscription, getInvoices } from '../controllers/billingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPublicPlans);
router.post('/webhook', handleWebhook);

router.use(authenticateToken);
router.get('/usage', getUsage);
router.get('/invoices', getInvoices);
router.post('/checkout', createCheckoutSession);
router.post('/confirm-payment', confirmPayment);
router.post('/cancel', cancelSubscription);

export default router;
