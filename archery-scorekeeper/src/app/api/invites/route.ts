import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRoleInClub, requireRoleInSharedClubOrOwnership } from "@/app/utils/server-utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "Missing User ID field from query." }, 
            { status: 400 }
        );
    }

    try {
        const isAllowed = await requireRoleInSharedClubOrOwnership( userId, ["ADMIN"]);

        if (!isAllowed) {
            return NextResponse.json(
                { error: "Unauthorised." }, 
                { status: 401 }
            );
        }

        const invites = await prisma.invite.findMany({
            where: { userId },
            include: {
                club: true,
                invitee: true,
                inviter: true,
            },
        });

        return NextResponse.json(invites, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clubId, userId: inviteeUserId, membershipNumber } = body;

        if (!clubId || !membershipNumber) {
            return NextResponse.json(
                { error: "Club ID or membership number missing from request body." }, 
                { status: 400 }
            );
        }

        const inviter = await getAuthenticatedUser();
        const isAllowed = await requireRoleInClub(clubId, ["ADMIN"]);

        if (!isAllowed) {
            return NextResponse.json(
                { error: "Unauthorised." }, 
                { status: 401 }
            );
        }

        const [ existingInvite, existingMembership, inviteeProfile ] = await Promise.all([
            prisma.invite.findFirst({
                where: { 
                    clubId, 
                    status: "PENDING", 
                    OR: [
                        { membershipNumber },
                        { userId: inviteeUserId },
                    ],
                },
            }),
            prisma.membership.findFirst({
                where: { clubId, userId: inviteeUserId, ended_at: null },
            }),
            prisma.profile.findUnique({
                where: { membershipNumber },
            }),
        ]);

        if (existingInvite) {
            return NextResponse.json(
                { error: "Invite already exists for this user/number." }, 
                { status: 409 }
            );
        } else if (existingMembership) {
            return NextResponse.json(
                { error: "This user is already a member of the club." }, 
                { status: 409 }
            );
        }

        // No conflicts, create invite:
        const newInvite = await prisma.invite.create({
            data: {
                clubId,
                membershipNumber,
                userId: inviteeProfile?.id ?? undefined,
                invitedBy: inviter.id,
                status: "PENDING",
            }
        });

        return NextResponse.json(newInvite, { status: 201 });
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}
