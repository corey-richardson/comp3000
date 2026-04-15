import "../tests/mocks/prisma";

import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { describe, it, expect, vi, beforeEach } from "vitest";

import requireAuth, { AuthRequest } from "./requireAuth";
import prisma from "../lib/prisma";

vi.mock("jsonwebtoken", () => {
    class MockTokenExpiredError extends Error {
        name = "TokenExpiredError";
        date = new Date();
        constructor(message: string) { super(message); }
    }

    return {
        default: {
            verify: vi.fn(),
        },
        TokenExpiredError: MockTokenExpiredError,
    };
});

describe("requireAuth", () => {
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = vi.fn();

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
    });

    it("should call next() and attach user to request if token and user are valid", async () => {
        const mockUser = {
            id: "143",
        };

        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        vi.mocked(jwt.verify).mockReturnValue({ id: "143" } as any);
        vi.mocked(prisma.profile.findUnique).mockResolvedValue(mockUser as any);

        await requireAuth(mockRequest as AuthRequest, mockResponse as Response, mockNextFunction);

        expect(mockRequest.user).toBe(mockUser);
        expect(mockNextFunction).toHaveBeenCalled();
    });

    it("should return 401 if Authorization header isn't present", async () => {
        await requireAuth(mockRequest as AuthRequest, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Authorization header required." });
    });

    it("should return 401 if token has expired", async () => {
        mockRequest.headers = {
            authorization: "Bearer expired-token",
        };

        vi.mocked(jwt.verify).mockImplementation(() => {
            throw new TokenExpiredError("JWT Expired", new Date());
        });

        await requireAuth(mockRequest as AuthRequest, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            error: "Token expired.",
            code: "TOKEN_EXPIRED",
        }));
    });

    it("should return 404 if user not in database", async () => {
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        vi.mocked(jwt.verify).mockReturnValue({ id: "328" } as any);
        vi.mocked(prisma.profile.findUnique).mockResolvedValue(null);

        await requireAuth(mockRequest as AuthRequest, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "User not found." });
    });

    it("should handle a generic exception", async () => {
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };

        vi.mocked(jwt.verify).mockImplementation(() => {
            throw new Error("Invalid token,");
        });

        await requireAuth(mockRequest as AuthRequest, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Request not authorized." });
    });
});
