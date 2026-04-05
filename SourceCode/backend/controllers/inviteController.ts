import { InviteStatus } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { requireRoleInClub } from "../utils/serverUtils";

export const getInvitesByClub = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };
    const requestingUserId = (request as any).user.id;

    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const limit = request.query.limit ? parseInt(request.query.limit as string) : 10;
    const skip = (page - 1) * limit;

    try {
        const isAuthorised = await requireRoleInClub(requestingUserId, clubId, ["ADMIN"]);

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const [ invites, totalCount ] = await Promise.all([
            prisma.invite.findMany({
                where: {
                    clubId,
                    status: InviteStatus.PENDING,
                },
                skip: skip,
                take: limit,
                include: {
                    invitee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                            email: true,
                        }
                    },
                    inviter: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        }
                    }
                },
                orderBy: {
                    created_at: "desc"
                }
            }),
            prisma.invite.count({
                where: {
                    clubId,
                    status: InviteStatus.PENDING,
                }
            })
        ]);

        return response.status(200).json({
            invites,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit
            }
        });
    } catch (_error: any) {
        response.status(500).json({ error: "Internal Server Error." });
    }
};

export const createInvite = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };
    const requestingUserId = (request as any).user.id;

    const { membershipNumber } = request.body;

    if (!membershipNumber) {
        return response.status(400).json({ error: "Membership ID is required." });
    }

    try {
        const existingInvite = await prisma.invite.findFirst({
            where: {
                clubId,
                membershipNumber,
                status: InviteStatus.PENDING
            }
        });

        if (existingInvite) {
            return response.status(409).json({ error: "Invite already exists." });
        }

        const linkedUser = await prisma.profile.findUnique({
            where: { membershipNumber }
        });

        const newInvite = await prisma.invite.create({
            data: {
                membershipNumber,
                status: InviteStatus.PENDING,
                club: {
                    connect: { id: clubId }
                },
                inviter: {
                    connect: { id: requestingUserId }
                },
                ...(linkedUser && {
                    invitee: {
                        connect: {
                            id: linkedUser.id
                        }
                    }
                })
            },
            include: {
                invitee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true
                    }
                },
                inviter: {
                    select: {
                        firstName: true,
                        lastName: true,
                        username: true
                    }
                }
            }
        });

        return response.status(201).json(newInvite);
    } catch (_error: any) {
        console.error(_error);
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

export const revokeInvite = async (request: Request, response: Response) => {
    const { inviteId } = request.params as { inviteId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const invite = await prisma.invite.findUnique({
            where: { id: inviteId },
        });

        if (!invite) {
            return response.status(404).json({ error: "Invite not found." });
        }

        const isAuthorised = await requireRoleInClub(requestingUserId, invite.clubId, ["ADMIN"]);

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        await prisma.invite.delete({ where: { id: inviteId } });

        return response.status(200).json({ message: "Invite revoked." });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};
