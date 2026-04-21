import "../tests/mocks/prisma";

import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { describe, it, expect, vi, beforeEach } from "vitest";

import * as controller from "./userController";
import prisma from "../lib/prisma";

vi.mock("bcrypt", () => ({
    default: {
        genSalt: vi.fn().mockResolvedValue("mockSalt"),
        hash: vi.fn().mockResolvedValue("hashedPassword"),
        compare: vi.fn(),
    },
}));

vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vi.fn().mockReturnValue("mockToken"),
    },
}));

describe("userController", () => {
    const mockResponse = () => {
        const response = {} as Response;
        response.status = vi.fn().mockReturnValue(response);
        response.json = vi.fn().mockReturnValue(response);
        return response;
    };

    describe("signupUser", () => {
        it("should return 400 if email is missing from request body", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Please fill in all fields."
            }));
        });

        it("should return 400 if email is invalid", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    email: "not-an-email",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Invalid Email Address."
            }));
        });

        it("should return 400 if username is invalid", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test user",
                    email: "test@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Invalid Username format."
            }));
        });

        it("should return 400 if password is weak", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    email: "test@email.com",
                    password: "abc",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Password is not strong enough."
            }));
        });

        it("should return 409 if email conflict", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    email: "existing@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findFirst as any).mockResolvedValue({ id: "existing-id" });
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(409);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Email or Username already in use."
            }));
        });

        it("should return 201 and create user with hashed password if valid", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    email: "existing@email.com",
                    password: "SuperDuperSecurePassword123!",
                    firstName: "John",
                    lastName: "Doe"
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findFirst as any).mockResolvedValue(null);
            (prisma.profile.create as any).mockResolvedValue({ id: "test-id", username: "test-user" });
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith("SuperDuperSecurePassword123!", "mockSalt");
            expect(prisma.profile.create).toHaveBeenCalled();
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                token: "mockToken",
            }));
        });

        it("should return status 500 if generic exception", async () => {
            // Arrange
            const request = {
                body: {
                    username: "test-user",
                    email: "existing@email.com",
                    password: "SuperDuperSecurePassword123!",
                    firstName: "John",
                    lastName: "Doe"
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.create as any).mockRejectedValue(
                new Error("uh oh broken")
            );
            // Act
            await controller.signupUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: "Internal server error during signup." });
        });
    });

    describe("loginUser", () => {
        it("should return 400 if email missing", async () => {
            // Arrange
            const request = {
                body: {
                    // email: "existing@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Please fill in all fields.",
                emptyFields: ["email"]
            }));
        });

        it("should return 400 if password missing", async () => {
            // Arrange
            const request = {
                body: {
                    email: "existing@email.com",
                    // password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();
            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Please fill in all fields.",
                emptyFields: ["password"]
            }));
        });

        it("should return 404 if user not found", async () => {
            // Arrange
            const request = {
                body: {
                    email: "existing@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findUnique as any).mockResolvedValue(null);
            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(404);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "User not found."
            }));
        });

        it("should return 401 if password incorrect", async () => {
            // Arrange
            const request = {
                body: {
                    email: "existing@email.com",
                    password: "WrongPassword!",
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findUnique as any).mockResolvedValue({ id: "test-id " });
            (bcrypt.compare as any).mockResolvedValue(false);
            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(401);
            expect(response.json).toHaveBeenCalledWith(expect.objectContaining({
                error: "Incorrect password."
            }));
        });

        it("should run update invite event if membershipNumber found on fetched profile", async () => {
            // Arrange
            const request = {
                body: {
                    email: "test@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findUnique as any).mockResolvedValue({
                id: "test-id", membershipNumber: "12345"
            });
            (bcrypt.compare as any).mockResolvedValue(true);

            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(prisma.invite.updateMany).toHaveBeenCalledWith({
                where: {
                    membershipNumber: "12345",
                    userId: null,
                    status: "PENDING",
                },
                data: {
                    userId: "test-id",
                }
            });
            expect(response.status).toHaveBeenCalledWith(200);

        });

        it("should return status 500 if generic exception", async () => {
            // Arrange
            const request = {
                body: {
                    email: "test@email.com",
                    password: "SuperDuperSecurePassword123!",
                }
            } as Request;
            const response = mockResponse();

            (prisma.profile.findUnique as any).mockResolvedValue({
                id: "test-id", membershipNumber: "12345"
            });
            (bcrypt.compare as any).mockResolvedValue(true);

            (prisma.invite.updateMany as any).mockRejectedValue(
                new Error("uh oh broken")
            );
            // Act
            await controller.loginUser(request, response);
            // Assert
            expect(response.status).toHaveBeenCalledWith(500);
            expect(response.json).toHaveBeenCalledWith({ error: "Internal server error during login." });
        });
    });
});
