// routes/liveRoutes.js
import express from 'express';
import {
  getLiveScores,
  getCompetitions,
  getLiveScoresByCompetition,
  getPremierLeagueLiveScores,
  getLaLigaLiveScores,
  getSerieALiveScores,
  getBundesligaLiveScores,
  getLigue1LiveScores,
  getUCLLiveScores,
} from '../controllers/liveController.js';

const router = express.Router();

// Main live scores endpoint (supports query parameters) - CURRENT FUNCTIONALITY PRESERVED
// GET /api/live-matches/scores
// GET /api/live-matches/scores?competition=top5
// GET /api/live-matches/scores?competition=ucl
// GET /api/live-matches/scores?competition=elite
// GET /api/live-matches/scores?competition=2 (specific ID)
router.get('/scores', getLiveScores);

// Get available competitions info
// GET /api/live-matches/competitions
router.get('/competitions', getCompetitions);

// Individual League Routes (for your buttons)
// GET /api/live-matches/premier-league
router.get('/premier-league', getPremierLeagueLiveScores);

// GET /api/live-matches/la-liga
router.get('/la-liga', getLaLigaLiveScores);

// GET /api/live-matches/serie-a
router.get('/serie-a', getSerieALiveScores);

// GET /api/live-matches/bundesliga
router.get('/bundesliga', getBundesligaLiveScores);

// GET /api/live-matches/ligue-1
router.get('/ligue-1', getLigue1LiveScores);

// GET /api/live-matches/champions-league
router.get('/champions-league', getUCLLiveScores);

// Alternative shorter routes (optional)
// GET /api/live-matches/epl
router.get('/epl', getPremierLeagueLiveScores);

// GET /api/live-matches/ucl
router.get('/ucl', getUCLLiveScores);

// Specific competition routes (alternative to query parameters)
// GET /api/live-matches/competition/2 (Premier League)
// GET /api/live-matches/competition/244 (Champions League)
router.get('/competition/:competitionId', getLiveScoresByCompetition);



export default router;