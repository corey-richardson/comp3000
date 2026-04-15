import "../tests/mocks/prisma";

import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../utils/authUtils", () => ({
    requireRoleInClub: vi.fn(),
    requireRoleInSharedClub: vi.fn(),
    requireRoleInSharedClubOrDataOwnership: vi.fn(),
    requireRoleInSpecificClubOrDataOwnership: vi.fn(),
}));

import * as controller from "./clubController";
import prisma from "../lib/prisma";
import { requireRoleInClub } from "../utils/authUtils";

describe("clubController", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const clubName = "Archery Club of Testhampton";
    const mockClubId = "12345";
    const mockClub = {
        id: mockClubId,
        name: clubName,
        members: [
            {
                id: "member-1",
                userId: "user-1",
                clubId: mockClubId,
                roles: [ Role.MEMBER ],
                profile: {
                    firstName: "Bilbo",
                    lastName: "Bagging",
                    username: "barrel-rider",
                    email: "bilbo@bagend.com",
                    membershipNumber: "111",
                    sex: "OPEN",
                    yearOfBirth: 2890,
                    emergencyContacts: [],
                },
            },
        ],
    };

    beforeEach(() => {
        mockRequest = {
            body: {},
            user: { id: "test-id" }, // Simulates requireAuth middleware
            query: {},
        } as any;

        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any;
    });

    describe("createClub", () => {
        it("should return 400 if clubName isn't on request.body", async () => {
            // Arrange
            mockRequest.body = { clubName: "" };
            // Act
            await controller.createClub(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Club Name is required." });
        });

        it("should use a transaction to create a club and add creator as admin membership", async () => {
            // Arrange
            mockRequest.body = { clubName };

            const mockClubCreate = vi.fn().mockResolvedValue(mockClub);
            const mockMembershipCreate = vi.fn().mockResolvedValue({});

            vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
                const tx = {
                    club: {
                        create: mockClubCreate,
                    },
                    membership: {
                        create: mockMembershipCreate,
                    },
                };

                return callback(tx as any);
            });
            // Act
            await controller.createClub(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockClub);
            // Assert behaviour
            expect(mockClubCreate).toHaveBeenCalledWith({
                data: { name: clubName }
            });
            expect(mockMembershipCreate).toHaveBeenCalledWith({
                data: {
                    clubId: mockClub.id,
                    userId: "test-id",
                    roles: [ Role.ADMIN, Role.MEMBER ],
                },
            });
            expect(prisma.$transaction).toHaveBeenCalled();
        });

        it("should return status 409 if clubName not unique constraint", async () => {
            // Arrange
            mockRequest.body = { clubName: "Existing Club" };
            /** https://www.prisma.io/docs/orm/reference/error-reference#p2002 */
            vi.mocked(prisma.$transaction).mockRejectedValue({ code: "P2002" });
            // Act
            await controller.createClub(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Club Name already in use." });
        });

        it("should return status 500 if generic exception", async () => {
            // Arrange
            mockRequest.body = { clubName: "Broken Club" };
            vi.mocked(prisma.$transaction).mockRejectedValue(
                new Error("uh oh broken")
            );
            // Act
            await controller.createClub(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error." });
        });
    });

    describe("getClubById", () => {
        beforeEach(() => {
            mockRequest.params = { clubId: mockClub.id as string };
        });

        it("should return status 403 if the user is not a member of the given club", async () => {
            // Arrange
            vi.mocked(requireRoleInClub).mockResolvedValue(false);
            // Act
            await controller.getClubById(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Forbidden." });
        });

        it("should return status 404 if club not found", async () => {
            // Arrange
            vi.mocked(requireRoleInClub).mockResolvedValue(true);
            vi.mocked(prisma.club.findUnique).mockResolvedValue(null);
            // Act
            await controller.getClubById(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Club not found." });
        });

        it("should return status 200 if club found, with memberCount", async () => {
            // Arrange
            vi.mocked(requireRoleInClub).mockResolvedValue(true);
            vi.mocked(prisma.club.findUnique).mockResolvedValue(mockClub as any);
            // Act
            await controller.getClubById(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            // console.log((mockResponse.json as any).mock.calls);
            const result = (mockResponse.json as any).mock.calls[0][0];
            // console.log(result);
            expect(result.members).toHaveLength(1);
            expect(result.members[0].username).toBe("barrel-rider");
            expect(result.memberCount).toBe(1);
        });

        describe("should strip PII for non-priveleged users", () => {
            const cases = [
                {
                    name: "admin sees all data",
                    isDataOwner: false,
                    roles: { isAdmin: true, isCaptain: false, isRecords: false },
                    expected: {
                        email: true,
                        emergencyContacts: true,
                        membershipNumber: true,
                        sex: true,
                        yearOfBirth: true,
                    },
                },
                {
                    name: "captain sees partial data",
                    isDataOwner: false,
                    roles: { isAdmin: false, isCaptain: true, isRecords: false },
                    expected: {
                        email: false,
                        emergencyContacts: true,
                        membershipNumber: true,
                        sex: true,
                        yearOfBirth: true,
                    },
                },
                {
                    name: "records sees partial data",
                    isDataOwner: false,
                    roles: { isAdmin: false, isCaptain: false, isRecords: true },
                    expected: {
                        email: false,
                        emergencyContacts: false,
                        membershipNumber: true,
                        sex: true,
                        yearOfBirth: true,
                    },
                },
                {
                    name: "member sees minimal data",
                    isDataOwner: false,
                    roles: { isAdmin: false, isCaptain: false, isRecords: false },
                    expected: {
                        email: false,
                        emergencyContacts: false,
                        membershipNumber: false,
                        sex: false,
                        yearOfBirth: false,
                    },
                },
                {
                    name: "data owner sees all data",
                    isDataOwner: true,
                    roles: { isAdmin: false, isCaptain: false, isRecords: false },
                    expected: {
                        email: true,
                        emergencyContacts: true,
                        membershipNumber: true,
                        sex: true,
                        yearOfBirth: true,
                    },
                },
            ];

            // Parameterised Test
            it.each(cases)("$name", async ({ isDataOwner, roles, expected }) => {
                // Arrange
                if (isDataOwner) {
                    ( mockRequest as any ).user = { id: "user-1" };
                }
                vi.mocked(requireRoleInClub)
                    .mockResolvedValueOnce(true)
                    .mockResolvedValueOnce(roles.isAdmin)
                    .mockResolvedValueOnce(roles.isCaptain)
                    .mockResolvedValueOnce(roles.isRecords);
                vi.mocked(prisma.club.findUnique).mockResolvedValue(mockClub as any);
                // Act
                await controller.getClubById(mockRequest as Request, mockResponse as Response);
                // Assert
                const result = (mockResponse.json as any).mock.calls[0][0];
                const member = result.members[0];
                expect(member.email !== null).toBe(expected.email);
                expect(member.emergencyContacts !== null).toBe(expected.emergencyContacts);
                expect(member.membershipNumber !== null).toBe(expected.membershipNumber);
                expect(member.sex !== null).toBe(expected.sex);
                expect(member.yearOfBirth !== null).toBe(expected.yearOfBirth);
            });
        });
    });

    describe("getMyClubs", () => {
        const mockMemberships = [
            {
                roles: [ Role.ADMIN ],
                club: {
                    id: "club-1",
                    name: "Club One",
                    _count: {
                        members: 3,
                    },
                },
            },
            {
                roles: [ Role.MEMBER ],
                club: {
                    id: "club-2",
                    name: "Club Two",
                    _count: {
                        members: 10,
                    },
                },
            },
        ];

        it("should return status 200 with memberships and pagination data", async () => {
            // Arrange
            vi.mocked(prisma.membership.findMany).mockResolvedValue(mockMemberships as any);
            vi.mocked(prisma.membership.count).mockResolvedValue(2);
            // Act
            await controller.getMyClubs(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);

            const result = (mockResponse.json as any).mock.calls[0][0];

            expect(result.memberships).toHaveLength(2);
            expect(result.pagination.totalCount).toBe(2);
            expect(result.pagination.currentPage).toBe(1);
            expect(result.pagination.limit).toBe(10);
            expect(result.pagination.totalPages).toBe(1);

            expect(result.memberships[0].memberCount).toBe(3);
            expect(result.memberships[1].memberCount).toBe(10);
        });

        it("should apply pagination (limit + page)", async () => {
            // Arrange
            mockRequest.query = { limit: "1", page: "2" };
            vi.mocked(prisma.membership.findMany).mockResolvedValue(mockMemberships as any);
            vi.mocked(prisma.membership.count).mockResolvedValue(2);
            // Act
            await controller.getMyClubs(mockRequest as Request, mockResponse as Response);
            // Assert
            const result = (mockResponse.json as any).mock.calls[0][0];
            expect(result.memberships).toHaveLength(1);
            expect(result.memberships[0].club.name).toBe("Club Two");
        });

        it("should return 500 on error", async () => {
            // Arrange
            vi.mocked(prisma.membership.findMany).mockRejectedValue(new Error("uh ohhhh"));
            // Act
            await controller.getMyClubs(mockRequest as Request, mockResponse as Response);
            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal Server Error." });
        });
    });
});
