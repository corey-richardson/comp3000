import { Router } from "express";

import { getProfile, updateProfile, updateRecordsSummary } from "../controllers/profileController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/profiles

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/:id", getProfile);
router.patch("/:id", updateProfile);
router.patch("/:id/summary", updateRecordsSummary);

export default router;
