import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Bowstyle, CompetitionStatus, Venue } from "@prisma/client";
import { toPrismaAge, toPrismaSex, toPythonAge, toPythonSex } from "../utils/enumAdapter";
import { requireRoleInClub, requireRoleInSharedClubOrDataOwnership } from "../utils/serverUtils";

export const createScore = async (request: Request, response: Response) => {
    const requestingUser = (request as any).user;

    try {
        const { 
            dateShot,
            roundName,
            roundCodeName,
            venue,
            competition,
            bowstyle,
            score,
            xs, tens, nines, hits,
            sex,
            ageCategory,
            notes,
            journal
        } = request.body;

        const prismaAge = toPrismaAge(ageCategory);
        const prismaSex = toPrismaSex(sex);

        const pythonServiceResponse = await fetch(process.env.FLASK_ARCHERYUTILS_SERVICE_URL + "/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                score, 
                roundCodeName,
                bowstyle,
                sex: toPythonSex(prismaSex),
                ageCategory: toPythonAge(prismaAge),
                venue
            }),
        });

        const pythonServiceData = await pythonServiceResponse.json();

        if (!pythonServiceResponse.ok) {
            return response.status(pythonServiceResponse.status).json({
                error: pythonServiceData.error || "Metrics Calculation Service Error"
            });      
        }
        const newScore = await prisma.score.create({
            data: {
                profile: {
                    connect: { id: requestingUser.id }
                },

                handicap: pythonServiceData.handicap,
                classification: pythonServiceData.classification,

                dateShot: new Date(dateShot),
                roundName,

                venue: venue as Venue,
                competition: competition as CompetitionStatus,
                bowstyle: bowstyle as Bowstyle,
                
                score: Number(score),
                xs: xs ? Number(xs) : null,
                tens: tens ? Number(tens) : null, 
                nines: nines ? Number(nines) : null, 
                hits: hits ? Number(hits) : null,

                sex: prismaSex,
                ageCategory: prismaAge,

                notes,
                journal,
                
                maxScore: pythonServiceData.max_score,
                numArrows: pythonServiceData.num_arrows,
            }
        });

        response.status(201).json(newScore);

    } catch (error: any) {
        response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
}


export const getScoresByUser = async (request: Request, response: Response) => {
    const { userId: targetUserId } = request.params as { userId: string };
    const requestingUserId = (request as any).user.id;

    const limit = request.query.limit ? parseInt(request.query.limit as string) : undefined;
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const skip = limit ? (page - 1) * limit : undefined;

    try {
        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            targetUserId,
            ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const scores = await prisma.score.findMany({
            where: { userId: targetUserId },
            orderBy: { dateShot: "desc" },
            take: limit,
            skip: skip,
        });

        return response.status(200).json(scores);
    } catch (error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
}


export const getScoresByClub = async (request: Request, response: Response) => {
    const { clubId } = request.params as { clubId: string };
    const requestingUserId = (request as any).user.id;

    const limit = request.query.limit ? parseInt(request.query.limit as string) : undefined;
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const skip = limit ? (page - 1) * limit : undefined;

    try {
        const isAuthorised = await requireRoleInClub(
            requestingUserId,
            clubId,
            ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const scores = await prisma.score.findMany({
            where: { 
                profile: {
                    memberOf: {
                        some: { clubId, ended_at: null }
                    }
                }
            },
            include: {
                profile: { 
                    select: { 
                        firstName: true, 
                        lastName: true, 
                        username: true 
                    } 
                }
            },
            orderBy: { dateShot: "desc" },
            take: limit,
            skip: skip,
        });

        return response.status(200).json(scores);
    } catch (error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
}
