import { Role } from "@prisma/client";
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
    requireRoleInClub,
    requireRoleInSharedClub,
    requireRoleInSharedClubOrDataOwnership,
    requireRoleInSpecificClubOrDataOwnership
} from "./authUtils";
import prisma from "../lib/prisma";

vi.mock("../lib/prisma", () => ({
    default: {
        profile: {
            findUnique: vi.fn()
        },
        membership: {
            findFirst: vi.fn()
        },
    },
}));

describe("authUtils", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("requireRoleInClub", () => {
        it("should return true if active membership with role exists in database", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue({ id: "258" } as any);
            const result = await requireRoleInClub("userId-123", "clubId-456", [ Role.ADMIN ]);
            expect(result).toBe(true);
        });

        it("should return false if active membership with role is not found in database", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue(null);
            const result = await requireRoleInClub(
                "userId-123", "clubId-456", [ Role.ADMIN ]
            );
            expect(result).toBe(false);
        });
    });

    describe("requireRoleInSharedClub", () => {
        it("should return true if a shared club with given role exists in database", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue({ id: "601" } as any);
            const result = await requireRoleInSharedClub(
                "requestorId", "targetId", [ Role.CAPTAIN ]
            );

            expect(result).toBe(true);
            expect(prisma.membership.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    userId: "requestorId",
                    ended_at: null,
                    roles: { hasSome: [ Role.CAPTAIN ] },
                    club: {
                        members: {
                            some: {
                                userId: "targetId",
                                ended_at: null
                            }
                        }
                    }
                })
            }));
        });

        it("should return false if a shared club with given role is not found in database", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue(null);
            const result = await requireRoleInSharedClub(
                "requestorId", "targetId", [ Role.CAPTAIN ]
            );

            expect(result).toBe(false);
            expect(prisma.membership.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.objectContaining({
                    userId: "requestorId",
                    ended_at: null,
                    roles: { hasSome: [ Role.CAPTAIN ] },
                    club: {
                        members: {
                            some: {
                                userId: "targetId",
                                ended_at: null
                            }
                        }
                    }
                })
            }));
        });
    });

    describe("requireRoleInSharedClubOrDataOwnership", () => {
        it("should return true if the user is requesting their own data", async () => {
            const result = await requireRoleInSharedClubOrDataOwnership(
                "219", "219", [ Role.COACH ]
            );

            expect(result).toBe(true);
            expect(prisma.membership.findFirst).not.toHaveBeenCalled();
        });

        it("should call requireRoleInSharedClub if user is requesting someone else's data", async () => {
            await requireRoleInSharedClubOrDataOwnership(
                "219", "037", [ Role.COACH ]
            );

            expect(prisma.membership.findFirst).toHaveBeenCalled();
        });
    });

    describe("requireRoleInSpecificClubOrDataOwnership", () => {
        it("should return true if the user is requesting their own data", async () => {
            const result = await requireRoleInSpecificClubOrDataOwnership(
                "439", "439", "clubId", [ Role.COACH ]
            );

            expect(result).toBe(true);
            expect(prisma.membership.findFirst).not.toHaveBeenCalled();
        });

        it("should return true if requesting user has the required role in the specific club", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue({ id: "310" } as any);

            const result = await requireRoleInSpecificClubOrDataOwnership(
                "123", "456", "789", [ Role.COACH ]
            );

            expect(result).toBe(true);
            expect(prisma.membership.findFirst).toHaveBeenCalledWith({
                where: {
                    userId: "123",
                    clubId: "789",
                    ended_at: null,
                    roles: { hasSome: [ Role.COACH ] }
                },
                select: { id: true }
            });
        });

        it("should return false if requesting user does not have the required role in that club", async () => {
            vi.mocked(prisma.membership.findFirst).mockResolvedValue(null);

            const result = await requireRoleInSpecificClubOrDataOwnership(
                "123", "456", "789", [ Role.COACH ]
            );

            expect(result).toBe(false);
        });
    });
});
