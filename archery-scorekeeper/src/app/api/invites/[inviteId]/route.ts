import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

import prisma from "@/app/lib/prisma";
import { requireRoleInClub, requireRoleInSpecificClubOrOwnership } from "@/app/utils/server-utils";

export async function PATCH(request: Request, { params }: { params: { inviteId: string } }) {
    const { inviteId } = await params;
    const now = new Date();

    if (!inviteId) {
        return NextResponse.json(
            { error: "Missing Invite ID field from query." }, 
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Missing Status field from request body." }, 
                { status: 400 }
            );
        }

        const acceptedStatuses = ["ACCEPTED", "DECLINED"];
        if (!acceptedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid Status field from request body." }, 
                { status: 400 }
            );
        }

        const invite = await prisma.invite.findUnique({
            where: { id: inviteId },
            include: { club: true, invitee: true },
        });

        if (!invite) {
            return NextResponse.json(
                { error: "Invite not found." }, 
                { status: 404 }
            );
        }

        if (invite.status !== "PENDING") {
            return NextResponse.json(
                { error: "Invite status has already been actioned." }, 
                { status: 400 }
            );
        }

        if (!invite.userId) {
            return NextResponse.json(
                { error: "Cannot action invite without a linked user profile." }, 
                { status: 400 }
            );
        }

        const isAllowed = await requireRoleInSpecificClubOrOwnership(invite.userId, invite.clubId, ["ADMIN" as Role]);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const transaction = await prisma.$transaction(async (tx) => {
            const updatedInvite = await tx.invite.update({
                where: { id: inviteId },
                data: {
                    status,
                    accepted_at: status === "ACCEPTED" ? now : null,
                    declined_at: status === "DECLINED" ? now : null,
                },
            });

            if (status === "ACCEPTED" && updatedInvite.userId) {
                const existingMembership = await tx.membership.findFirst({
                    where: { userId: updatedInvite.userId, clubId: invite.clubId, ended_at: null },
                });

                if (existingMembership) {
                    throw new Error("409")
                }

                await tx.membership.create({
                    data: {
                        userId: updatedInvite.userId,
                        clubId: updatedInvite.clubId,
                        joined_at: now,
                        roles: ["MEMBER" as Role]
                    },
                });
            }

            return updatedInvite;
        });

        return NextResponse.json(transaction, { status: 200 });
    }
    catch (error: unknown) {
        if (error instanceof Error && error.message.includes("409")) {
            return NextResponse.json(
                { error: "User is already a current member of this club." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { inviteId: string } }) {
    const { inviteId } = await params;

    if (!inviteId) {
        return NextResponse.json(
            { error: "Missing Invite ID field from query." }, 
            { status: 400 },
        );
    }

    try {
        const invite = await prisma.invite.findUnique({
            where: { id: inviteId },
        });

        if (!invite) {
            return NextResponse.json(
                { error: "Invite not found." }, 
                { status: 404 },
            );
        }

        if (invite.status != "PENDING") {
            return NextResponse.json(
                { error: "Cannot delete an invite that has already been actioned." }, 
                { status: 400 },
            );
        }

        const isAllowed = await requireRoleInClub(invite.clubId, ["ADMIN"]);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        await prisma.invite.delete({
            where: { id: inviteId },
        });

        return NextResponse.json({status: 200});
    }
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
