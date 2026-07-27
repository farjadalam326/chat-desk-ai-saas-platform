import express from 'express';
import {
  getConversations,
  getConversationDetails,
  updateStatus,
  assignAgent,
  addNote,
  startPublicChat,
  postMessage,
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  updateStatusSchema,
  assignAgentSchema,
  addNoteSchema,
  publicStartChatSchema,
} from '../validators/chatValidator.js';

const router = express.Router();

// Public chat widget endpoint
router.post('/public/start', validate(publicStartChatSchema), startPublicChat);

// Authenticated Agent / Dashboard endpoints
router.use(authenticateToken);

router.get('/', getConversations);
router.get('/:id', getConversationDetails);
router.post('/:id/messages', postMessage);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);
router.patch('/:id/assign', validate(assignAgentSchema), assignAgent);
router.post('/:id/notes', validate(addNoteSchema), addNote);

export default router;
