import { Request, Response } from "express";
import prisma from "../lib/prisma";
import * as AuthUtils from "../utils/serverUtils";

// GET /api/profiles/:id
export const getProfile = async (request: Request, response: Response) => {
    const { id: targetUserId } = request.params as { id: string };
    const requestingUser = (request as any).user; // Set by auth middleware

    try {
        const isAuthorised = await AuthUtils.requireRoleInSharedClubOrDataOwnership(
            requestingUser.id,
            targetUserId,
            ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const profile = await prisma.profile.findUnique({
            where: { id: targetUserId },
        });

        if (!profile) {
            return response.status(404).json({ error: "Profile not found." });
        }

        response.status(200).json(profile);
    } catch (error: any) {
        response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
}

// PATCH /api/profiles/:id
export const updateProfile = async (request: Request, response: Response) => {
    const { id: targetUserId } = request.params as { id: string };
    const requestingUser = (request as any).user; // Set by auth middleware

    const { 
        firstName, 
        lastName, 
        username,
        email,
        membershipNumber, 
        sex, 
        yearOfBirth, 
        defaultBowstyle 
    } = request.body;

    try {
        const isAuthorised = await AuthUtils.requireRoleInSharedClubOrDataOwnership(
            requestingUser.id,
            targetUserId,
            ["ADMIN", "CAPTAIN", "RECORDS"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        if (username || email || membershipNumber) {
            const conflict = await prisma.profile.findFirst({
                where: {
                    OR: [
                        { username },
                        { email },
                        { membershipNumber },
                    ],
                    NOT: { id: targetUserId },
                },
            });

            if (conflict) {
                return response.status(409).json({ error: "Membership number already assigned to another user." });
            }
        }

        const updatedProfile = await prisma.$transaction(async (tx) => {
            await tx.invite.updateMany({
                where: { membershipNumber, status: "PENDING" },
                data: { userId: targetUserId },
            });

            const profile = await tx.profile.update({
                where: { id: targetUserId },
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    membershipNumber,
                    sex,
                    yearOfBirth,
                    defaultBowstyle,
                    updated_at: new Date(),
                }
            });

            return profile;
        });

        response.status(200).json(updateProfile);
    } catch (error: any) {
        response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
}
