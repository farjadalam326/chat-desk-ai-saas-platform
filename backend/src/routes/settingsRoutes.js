import express from 'express';
import {
  getSettings,
  updateSettings,
  rotateApiKey,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  addWebhook,
  testWebhook,
  deleteWebhook,
} from '../controllers/settingsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/rotate-key', rotateApiKey);

// Team Member Routes
router.get('/team', getTeamMembers);
router.post('/team/invite', inviteTeamMember);
router.delete('/team/:id', removeTeamMember);

// Webhook Routes
router.post('/webhooks', addWebhook);
router.post('/webhooks/:id/test', testWebhook);
router.delete('/webhooks/:id', deleteWebhook);

export default router;
