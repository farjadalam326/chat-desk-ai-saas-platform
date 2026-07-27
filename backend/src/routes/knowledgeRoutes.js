import express from 'express';
import {
  getDocuments,
  createDocument,
  crawlUrl,
  deleteDocument,
  reindexKnowledge,
} from '../controllers/knowledgeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createDocumentSchema, crawlUrlSchema } from '../validators/knowledgeValidator.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDocuments);
router.post('/text', validate(createDocumentSchema), createDocument);
router.post('/crawl', validate(crawlUrlSchema), crawlUrl);
router.delete('/:id', deleteDocument);
router.post('/reindex', reindexKnowledge);

export default router;
