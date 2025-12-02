import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRole } from "@/app/utils/server-utils";

export async function GET({ params }: { params: { id: string } }) {
    const { id: requestedId } = await params;

    if (!requestedId) {
        return NextResponse.json({ error: "Missing User ID field from request." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === requestedId;
        const isElevated = await requireRole(requestor.id, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const recordsSummary = await prisma.recordsSummary.findMany({
            where: { userId: requestedId },
        });

        return NextResponse.json(recordsSummary, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
