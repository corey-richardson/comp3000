import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { id, name } = await request.json();

        const user = await prisma.user.create({
            data: {
                id, // From Supabase.auth
                name,
            },
        });

        const recordsSummary = await prisma.recordsSummary.create({
            data: {
                userId: id,
            },
        });

        return NextResponse.json({ user, recordsSummary });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
