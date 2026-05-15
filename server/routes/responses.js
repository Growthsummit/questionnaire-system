import { Router } from 'express';
import { getResponses, createResponse } from '../controllers/responsesController.js';

const router = Router();
router.get('/', getResponses);
router.post('/', createResponse);
export default router;
