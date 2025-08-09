import express from "express";
import { getLeagueStandings } from "../controllers/standingsController.js";

const router = express.Router();

router.get("/:leagueCode", getLeagueStandings); // Example: /api/standings/PL?season=2024

export default router;
