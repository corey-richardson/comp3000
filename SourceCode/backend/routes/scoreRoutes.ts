import { Router } from "express";

import { createScore, deleteScore, getScoresByClub, getScoresByUser } from "../controllers/scoreController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/scores

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/user/:userId", getScoresByUser);
router.get("/club/:clubId", getScoresByClub);
router.post("/", createScore);
router.delete("/:scoreId", deleteScore);

export default router;
