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
};

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

        const currentProfile = await prisma.profile.findUnique({
            where: {
                id: targetUserId
            },
            select: {
                membershipNumber: true
            }
        });

        if (!currentProfile) return response.status(404).json({ error: "Profile not found." });

        // Will this work if a value isn't set? membershipNumber not a required field so
        // could falsely match against someone else's "null" membershipNumber if not set.
        // if (username || email || membershipNumber) {
        //     const conflict = await prisma.profile.findFirst({
        //         where: {
        //             OR: [
        //                 { username },
        //                 { email },
        //                 { membershipNumber },
        //             ],
        //             NOT: { id: targetUserId },
        //         },
        //     });

        const uniqueFields = [];
        if (username) uniqueFields.push({ username });
        if (email) uniqueFields.push({ email });
        if (membershipNumber) uniqueFields.push({ membershipNumber });

        if (uniqueFields.length > 0) {

            const conflict = await prisma.profile.findFirst({
                where: {
                    OR: uniqueFields,
                    NOT: { id: targetUserId },
                },
            });

            if (conflict) {
                return response.status(409).json({ error: "Membership number already assigned to another user." });
            }
        }

        const updatedProfile = await prisma.$transaction(async (tx) => {
            if (membershipNumber !== undefined &&
                membershipNumber !== currentProfile.membershipNumber
            ) {

                if (currentProfile.membershipNumber) {
                    await tx.invite.updateMany({
                        where: {
                            membershipNumber: currentProfile.membershipNumber,
                            userId: targetUserId
                        },
                        data: {
                            userId: null
                        }
                    });
                }

                if (membershipNumber) {
                    await tx.invite.updateMany({
                        where: {
                            membershipNumber: membershipNumber,
                            userId: null,
                            status: "PENDING"
                        },
                        data: {
                            userId: targetUserId
                        }
                    });
                }
            }

            return await tx.profile.update({
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
        });

        response.status(200).json(updatedProfile);
    } catch (error: any) {
        response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
};

// PATCH /api/profiles/:id/summary
export const updateRecordsSummary = async (request: Request, response: Response) => {
    const { id: userId } = request.params as { id: string };

    const {
        indoorClassification,
        indoorClassificationBadgeGiven,
        indoorHandicap,
        outdoorClassification,
        outdoorClassificationBadgeGiven,
        outdoorHandicap,
        notes
    } = request.body;

    try {
        const summary = await prisma.recordsSummary.upsert({
            where: { userId },
            update: {
                indoorClassification,
                indoorClassificationBadgeGiven,
                indoorHandicap: indoorHandicap !== null ? parseInt(indoorHandicap) : null,
                outdoorClassification,
                outdoorClassificationBadgeGiven,
                outdoorHandicap: outdoorHandicap !== null ? parseInt(outdoorHandicap) : null,
                notes
            },
            create: {
                userId: userId,
                indoorClassification: indoorClassification || "UNCLASSIFIED",
                indoorClassificationBadgeGiven,
                indoorHandicap: indoorHandicap !== null ? parseInt(indoorHandicap) : null,
                outdoorClassification: outdoorClassification || "UNCLASSIFIED",
                outdoorClassificationBadgeGiven,
                outdoorHandicap: outdoorHandicap !== null ? parseInt(outdoorHandicap) : null,
                notes
            },
        });

        response.status(200).json(summary);
    } catch (_error: any) {
        response.status(500).json({ error: "Failed to save records summary." });
    }
};

// DELETE:
/** CASCADE:
 * - Memberships
 * - Scores
 * - Emergency Contacts
 * - Records Summary
 * - Invites Sent
 */
/** NULL:
 * - Invites Received
 * - Scores verifiedBy
 */
