import { Router } from "express";

import { getRoundsList } from "../controllers/roundsController";

const router = Router();

// Relative to /api/rounds
router.get("/", getRoundsList);

export default router;
