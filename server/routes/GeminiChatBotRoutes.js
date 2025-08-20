// routes/chatbotRoutes.js
import express from 'express';
import { handleChatMessage, getChatbotStatus } from '../controllers/GeminiChatBotController.js';

const router = express.Router();

router.post('/message', handleChatMessage);

//ChatBot status route
router.get('/status', getChatbotStatus);

export default router;