import { Role } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../lib/prisma";

// POST /api/clubs
export const createClub = async (request: Request, response: Response) => {
    const { name } = request.body();
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
