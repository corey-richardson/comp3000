import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: Request, { params }: { params: { clubId: string } }) {
    const { clubId } = await params;

    if (!clubId) {
        return NextResponse.json({ error: "Missing Club ID field from request." }, { status: 400 });
    }

    try {
        const [ club, members ] = await Promise.all([
            prisma.club.findUnique({ where: { id: clubId } }),
            prisma.membership.findMany({ 
                where: { clubId: clubId } ,
                include: { profile: true },
            }),
        ]);

        if (!club || !members) {
            return NextResponse.json({ error: "Failed to fetch Club " + clubId}, { status: 404 });
        }

        return NextResponse.json({ club, members }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { clubId: string } }) {
    const { clubId } = await params;

    if (!clubId) {
        return NextResponse.json({ error: "Missing Club ID field from request." }, { status: 400 });
    }

    try {
        await prisma.membership.deleteMany({ where: { clubId: clubId } });
        await prisma.club.delete({ where: { id: clubId } });

        return NextResponse.json({ message: "Club deleted successfully." }, { status: 200 });
    } catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
