
import express from 'express'
import fixturesController from '../controllers/fixturesController.js'


const router = express.Router();


// Route to get upcoming fixtures for a specific competition
// GET /api/fixtures?competitionId=PL&limit=10&dateFrom=2024-01-01&dateTo=2024-01-31
router.get('/', fixturesController.getUpcomingFixtures);

// Route to get upcoming fixtures for all top 5 European leagues

router.get('/all', fixturesController.getUpcomingFixturesAllLeagues);

// Route to get upcoming fixtures for a specific team
// GET /api/fixtures/team/81?limit=5
router.get('/team/:teamId', fixturesController.getUpcomingFixturesByTeam);

export default router;