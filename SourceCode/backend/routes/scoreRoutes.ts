import { Router } from "express";

import { createScore, deleteScore, getScoreById, getScoresByClub, getScoresByUser, updateScore, updateScoreStatus } from "../controllers/scoreController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/scores

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/user/:userId", getScoresByUser);
router.get("/club/:clubId", getScoresByClub);

router.get("/:scoreId", getScoreById);

router.post("/", createScore);
router.patch("/:scoreId/status", updateScoreStatus);
router.put("/:scoreId", updateScore);
router.delete("/:scoreId", deleteScore);

export default router;
