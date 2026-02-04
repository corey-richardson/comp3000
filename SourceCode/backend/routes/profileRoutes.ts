import { Router } from "express";

import { getProfile, updateProfile } from "../controllers/profileController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/profiles

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/:id", getProfile);
router.patch("/:id", updateProfile);

export default router;
