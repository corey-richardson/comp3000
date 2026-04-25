import { Router } from "express";

import { acceptInvite, declineInvite, getMyInvites, revokeInvite } from "../controllers/inviteController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/invites

// Middleware
router.use(requireAuth);
// Protected Routes
router.get("/my-invites", getMyInvites);
router.post("/:inviteId/accept", acceptInvite);
router.post("/:inviteId/decline", declineInvite);
router.delete("/:inviteId", revokeInvite);

export default router;
