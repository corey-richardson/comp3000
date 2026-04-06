import { Router } from "express";

import { acceptInvite, createInvite, declineInvite,getInvitesByClub, getMyInvites, revokeInvite } from "../controllers/inviteController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api

// Middleware
router.use(requireAuth);
// Protected Routes
// Relative to /api/clubs
router.get("/clubs/:clubId/invites", getInvitesByClub);
router.post("/clubs/:clubId/invites", createInvite);

// Relative to /api/invites
router.get("/invites/my-invites", getMyInvites);
router.post("/invites/:inviteId/accept", acceptInvite);
router.post("/invites/:inviteId/decline", declineInvite);
router.delete("/invites/:inviteId", revokeInvite);

export default router;
