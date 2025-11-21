import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRole, getEmailForUserId } from "@/app/utils/server-utils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const p = await params;
    const requestedId = p.id;

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

        const profileRecord = await prisma.profile.findUnique({
            where: { id: requestedId },
        });               

        if (!profileRecord) {
            return NextResponse.json({ error: "Profile not found." }, { status: 404 });
        }

        let email = null;
        if (isOwner) {
            email = requestor.email;
        } else if (isElevated) {
            email = await getEmailForUserId(requestedId);
        }

        const profile = {
            ...profileRecord,
            email,
        };

        return NextResponse.json(profile, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }

}
