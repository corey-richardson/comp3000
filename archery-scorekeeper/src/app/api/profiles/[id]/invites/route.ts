import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { requireRoleInSharedClubOrOwnership } from "@/app/utils/server-utils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: userId } = await params;

    if (!userId) {
        return NextResponse.json(
            { error: "Missing User ID field from query." }, 
            { status: 400 }
        );
    }

    try {
        const isAllowed = await requireRoleInSharedClubOrOwnership( userId, ["ADMIN"]);

        if (!isAllowed) {
            return NextResponse.json(
                { error: "Unauthorised." }, 
                { status: 401 }
            );
        }

        const invites = await prisma.invite.findMany({
            where: { userId },
            include: {
                club: true,
                invitee: true,
                inviter: true,
            },
        });

        return NextResponse.json(invites, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}
