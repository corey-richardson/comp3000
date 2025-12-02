import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRoleInClub } from "@/app/utils/server-utils";

export async function PATCH(request: Request, { params }: { params: { clubId: string, userId: string } }) {
    const { clubId, userId } = await params;

    if (!clubId || !userId) {
        return NextResponse.json({ error: "Missing Club ID or User ID field from request parameters." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === userId;
        const isElevated = await requireRoleInClub(clubId, ["ADMIN"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const { roles } = await request.json();
        
        const existingMembership = await prisma.membership.findFirst({
            where: {
                userId,
                clubId,
                ended_at: null,
            },
        });

        if (!existingMembership) {
            return NextResponse.json({ error: "An active club membership could not be found." }, { status: 404 });
        }

        // Prevents orphaning a club
        const isRemovingAdmin = existingMembership.roles.includes("ADMIN") && !roles.includes("ADMIN");
        if (isRemovingAdmin) {
            const adminCount = await prisma.membership.count({
                where: {
                    clubId,
                    ended_at: null,
                    roles: {
                        has: "ADMIN",
                    },
                    NOT: { userId }, // Exclude self
                }
            });

            if (adminCount == 0) {
                return NextResponse.json({ error: "Cannot remove the last admin from the club." }, { status: 400 });
            }
        }
        
        const updatedMembership = await prisma.membership.update({
            where: {
                id: existingMembership.id,
            },
            data: {
                roles,
            }
        });

        return NextResponse.json(updatedMembership, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
