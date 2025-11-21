"use server";

import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/app/utils/supabase/server";

import prisma from "../lib/prisma";


export async function getAuthenticatedUser() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/");
    return user;
}


export async function getEmailForUserId(userId: string) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !data.user?.email) return null;
    return data.user.email || null;
}


export async function requireRole(userId: string, requiredRoles: Role[]) {
    const requestor = await getAuthenticatedUser();

    const targetClubs = await prisma.membership.findMany({
        where: { userId },
        select: { clubId: true }
    });

    if (targetClubs.length === 0) return false;
    const clubIds = targetClubs.map(club => club.clubId);

    // Does the requestor have an elevated role in a club shared with the userId?
    const requestorMemberships = await prisma.membership.findMany({
        where: {
            userId: requestor.id,
            clubId: { in: clubIds },
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true }
    });

    return Boolean(requestorMemberships);
}


export async function requireRoleOrOwnership(requestorId: string, requestedId: string, requiredRoles: Role[]) {
    if (requestorId === requestedId) return true;
    return await requireRole(requestorId, requiredRoles);
}
