import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRoleInSharedClub } from "@/app/utils/server-utils";

export async function GET({ params }: { params: { id: string } }) {
    const { id: requestedId } = await params;

    if (!requestedId) {
        return NextResponse.json(
            { error: "Missing User ID field from request." }, 
            { status: 400 }
        );
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === requestedId;
        const isElevated = await requireRoleInSharedClub(requestedId, ["ADMIN", "CAPTAIN"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const emergencyContacts = await prisma.emergencyContact.findMany({
            where: { userId: requestedId },
        });

        return NextResponse.json(emergencyContacts, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error },
            { status: 500 }
        );
    }
}
