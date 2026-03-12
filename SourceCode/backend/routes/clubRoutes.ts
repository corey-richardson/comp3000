import { Router } from "express";

import { createClub, getClubById, getMyClubs } from "../controllers/clubController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
router.post("/", createClub);
router.get("/my-clubs", getMyClubs);
router.get("/:clubId", getClubById);

export default router;
