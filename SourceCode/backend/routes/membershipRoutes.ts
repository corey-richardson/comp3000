import { Router } from "express";

import { deleteMembership, getMembership, updateMembership } from "../controllers/membershipController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
router.get("/:clubId/member/:userId", getMembership);
router.patch("/:clubId/member/:userId", updateMembership);
router.delete("/memberships/:membershipId", deleteMembership);

export default router;
