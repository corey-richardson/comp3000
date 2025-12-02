import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser } from "@/app/utils/server-utils";

export async function POST(request: Request) {
    try {
        const requestor = await getAuthenticatedUser();

        const { clubName } = await request.json();

        if (!clubName) {
            return NextResponse.json({ error: "Missing Club Name field from request." }, { status: 400 });
        }

        const existing = await prisma.club.findUnique({ where: { name: clubName }});
        if (existing) {
            return NextResponse.json({ error: "A club with that name already exists." }, { status: 409 });
        }

        const newClub = await prisma.club.create({
            data: {
                name: clubName
            },
        });

        if (!newClub) {
            return NextResponse.json({ error: "Failed to create club." }, { status: 500 });
        }

        await prisma.membership.create({
            data: {
                userId: requestor.id,
                clubId: newClub.id,
                roles: [ "MEMBER", "ADMIN" ]
            }
        });

        return NextResponse.json({ newClub }, { status: 201 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
