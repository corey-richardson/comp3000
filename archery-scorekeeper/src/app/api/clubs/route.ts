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

        const existing = await prisma.club.findUnique({ where: { name: clubName, archived_at: null }});
        if (existing) {
            return NextResponse.json({ error: "A club with that name already exists." }, { status: 409 });
        }

        const newClubTx = await prisma.$transaction(async tx => {
            const newClub = await tx.club.create({
                data: { name: clubName },
            });

            await tx.membership.create({
                data: {
                    userId: requestor.id,
                    clubId: newClub.id,
                    roles: [ "MEMBER", "ADMIN" ]
                },
            });

            return newClub;
        })

        return NextResponse.json({ newClub: newClubTx }, { status: 201 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
