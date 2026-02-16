import { Router } from "express";

import requireAuth from "../middleware/requireAuth";

const router = Router();

router.get("/handshake", requireAuth, (request, response) => {
    response.status(200).json({ valid: true });
});

export default router;
