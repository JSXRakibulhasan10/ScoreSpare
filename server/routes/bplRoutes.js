import express from 'express';
import bplController from '../controllers/bplController.js';

const router = express.Router();

// BPL Fixtures Routes
// GET /api/bpl/fixtures?limit=10&date=2025-01-01
router.get('/fixtures', bplController.getBPLFixtures);

// BPL Standings
// GET /api/bpl/standings
router.get('/standings', bplController.getBPLStandings);

// BPL Live Matches
// GET /api/bpl/live
router.get('/live', bplController.getBPLLiveMatches);

// BPL History
// GET /api/bpl/history
router.get('/history', bplController.getBPLHistory);

export default router;