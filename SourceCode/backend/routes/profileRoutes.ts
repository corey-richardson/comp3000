import { Router } from "express";
import requireAuth from "../middleware/requireAuth";

import { getProfile, updateProfile } from "../controllers/profileController";

const router = Router();

// Relative to /api/profiles

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/:id", getProfile);
router.patch("/:id", updateProfile);

export default router;
