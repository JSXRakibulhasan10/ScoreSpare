import express from "express";
import { getSeasons } from "../controllers/competitionController.js";

const router = express.Router();

router.get("/:competitionCode/seasons", getSeasons);

export default router;
