import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRoleInSharedClub } from "@/app/utils/server-utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing User ID field from query." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === userId;
        const isElevated = await requireRoleInSharedClub(userId, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const memberships = await prisma.membership.findMany({
            where: { userId },
            include: {
                club: true,
                profile: true,
            },
            orderBy: {
                joined_at: "desc",
            }
        });

        return NextResponse.json(memberships, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
