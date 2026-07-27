import express from 'express';
import { getOverview, getTrends, getUnanswered } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/unanswered', getUnanswered);

export default router;
