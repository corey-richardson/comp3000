
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import prisma from "../lib/prisma";

const createJwt = (id: string) => {
    return jwt.sign({ id }, process.env.SECRET as string, { expiresIn: "3d" });
};

// GET /api/user/signup
export const signupUser = async (request: Request, response: Response) => {
    const { username, email, password, firstName, lastName } = request.body;
    const USERNAME_REGEX = /^(?![_-])[a-zA-Z0-9_-]{3,30}(?<![_-])$/;

    try {
        const emptyFields = [];
        if (!username) emptyFields.push("username");
        if (!email) emptyFields.push("email");
        if (!password) emptyFields.push("password");
        if (emptyFields.length > 0)
            return response.status(400).json({ error: "Please fill in all fields.", emptyFields });

        if (!validator.isEmail(email))
            return response.status(400).json({ error: "Invalid Email Address." });
        if (!USERNAME_REGEX.test(username))
            return response.status(400).json({ error: "Invalid Username format." });
        if (!validator.isStrongPassword(password))
            return response.status(400).json({ error: "Password is not strong enough." });

        const exists = await prisma.profile.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username },
                ],
            },
        });

        if (exists)
            return response.status(409).json({ error: "Email or Username already in use." });

        // USER DOESN'T ALREADY EXIST -->
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const profile = await prisma.profile.create({
            data: {
                username,
                email,
                hash,
                firstName,
                lastName,
            },
        });

        const token = createJwt(profile.id);
        response.status(201).json({ id: profile.id, username, email, token });

    } catch (_error: any) {
        response.status(500).json({ error: "Internal error during signup." });
    }
};

// GET /api/user/login
export const loginUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const emptyFields = [];
        if (!email) emptyFields.push("email");
        if (!password) emptyFields.push("password");
        if (emptyFields.length > 0)
            return response.status(400).json({ error: "Please fill in all fields.", emptyFields });

        const profile = await prisma.profile.findUnique({
            where: { email },
        });
        if (!profile) {
            return response.status(404).json({ error: "User not found." });
        }

        const match = await bcrypt.compare(password, profile.hash);
        if (!match) {
            return response.status(401).json({ error: "Incorrect password." });
        }

        const token = createJwt(profile.id);
        response.status(200).json({ email, username: profile.username, token, id: profile.id });

    } catch (_error: any) {
        response.status(500).json({ error: "Internal server error during login." });
    }
};
