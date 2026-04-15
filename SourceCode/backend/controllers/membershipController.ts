import { Role } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { requireRoleInSpecificClubOrDataOwnership } from "../utils/authUtils";

// GET /api/clubs/:clubId/member/:userId
export const getMembership = async (request: Request, response: Response) => {
    const { clubId, userId } = request.params as { clubId: string, userId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const isAuthorised = await requireRoleInSpecificClubOrDataOwnership(
            requestingUserId,
            userId,
            clubId,
            [Role.ADMIN, Role.CAPTAIN, Role.RECORDS, Role.COACH],
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const membership = await prisma.membership.findFirst({
            where: {
                clubId: clubId,
                userId: userId,
                ended_at: null
            }
        });

        if (!membership) {
            return response.status(404).json({ error: "Membership not found." });
        }

        return response.status(200).json(membership);
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

// PATCH /api/clubs/:clubId/member/:userId
export const updateMembership = async (request: Request, response: Response) => {
    const { clubId, userId } = request.params as { clubId: string, userId: string };
    const { roles } = request.body;

    try {
        if (!roles) {
            return response.status(404).json({ error: "Roles required." });
        }

        const currentMembership = await prisma.membership.findFirst({
            where: {
                clubId, userId,
                ended_at: null
            },
        });

        if (!currentMembership) {
            return response.status(404).json({ error: "Membership not found." });
        }

        const wasAdmin = currentMembership.roles.includes("ADMIN");
        const willBeAdmin = roles.includes("ADMIN");

        if (wasAdmin && !willBeAdmin) {
            const otherAdminCount = await prisma.membership.count({
                where: {
                    clubId,
                    userId: { not: userId },
                    ended_at: null,
                    roles: { has: Role.ADMIN },
                }
            });

            if (otherAdminCount === 0) {
                return response.status(400).json({
                    error: "Cannot remove the last Admin. Please appoint another Admin first, or instead delete the club."
                });
            }
        }

        const updatedMembership = await prisma.membership.update({
            where: {
                id: currentMembership.id
            },
            data: {
                roles: roles
            }
        });

        return response.status(200).json(updatedMembership);
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal server error." });
    }
};

// DELETE /api/clubs/memberships/:membershipId
export const deleteMembership = async (request: Request, response: Response) => {
    const { membershipId } = request.params as { membershipId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const membership = await prisma.membership.findUnique({
            where: { id: membershipId },
        });

        if (!membership) {
            return response.status(404).json({ error: "Membership not found." });
        }

        const isAuthorised = await requireRoleInSpecificClubOrDataOwnership(
            requestingUserId,
            membership.userId,
            membership.clubId,
            [Role.ADMIN],
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        if (membership.roles.includes(Role.ADMIN)) {
            const otherAdminCount = await prisma.membership.count({
                where: {
                    clubId: membership.clubId,
                    userId: { not: membership.userId },
                    ended_at: null,
                    roles: { has: Role.ADMIN },
                }
            });

            if (otherAdminCount === 0) {
                return response.status(400).json({
                    error: "Cannot remove the last Admin. Please appoint another Admin first, or instead delete the club."
                });
            }
        }

        await prisma.membership.update({
            where: { id: membershipId },
            data: {
                ended_at: new Date(),
                roles: []
            },
        });

        return response.status(200).json({ message: "Membership deleted." });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};
