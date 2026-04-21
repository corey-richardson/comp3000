import { Router } from "express";

import { deleteUser, loginUser, signupUser } from "../controllers/userController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/users

// Public routes
router.post("/login", loginUser);
router.post("/signup", signupUser);
// Middleware
router.use(requireAuth);
// Protected Routes
router.delete("/delete", deleteUser);

export default router;
