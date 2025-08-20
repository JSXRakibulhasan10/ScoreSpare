import express from "express";
import bplController from "../controllers/bplController.js";

const router = express.Router();

// BPL Fixtures Routes
router.get("/fixtures", bplController.getBPLFixtures);

// BPL Standings
router.get("/standings", bplController.getBPLStandings);

// BPL Live Matches
router.get("/live", bplController.getBPLLiveMatches);

// BPL History
router.get("/history", bplController.getBPLHistory);

export default router;
