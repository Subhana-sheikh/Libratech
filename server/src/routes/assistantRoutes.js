import { Router } from 'express';
import { chatAssistant } from '../controllers/assistantController.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for assistant: 30 requests per minute
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many queries to the library assistant. Please pause for a moment.'
  }
});

router.post('/chat', assistantLimiter, optionalAuthenticate, chatAssistant);

export default router;
