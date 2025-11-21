import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { id, name } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Missing User ID field from request." }, { status: 400 });
        }

        /* Prisma Client does not have a findOrCreate() query. 
        You can use upsert() as a workaround. To make upsert() behave like a 
        findOrCreate() method, provide an empty update parameter to upsert(). */
        // https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records

        const user = await prisma.profile.upsert({
            where: { id },
            update: {},
            create: {
                id, // From Supabase.auth
                name,
            },
        });

        const recordsSummary = await prisma.recordsSummary.upsert({
            where: { userId: id },
            update: {},
            create: {
                userId: id,
            },
        });

        return NextResponse.json({ user, recordsSummary });
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
