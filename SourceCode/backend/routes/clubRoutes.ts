import { Router } from "express";

import { createClub, getClubById } from "../controllers/clubController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
router.post("/", createClub);
router.get("/:clubId", getClubById);

export default router;
