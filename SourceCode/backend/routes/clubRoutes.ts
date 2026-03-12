import { Router } from "express";

import { createClub, deleteMembership, getClubById, getMyClubs } from "../controllers/clubController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
router.post("/", createClub);
router.get("/my-clubs", getMyClubs);
router.get("/:clubId", getClubById);
router.delete("/memberships/:membershipId", deleteMembership);

export default router;
