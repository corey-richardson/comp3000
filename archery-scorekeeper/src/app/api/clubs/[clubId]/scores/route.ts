import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { requireRoleInClub } from "@/app/utils/server-utils";

export async function GET({ params }: { params: { clubId: string } }) {
    const { clubId } = await params;

    if (!clubId) {
        return NextResponse.json({ error: "Missing Club ID field from request." }, { status: 400 });
    }

    try {
        const isElevated = await requireRoleInClub(clubId, ["ADMIN", "CAPTAIN", "RECORDS"]);

        if (!isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const scores = await prisma.score.findMany({
            where: {
                userId: {
                    in: (
                        await prisma.membership.findMany({
                            where: {
                                clubId,
                                ended_at: null
                            },
                            select: {
                                userId: true,
                            }
                        })
                    ).map(m => m.userId)
                }
            },
            orderBy: {
                dateShot: "desc",
                submitted_at: "desc",
            }
        });

        return NextResponse.json(scores, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
