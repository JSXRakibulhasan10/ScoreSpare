import express from 'express';
import uclController from '../controllers/uclController.js';

const router = express.Router();

// UCL Fixtures Routes
// GET /api/ucl/fixtures?limit=10&stage=GROUP_STAGE
router.get('/fixtures', uclController.getUCLFixtures);

// UCL Standings/Groups
// GET /api/ucl/standings
router.get('/standings', uclController.getUCLStandings);

// UCL Live Matches
// GET /api/ucl/live
router.get('/live', uclController.getUCLLiveMatches);

export default router;