import { Router } from "express";

import { createClub, getClubById, getMyClubs } from "../controllers/clubController";
import { createInvite, getInvitesByClub, getRecentClubUpdates } from "../controllers/inviteController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
// Invites
router.get("/:clubId/invites/activity", getRecentClubUpdates);
router.get("/:clubId/invites", getInvitesByClub);
router.post("/:clubId/invites", createInvite);
// Clubs
router.post("/", createClub);
router.get("/my-clubs", getMyClubs);
router.get("/:clubId", getClubById);

export default router;
