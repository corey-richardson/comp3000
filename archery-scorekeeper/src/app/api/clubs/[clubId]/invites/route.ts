import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRole } from "@/app/utils/server-utils";

export async function GET({ params }: { params: { clubId: string } }) {
    const { clubId } = await params;

    if (!clubId) {
        return NextResponse.json({ error: "Missing Club ID field from request." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isElevated = await requireRole(requestor.id, ["ADMIN"]);

        if (!isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const invites = await prisma.invite.findMany({
            where: { 
                clubId,
                status: "PENDING",
            },
            include: {
                invitee: true,
                club: true,
                inviter: { 
                    select: {
                        name: true,
                    }
                },
            },
            orderBy: {
                created_at: "desc",
            }
        });

        return NextResponse.json(invites, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
