
import express from 'express'
import fixturesController from '../controllers/fixturesController.js'

const router = express.Router();

// Route to get upcoming fixtures for a specific competition
router.get('/', fixturesController.getUpcomingFixtures);

// Route to get upcoming fixtures for all top 5 European leagues
router.get('/all', fixturesController.getUpcomingFixturesAllLeagues);

// Route to get upcoming fixtures for a specific team
router.get('/team/:teamId', fixturesController.getUpcomingFixturesByTeam);

export default router;