import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { requireRoleInSpecificClubOrOwnership } from "@/app/utils/server-utils";

export async function PATCH(request: Request, { params }: { params: { clubId: string, userId: string } }) {
    const { clubId, userId } = await params;

    if (!clubId || !userId) {
        return NextResponse.json(
            { error: "Missing Club ID or User ID field from request parameters." }, 
            { status: 400 }
        );
    }

    try {
        const allowed = requireRoleInSpecificClubOrOwnership(userId, clubId, ["ADMIN"]);
        if (!allowed) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const { roles } = await request.json();
        
        const existingMembership = await prisma.membership.findFirst({
            where: { userId, clubId, ended_at: null },
        });

        if (!existingMembership) {
            return NextResponse.json(
                { error: "An active club membership could not be found." }, 
                { status: 404 }
            );
        }

        // Prevents orphaning a club
        const isRemovingAdmin = existingMembership.roles.includes("ADMIN") && !roles.includes("ADMIN");
        if (isRemovingAdmin) {
            const adminCount = await prisma.membership.count({
                where: {
                    clubId,
                    ended_at: null,
                    roles: {
                        has: "ADMIN",
                    },
                    NOT: { userId }, // Exclude self
                }
            });

            if (adminCount == 0) {
                return NextResponse.json(
                    { error: "Cannot remove the last admin from the club." }, 
                    { status: 400 }
                );
            }
        }
        
        const updatedMembership = await prisma.membership.update({
            where: { id: existingMembership.id },
            data: { roles }
        });

        return NextResponse.json(updatedMembership, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { clubId: string, userId: string } }) {
    const { clubId, userId } = await params;

    if (!clubId || !userId) {
        return NextResponse.json(
            { error: "Missing Club ID or User ID field from request parameters." }, 
            { status: 400 }
        );
    }

    try {
        const allowed = requireRoleInSpecificClubOrOwnership(userId, clubId, ["ADMIN"]);
        if (!allowed) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const membership = await prisma.membership.findFirst({
            where: { clubId, userId, ended_at: null },
            include: { profile: true, club: true },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Membership not found." }, 
                { status: 404 }
            );
        }

        if (membership.clubId !== clubId) {
            return NextResponse.json(
                { error: "Membership does not belong to this club." }, 
                { status: 400 }
            );
        }

        if (membership.ended_at) {
            return NextResponse.json(
                { error: "Membership has already ended." }, 
                { status: 400 }
            );
        }

        if (membership.roles.includes("ADMIN")) {
            const remainingAdmins = await prisma.membership.count({
                where: { 
                    clubId, 
                    ended_at: null, 
                    roles: {
                        has: "ADMIN",
                    },
                    NOT: { userId }, // Exclude self
                }
            });

            if (remainingAdmins === 0) {
                return NextResponse.json(
                    {error: "You cannot leave as the only admin. Please assign another member to be an admin or delete the club."}, 
                    { status: 403 });
            }
        }

        const updatedMembership = await prisma.membership.update({
            where: { id: membership.id },
            data: { ended_at: new Date() },
        });

        return NextResponse.json(updatedMembership, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}
