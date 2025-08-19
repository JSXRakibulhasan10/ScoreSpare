// routes/chatbotRoutes.js
import express from 'express';
import { handleChatMessage, getChatbotStatus } from '../controllers/GeminiChatBotController.js';

const router = express.Router();



router.post('/message', handleChatMessage);

/**
 * @route GET /api/chatbot/status
 * @desc Get chatbot status and capabilities
 * @returns { success: boolean, status: string, message: string, capabilities: array, timestamp: string }
 */
router.get('/status', getChatbotStatus);

export default router;