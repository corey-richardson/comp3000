import { Router } from "express";

import { createScore, getScoresByClub, getScoresByUser } from "../controllers/scoreController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/scores

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/user/:userId", getScoresByUser);
router.get("/club/:clubId", getScoresByClub);
router.post("/", createScore);

export default router;
