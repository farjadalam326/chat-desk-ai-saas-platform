import express from 'express';
import { signup, login, googleAuth, logout, getMe, getAgents, inviteAgent, removeAgent } from '../controllers/authController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { signupSchema, loginSchema, inviteUserSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

// Team management routes (Tenant Isolated)
router.get('/users', authenticateToken, getAgents);
router.post('/users/invite', authenticateToken, requireRole(['owner', 'admin']), validate(inviteUserSchema), inviteAgent);
router.delete('/users/:id', authenticateToken, requireRole(['owner', 'admin']), removeAgent);

export default router;
