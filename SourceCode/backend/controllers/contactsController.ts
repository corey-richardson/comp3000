import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { requireRoleInSharedClubOrDataOwnership } from "../utils/authUtils";

// POST /api/contacts/user/:userId
export const createContact = async (request: Request, response: Response) => {
    const { userId: targetUserId } = request.params as { userId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const isAuthorised = targetUserId === requestingUserId;
        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const newContact = await prisma.emergencyContact.create({
            data: {
                userId: targetUserId,
                ...request.body,
                updated_at: new Date(),
            },
        });

        return response.status(201).json(newContact);
    } catch (_error) {
        return response.status(500).json({ error: "Internal Server Error." });
    }

};

// GET /api/contacts/user/:userId
export const getContactsByUser = async (request: Request, response: Response) => {
    const { userId: targetUserId } = request.params as { userId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            targetUserId,
            ["ADMIN", "CAPTAIN"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        };

        const [ user, contacts ] = await Promise.all([
            prisma.profile.findUnique({
                where: { id: targetUserId },
                select: {
                    firstName: true,
                    lastName: true,
                }
            }),
            prisma.emergencyContact.findMany({
                where: { userId: targetUserId },
                orderBy: { name: "asc" },
                include: {
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            })
        ]);

        return response.status(200).json({
            user,
            contacts
        });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

// PATCH /api/contacts/:id
export const updateContact = async (request: Request, response: Response) => {
    const { id } = request.params as { id: string };
    const requestingUserId = (request as any).user.id;

    const { name, phoneNumber, emailAddress, relationshipToUser } = request.body.contact;

    if (!name?.trim() || !phoneNumber?.trim()) {
        return response.status(400).json({ error: "Name and Phone Number fields are required." });
    }

    try {
        const contact = await prisma.emergencyContact.findUnique({
            where: { id },
        });

        if (!contact) {
            return response.status(404).json({ error: "Contact not found." });
        };

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            contact.userId,
            ["ADMIN", "CAPTAIN"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        };

        const updatedContact = await prisma.emergencyContact.update({
            where: { id },
            data: {
                name,
                phoneNumber,
                emailAddress,
                relationshipToUser,
                updated_at: new Date(),
            },
        });

        return response.status(200).json(updatedContact);
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

// DELETE /api/contacts/:id
export const deleteContact = async (request: Request, response: Response) => {
    const { id } = request.params as { id: string };
    const requestingUserId = (request as any).user.id;

    try {
        const contact = await prisma.emergencyContact.findUnique({
            where: { id },
        });

        if (!contact) {
            return response.status(404).json({ error: "Contact not found." });
        }

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            contact.userId,
            ["ADMIN", "CAPTAIN"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        };

        await prisma.emergencyContact.delete({
            where: { id },
        });

        return response.status(204).send();

    } catch (_error) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};
