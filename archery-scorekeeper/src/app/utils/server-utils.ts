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


export async function requireRoleInClub(clubId: string, requiredRoles: Role[]) {
    const requestor = await getAuthenticatedUser();

    const membership = await prisma.membership.findFirst({
        where: {
            userId: requestor.id,
            clubId,
            ended_at: null,
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true },
    });

    return Boolean(membership);
}


export async function requireRoleInSharedClub(userId: string, requiredRoles: Role[]) {
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
            ended_at: null,
            clubId: { in: clubIds },
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true }
    });

    return Boolean(requestorMemberships);
}


export async function requireRoleInSharedClubOrOwnership(requestorId: string, requestedId: string, requiredRoles: Role[]) {
    if (requestorId === requestedId) return true;
    return await requireRoleInSharedClub(requestedId, requiredRoles);
}


export async function requireRoleInSpecificClubOrOwnership(targetId: string, clubId: string, requiredRoles: Role[]) {
    const requestor = await getAuthenticatedUser();

    if (targetId === requestor.id) return true;

    const requestorMembership = await prisma.membership.findFirst({
        where: {
            userId: requestor.id,
            clubId,
            ended_at: null,
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true 
        },
    });

    return Boolean(requestorMembership);
}
