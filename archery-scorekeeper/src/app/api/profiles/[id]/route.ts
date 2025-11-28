import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/app/lib/prisma";
import { getAuthenticatedUser, requireRole, getEmailForUserId } from "@/app/utils/server-utils";
import { createServerSupabase } from "@/app/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id: requestedId } = await params;

    if (!requestedId) {
        return NextResponse.json({ error: "Missing User ID field from request." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === requestedId;
        const isElevated = await requireRole(requestor.id, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
        }

        const profileRecord = await prisma.profile.findUnique({
            where: { id: requestedId },
        });               

        if (!profileRecord) {
            return NextResponse.json({ error: "Profile not found." }, { status: 404 });
        }

        let email = null;
        if (isOwner) {
            email = requestor.email;
        } 
        else if (isElevated) {
            email = await getEmailForUserId(requestedId);
        }

        const profile = {
            ...profileRecord,
            email,
        };

        return NextResponse.json(profile, { status: 200 });
    } 
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id: requestedId } = await params;

    if (!requestedId) {
        return NextResponse.json({ error: "Missing User ID field from request." }, { status: 400 });
    }

    try {
        const requestor = await getAuthenticatedUser();
        const isOwner = requestor.id === requestedId;
        const isElevated = await requireRole(requestor.id, ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]);

        if (!isOwner && !isElevated) {
            return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
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

        const prismaData: Partial<Prisma.ProfileUpdateInput> = {
            updated_at: new Date()
        };

        if (name !== undefined) prismaData.name = name;
        if (defaultBowstyle !== undefined) prismaData.defaultBowstyle = defaultBowstyle;
        if (membershipNumber !== undefined) prismaData.membershipNumber = membershipNumber;
        if (sex !== undefined) prismaData.sex = sex;
        if (yearOfBirth !== undefined) prismaData.yearOfBirth = yearOfBirth;
        
        // Membership number uniqueness check
        if (membershipNumber !== undefined) {
            const existingMembership = await prisma.profile.findFirst({
                where: {
                    membershipNumber: membershipNumber,
                    NOT: { id: requestedId },
                },
            });

            if (existingMembership) {
                return NextResponse.json({ error: "Membership number already exists." }, { status: 409 });
            }

            // TODO: Handle updates to Invites when membership number changes
        }

        const updatedProfile = await prisma.profile.update({
            where: { id: requestedId },
            data: prismaData,
        });

        // Email processing
        if (isOwner && email !== undefined && email !== requestor.email) {
            const supabase = await createServerSupabase();
            const { error: emailError } = await supabase.auth.updateUser({ email });

            if (emailError) {
                return NextResponse.json({ error: "Failed to update email in authentication service." }, { status: 500 });
            }
        }

        return NextResponse.json({...updatedProfile, email: isOwner ? (email ?? requestor.email) : null}, { status: 200 });
    }
    catch (error: unknown) {
        return NextResponse.json({ error: "Internal Server Error: " + error }, { status: 500 });
    }
}
