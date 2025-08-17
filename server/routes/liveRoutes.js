// routes/liveRoutes.js
import express from 'express';
import { getLiveScores } from '../controllers/liveController.js';

const router = express.Router();

// GET /api/live-matches - Get current live scores
router.get('/', getLiveScores);


export default router;