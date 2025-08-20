// routes/liveRoutes.js
import express from "express";
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
} from "../controllers/liveController.js";

const router = express.Router();

// Main live scores endpoint (supports query parameters)
router.get("/scores", getLiveScores);

// Get available competitions info
router.get("/competitions", getCompetitions);

// Individual League Routes
router.get("/premier-league", getPremierLeagueLiveScores);
router.get("/la-liga", getLaLigaLiveScores);
router.get("/serie-a", getSerieALiveScores);
router.get("/bundesliga", getBundesligaLiveScores);
router.get("/ligue-1", getLigue1LiveScores);
//UCL live score route
router.get("/champions-league", getUCLLiveScores);

// Specific competition routes (alternative to query parameters)
router.get("/competition/:competitionId", getLiveScoresByCompetition);

export default router;
