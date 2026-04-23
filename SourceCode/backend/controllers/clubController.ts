import { Role } from "@prisma/client";
import { request, Request, Response } from "express";

import prisma from "../lib/prisma";
import { requireRoleInClub } from "../utils/authUtils";

// POST /api/clubs
export const createClub = async (request: Request, response: Response) => {
    const { clubName: name } = request.body;
    const requestingUserId = (request as any).user.id;

    if (!name) {
        return response.status(400).json({ error: "Club Name is required." });
    }

    try {
        const newClub = await prisma.$transaction(async (tx) => {
            const club = await tx.club.create({
                data: { name }
            });

            await tx.membership.create({
                data: {
                    clubId: club.id,
                    userId: requestingUserId,
                    roles: [ Role.ADMIN, Role.MEMBER ]

                }
            });

            return club;
        });

        return response.status(201).json(newClub);

    } catch (error: any) {
        if (error.code === "P2002") {
            return response.status(409).json({ error: "Club Name already in use." });
        }

        return response.status(500).json({ error: "Internal Server Error." });
    }
};

// GET /api/clubs/:id
export const getClubById = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const isMember = await requireRoleInClub(requestingUserId, clubId, [ Role.MEMBER ]);
        if (!isMember) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const [isAdmin, isCaptain, isRecords] = await Promise.all([
            requireRoleInClub(requestingUserId, clubId, [Role.ADMIN]),
            requireRoleInClub(requestingUserId, clubId, [Role.CAPTAIN]),
            requireRoleInClub(requestingUserId, clubId, [Role.RECORDS]),
        ]);

        const club = await prisma.club.findUnique({
            where: { id: clubId },
            include: {
                members: {
                    where: {
                        ended_at: null,
                    },
                    include: {
                        profile: {
                            include: {
                                emergencyContacts: true,
                            }
                        }
                    }
                }
            }
        });

        if (!club) {
            return response.status(404).json({ error: "Club not found." });
        }

        const memberCount = club.members.length;

        const stripMemberPii = club.members.map((member) => {
            const isOwner = member.userId === requestingUserId;

            return {
                id: member.id,
                userId: member.userId,
                clubId: member.clubId,

                firstName: member.profile.firstName,
                lastName: member.profile.lastName,
                username: member.profile.username,
                roles: member.roles,

                email: (isAdmin || isOwner) ? member.profile.email : null,
                emergencyContacts: (isAdmin || isCaptain || isOwner) ? member.profile.emergencyContacts : null,
                membershipNumber: (isAdmin || isCaptain || isRecords || isOwner) ? member.profile.membershipNumber : null,
                sex: (isAdmin || isCaptain || isRecords || isOwner) ? member.profile.sex : null,
                yearOfBirth: (isAdmin || isCaptain || isRecords || isOwner) ? member.profile.yearOfBirth : null,
            };
        });

        return response.status(200).json({
            ...club,
            memberCount,
            members: stripMemberPii,
        });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

// GET /api/clubs/my-clubs
export const getMyClubs = async (request: Request, response: Response) => {
    const requestingUserId = (request as any).user.id;

    const limit = request.query.limit ? parseInt(request.query.limit as string) : 10;
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const roleSortOrder: Record<Role, number> = {
        [Role.ADMIN]: 1,
        [Role.CAPTAIN]: 2,
        [Role.RECORDS]: 3,
        [Role.COACH]: 4,
        [Role.MEMBER]: 5,
    };

    try {
        const [ memberships, totalCount ] = await Promise.all([
            prisma.membership.findMany({
                where: {
                    userId: requestingUserId,
                    ended_at: null
                },
                // Include number of members in return value
                include: {
                    club: {
                        include: {
                            _count: {
                                select: {
                                    members: {
                                        where: {
                                            ended_at: null
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            prisma.membership.count({
                where: {
                    userId: requestingUserId,
                    ended_at: null
                }
            })
        ]);

        const result = memberships.map(m => ({
            ...m,
            memberCount: m.club._count.members
        }));

        result.sort((a, b) => {
            const priorityA = Math.min(...a.roles.map(r => roleSortOrder[r] || 99));
            const priorityB = Math.min(...b.roles.map(r => roleSortOrder[r] || 99));

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return a.club.name.localeCompare(b.club.name);
        });

        const paginatedResult = result.slice(skip, skip + limit);

        return response.status(200).json({
            memberships: paginatedResult,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

/**
deleteClub
- include clubId in request params
- try
    - club.findUnique
    - if not club, return 404

    club.delete
    return 204
- catch
    - return 500
*/

export const deleteClub = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };

    try {
        const club = await prisma.club.findUnique({
            where: {
                id: clubId
            },
        });

        if (!club) {
            return response.status(404).json({ error: "Club not found." });
        }

        await prisma.club.delete({
            where: {
                id: clubId
            },
        });

        return response.status(204).send();
    } catch (_error) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};
