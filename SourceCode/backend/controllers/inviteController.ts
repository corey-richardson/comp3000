import { InviteStatus } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { requireRoleInClub } from "../utils/serverUtils";

export const getInvitesByClub = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const isAuthorised = await requireRoleInClub(requestingUserId, clubId, ["ADMIN"]);

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const invites = await prisma.invite.findMany({
            where: {
                clubId,
                status: InviteStatus.PENDING,
            },
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
        });

        response.status(200).json(invites);
    } catch (_error: any) {
        response.status(500).json({ error: "Internal Server Error." });
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
