import { Router } from "express";

import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/clubs

// Middleware
router.use(requireAuth);
// Protected Routes
router.post("/", () => {});

export default router;
