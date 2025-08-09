import express from "express";
import { getLiveMatches } from "../controllers/liveController.js";

const router = express.Router();

router.get("/", getLiveMatches);

export default router;
