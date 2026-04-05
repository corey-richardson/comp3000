import { Router } from "express";

import { getInvitesByClub, revokeInvite } from "../controllers/inviteController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api

// Middleware
router.use(requireAuth);
// Protected Routes
// Relative to /api/clubs
router.get("/clubs/:clubId/invites", getInvitesByClub);

// Relative to /api/invites
router.delete("/invites/:inviteId", revokeInvite);

export default router;
