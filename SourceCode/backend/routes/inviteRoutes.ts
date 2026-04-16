import { Router } from "express";

import { acceptInvite, declineInvite, getMyInvites, revokeInvite } from "../controllers/inviteController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/invites

// Middleware
router.use(requireAuth);
// Protected Routes
router.get("/invites/my-invites", getMyInvites);
router.post("/invites/:inviteId/accept", acceptInvite);
router.post("/invites/:inviteId/decline", declineInvite);
router.delete("/invites/:inviteId", revokeInvite);

export default router;
