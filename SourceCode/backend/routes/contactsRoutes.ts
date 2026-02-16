import { Router } from "express";

import { createContact, getContactsByUser, updateContact, deleteContact } from "../controllers/contactsController";
import requireAuth from "../middleware/requireAuth";

const router = Router();

// Relative to /api/contacts

// MIDDLEWARE
router.use(requireAuth);
// PROTECTED ROUTES
router.get("/user/:userId", getContactsByUser);
router.post("/user/:userId", createContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
