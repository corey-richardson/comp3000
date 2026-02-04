import { Role } from "@prisma/client";

import prisma from "../lib/prisma";

export async function getEmailForUserId(userId: string) {
    const user = await prisma.profile.findUnique({
        where: { id: userId },
        select: { email: true },
    });

    return user?.email || null;
}

export async function requireRoleInClub(
    requestingUserId: string,
    clubId: string,
    requiredRoles: Role[]
) {
    const membership = await prisma.membership.findFirst({
        where: {
            userId: requestingUserId,
            clubId,
            ended_at: null,
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true },
    });

    return Boolean(membership);
}

export async function requireRoleInSharedClub(
    requestingUserId: string,
    targetUserId: string,
    requiredRoles: Role[]
) {
    const hasRoleInSharedClub = await prisma.membership.findFirst({
        where: {
            userId: requestingUserId,
            ended_at: null,
            roles: { hasSome: requiredRoles },
            club: {
                members: {
                    some: {
                        userId: targetUserId,
                        ended_at: null,
                    },
                }
            }
        },
        select: { id: true }
    });

    return Boolean(hasRoleInSharedClub);
}

export async function requireRoleInSharedClubOrDataOwnership(
    requestingUserId: string,
    targetUserId: string,
    requiredRoles: Role[]
) {
    if (requestingUserId === targetUserId) return true;
    return await requireRoleInSharedClub(requestingUserId, targetUserId, requiredRoles);
}

export async function requireRoleInSpecificClubOrDataOwnership(
    requestingUserId: string,
    targetUserId: string,
    clubId: string,
    requiredRoles: Role[]
) {
    if (targetUserId === requestingUserId) return true;

    const requestingUserMembership = await prisma.membership.findFirst({
        where: {
            userId: requestingUserId,
            clubId,
            ended_at: null,
            roles: { hasSome: requiredRoles, }
        },
        select: { id: true
        },
    });

    return Boolean(requestingUserMembership);
}
