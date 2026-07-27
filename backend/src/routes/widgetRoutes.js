import express from 'express';
import { getWidgetConfig, updateWidgetConfig, getPublicWidgetConfig } from '../controllers/widgetController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateWidgetSchema } from '../validators/widgetValidator.js';

const router = express.Router();

router.get('/config', authenticateToken, getWidgetConfig);
router.put('/config', authenticateToken, validate(updateWidgetSchema), updateWidgetConfig);
router.get('/public-config/:apiKey', getPublicWidgetConfig);

export default router;
