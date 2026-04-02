import { Bowstyle, CompetitionStatus, Venue } from "@prisma/client";
import { Score } from "@prisma/client";
import { Request, Response } from "express";

import prisma from "../lib/prisma";
import { toPrismaAge, toPrismaSex, toPythonAge, toPythonSex } from "../utils/enumAdapter";
import { requireRoleInClub, requireRoleInSharedClubOrDataOwnership } from "../utils/serverUtils";

const stripJournal = <T extends Score>(scores: T[]) => {
    return scores.map(score => ({
        ...score,
        journal: null
    }));
};

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

        const flaskServiceResponse = await fetch(process.env.FLASK_ARCHERYUTILS_SERVICE_URL + "/calculate", {
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
                venue,
                competition
            }),
        });

        const flaskServiceData = await flaskServiceResponse.json();

        if (!flaskServiceResponse.ok) {
            return response.status(flaskServiceResponse.status).json({
                error: flaskServiceData.error || "Metrics Calculation Service Error"
            });
        }

        const newScore = await prisma.score.create({
            data: {
                profile: {
                    connect: { id: requestingUser.id }
                },

                handicap: flaskServiceData.handicap,
                classification: flaskServiceData.classification,
                uncappedClassification: flaskServiceData.uncapped_classification,
                maxScore: flaskServiceData.max_score,
                numArrows: flaskServiceData.num_arrows,

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

                notes: notes || null,
                journal: journal || null,
            }
        });

        return response.status(201).json(newScore);

    } catch (error: any) {
        return response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
};

export const updateScore = async (request: Request, response: Response) => {
    const { scoreId } = request.params as { scoreId: string };
    const requestingUserId = (request as any).user.id;

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

        const existingScore = await prisma.score.findUnique({
            where: { id: scoreId }
        });

        if (!existingScore) {
            return response.status(404).json({ error: "Score not found." });
        }

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            existingScore.userId,
            ["ADMIN", "RECORDS"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        if (existingScore?.verified_at || existingScore?.verifiedById) {
            return response.status(400).json({ error: "Score already verified and is immutable." });
        }

        const prismaAge = toPrismaAge(ageCategory);
        const prismaSex = toPrismaSex(sex);

        const flaskServiceResponse = await fetch(process.env.FLASK_ARCHERYUTILS_SERVICE_URL + "/calculate", {
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
                venue,
                competition
            }),
        });

        const flaskServiceData = await flaskServiceResponse.json();

        if (!flaskServiceResponse.ok) {
            return response.status(flaskServiceResponse.status).json({
                error: flaskServiceData.error || "Metrics Calculation Service Error"
            });
        }

        const updatedScore = await prisma.score.update({
            where: { id: scoreId },
            data: {
                // Flask Service values
                handicap: flaskServiceData.handicap,
                classification: flaskServiceData.classification,
                uncappedClassification: flaskServiceData.uncapped_classification,
                maxScore: flaskServiceData.max_score,
                numArrows: flaskServiceData.num_arrows,

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
            }
        });

        return response.status(200).json(updatedScore);

    } catch (error: any) {
        console.log(error);
        return response.status(500).json({ error: "Internal Server Error: " + error.message });
    }

};

export const updateScoreStatus = async (request: Request, response: Response) => {
    const { scoreId } = request.params as { scoreId: string };
    const requestingUserId = (request as any).user.id;

    const { status } = request.body;

    try {
        const existingScore = await prisma.score.findUnique({
            where: { id: scoreId }
        });

        if (!existingScore) {
            return response.status(404).json({ error: "Score not found." });
        }

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            existingScore.userId,
            ["ADMIN", "RECORDS"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const updatedScore = await prisma.score.update({
            where: { id: scoreId },
            data: {
                status,
                verified_at: status === "VERIFIED" ? new Date() : null,
                verifiedById: status === "VERIFIED" ? requestingUserId : null,
            }
        });

        return response.status(200).json(updatedScore);

    } catch (error: any) {
        return response.status(500).json({ error: "Internal Server Error: " + error.message });
    }
};

export const deleteScore = async (request: Request, response: Response) => {
    const { scoreId } = request.params as { scoreId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const score = await prisma.score.findUnique({
            where: { id: scoreId },
        });

        if (!score) {
            return response.status(404).json({ error: "Score not found." });
        }

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            score.userId,
            ["ADMIN", "RECORDS"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        await prisma.score.delete({
            where: { id: scoreId },
        });

        return response.status(204).send();

    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

export const getScoresByUser = async (request: Request, response: Response) => {
    const { userId: targetUserId } = request.params as { userId: string };
    const requestingUserId = (request as any).user.id;

    const limit = request.query.limit ? parseInt(request.query.limit as string) : 10;
    const page = request.query.page ? parseInt(request.query.page as string) : 1;
    const skip = (page - 1) * limit;

    try {
        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            targetUserId,
            ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const [scores, totalCount, targetUser ] = await Promise.all ([
            prisma.score.findMany({
                where: { userId: targetUserId },
                orderBy: { dateShot: "desc" },
                take: limit,
                skip: skip,
            }),
            prisma.score.count({
                where: { userId: targetUserId }
            }),
            prisma.profile.findUnique({
                where: { id: targetUserId },
                select: {
                    firstName: true,
                    lastName: true,
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        let filteredScores = scores;
        const canSeeJournal = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            targetUserId,
            ["COACH"]
        );
        if (!canSeeJournal) {
            filteredScores = stripJournal(scores);
        }

        return response.status(200).json({
            scores: filteredScores,
            user: targetUser,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit
            }
        });
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

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

        let filteredScores = scores;
        const canSeeJournal = await requireRoleInClub(
            clubId,
            requestingUserId,
            ["COACH"]
        );
        if (!canSeeJournal) {
            filteredScores = stripJournal(scores);
        }

        return response.status(200).json(filteredScores);
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};

export const getScoreById = async (request: Request, response: Response) => {
    const { scoreId } = request.params as { scoreId: string };
    const requestingUserId = (request as any).user.id;

    try {
        const score = await prisma.score.findUnique({
            where: { id: scoreId },
            // include: {
            //     profile: {
            //         select: {
            //             firstName: true,
            //             lastName: true,
            //             username: true
            //         }
            //     }
            // }
        });

        if (!score) {
            return response.status(404).json({ error: "Score not found." });
        }

        const isAuthorised = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            score.userId,
            ["ADMIN", "CAPTAIN", "RECORDS", "COACH"]
        );

        if (!isAuthorised) {
            return response.status(403).json({ error: "Forbidden." });
        }

        const canSeeJournal = await requireRoleInSharedClubOrDataOwnership(
            requestingUserId,
            score.userId,
            ["COACH"]
        );

        if (!canSeeJournal) {
            const { journal, ...scoreWithoutJournal } = score;
            return response.status(200).json(scoreWithoutJournal);
        }

        return response.status(200).json(score);
    } catch (_error: any) {
        return response.status(500).json({ error: "Internal Server Error." });
    }
};
