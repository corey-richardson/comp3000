import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import prisma from "../lib/prisma";

interface JWTPayload {
  id: string;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const requireAuth = async (
    request: AuthRequest,
    response: Response,
    next: NextFunction
) => {
    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).json({ error: "Authorization header required" });
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as JWTPayload;

        const user = await prisma.profile.findUnique({
            where: { id: decoded.id },
            select: { id: true },
        });

        if (!user) {
            request.user = undefined;
            return response.status(404).json({ error: "User not found." });
        }

        request.user = user;
        next();

    } catch (error) {
        request.user = undefined;

        if (error instanceof TokenExpiredError) {
            return response.status(401).json({
                error: "Token expired.",
                code: "TOKEN_EXPIRED"
            });
        }

        return response.status(401).json({ error: "Request not authorized." });
    }

};

export default requireAuth;
