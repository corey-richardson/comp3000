import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRoleInSharedClub, getEmailForUserId } from "@/app/utils/server-utils";
import { createServerSupabase } from "@/app/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: targetUserId } = await params;

    if (!targetUserId) {
        return NextResponse.json(
            { error: "Missing User ID field from request." }, 
            { status: 400 }
        );
    }

    try {
        const requestingUser = await getAuthenticatedUser();
        const isSelf = requestingUser.id === targetUserId;
        const hasSharedClubPrivileges = await requireRoleInSharedClub(targetUserId, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isSelf && !hasSharedClubPrivileges) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const profileRecord = await prisma.profile.findUnique({
            where: { id: targetUserId },
        });               

        if (!profileRecord) {
            return NextResponse.json(
                { error: "Profile not found." }, 
                { status: 404 }
            );
        }

        let email = null;
        if (isSelf) {
            email = requestingUser.email;
        } 
        else if (hasSharedClubPrivileges) {
            email = await getEmailForUserId(targetUserId);
        }

        const profile = {
            ...profileRecord,
            email,
        };

        return NextResponse.json(profile, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id: targetUserId } = await params;

    if (!targetUserId) {
        return NextResponse.json(
            { error: "Missing User ID field from request." }, 
            { status: 400 }
        );
    }

    try {
        const requestingUser = await getAuthenticatedUser();
        const isSelf = requestingUser.id === targetUserId;
        const hasSharedClubPrivileges = await requireRoleInSharedClub(targetUserId, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isSelf && !hasSharedClubPrivileges) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }
        
        const body = await request.json();

        const {
            name,
            defaultBowstyle,
            membershipNumber,
            sex,
            yearOfBirth,
            email // Owner only
        } = body;

        const profileUpdates: Partial<Prisma.ProfileUpdateInput> = {
            updated_at: new Date()
        };

        let previousMembershipNumber: string | null | undefined;
        if (membershipNumber !== undefined) {
            const currentProfile = await prisma.profile.findUnique({
                where: { id: targetUserId},
                select: { membershipNumber: true },
            });

            previousMembershipNumber = currentProfile?.membershipNumber;

            const conflictingProfile = await prisma.profile.findFirst({
                where: {
                    membershipNumber: membershipNumber,
                    NOT: { id: targetUserId },
                },
            });

            if (conflictingProfile) {
                return NextResponse.json(
                    { error: "Membership number already assigned to another user." }, 
                    { status: 409 }
                );
            }
        }
        
        if (name !== undefined) profileUpdates.name = name;
        if (defaultBowstyle !== undefined) profileUpdates.defaultBowstyle = defaultBowstyle;
        if (membershipNumber !== undefined) profileUpdates.membershipNumber = membershipNumber;
        if (sex !== undefined) profileUpdates.sex = sex;
        if (yearOfBirth !== undefined) profileUpdates.yearOfBirth = yearOfBirth;
        
        const updatedProfile = await prisma.$transaction(async (tx) => {
            if (membershipNumber !== undefined && previousMembershipNumber !== membershipNumber) {

                await tx.invite.updateMany({
                    where: { membershipNumber, status: "PENDING" },
                    data: { userId: targetUserId },
                });
            }

            const profile = await tx.profile.update({
                where: { id: targetUserId },
                data: profileUpdates,
            });

            return profile;
        });

        // Email processing
        if (isSelf && email !== undefined && email !== requestingUser.email) {
            const supabase = await createServerSupabase();
            const { error: emailError } = await supabase.auth.updateUser({ email });

            if (emailError) {
                return NextResponse.json(
                    { error: "Failed to update email in authentication service." }, 
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            {...updatedProfile, email: isSelf ? (email ?? requestingUser.email) : null}, 
            { status: 200 }
        );
    }
    catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}

/** UNTESTED */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id: targetUserId } = await params;

    if (!targetUserId) {
        return NextResponse.json(
            { error: "Missing User ID field from request." }, 
            { status: 400 }
        );
    }

    try {
        const requestingUser = await getAuthenticatedUser();
        const isSelf = requestingUser.id === targetUserId;
        const hasSharedClubPrivileges = await requireRoleInSharedClub(targetUserId, ["ADMIN"]);

        if (!isSelf && !hasSharedClubPrivileges) {
            return NextResponse.json(
                { error: "Forbidden." }, 
                { status: 403 }
            );
        }

        const deletedProfile = await prisma.profile.delete({
            where: { id: targetUserId },
        });

        if (!deletedProfile) {
            return NextResponse.json(
                { error: "Profile not found." }, 
                { status: 404 }
            );
        }

        const supabase = await createServerSupabase();
        const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);

        if (deleteError) {
            return NextResponse.json(
                { error: "Failed to delete user in authentication service." }, 
                { status: 500 }
            );
        }

        return NextResponse.json(deletedProfile, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error }, 
            { status: 500 }
        );
    }
}
