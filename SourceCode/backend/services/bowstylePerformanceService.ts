import { Bowstyle, CompetitionStatus, Venue } from "@prisma/client";

import prisma from "../lib/prisma";

export const getBowstlyePerformances = async (userId: string) => {

    const now = new Date();
    const currentYear = now.getFullYear();

    const outdoorStartDate = new Date(currentYear - 1, 0, 1);
    const indoorStartDate = now.getMonth() < 6 ?
        new Date(currentYear - 2, 6, 1) :
        new Date(currentYear - 1, 6, 1);

    try {
        const scores = await prisma.score.findMany({
            where: {
                userId,
                status: "VERIFIED",
                classification: { not: "NC" },
                OR: [
                    { venue: "OUTDOOR", dateShot: { gte: outdoorStartDate } },
                    { venue: "INDOOR", dateShot: { gte: indoorStartDate } }
                ]
            },
            select: {
                venue: true,
                classification: true,
                numArrows: true,
                bowstyle: true,
                competition: true,
                handicap: true
            }
        });

        const calculateOverallHandicap = (venue: Venue, style: Bowstyle) => {
            const relevantHandicaps = scores
                .filter(score => (
                    score.venue === venue &&
                    score.bowstyle === style &&
                    score.classification !== "NC"
                ))
                .map(score => score.handicap as number)
                .sort((a, b) => a - b);

            if (relevantHandicaps.length < 3) {
                return null;
            }

            const bestThree = relevantHandicaps.slice(0, 3);
            const average = bestThree.reduce((sum: number, value: number) => sum + value, 0) / 3;

            return Math.floor(average);
        };

        const calculateOverallClassifiation = (venue: Venue, style: Bowstyle) => {
            const rank: Record<string, number> = {
                "UNCLASSIFIED": 0,
                "A3": 1, "A2": 2, "A1": 3,
                "B3": 4, "B2": 5, "B1": 6,
                "MB": 7, "GMB": 8, "EMB": 9
            };

            const relevantScores = scores
                .filter(score => (
                    score.venue === venue &&
                    score.bowstyle === style
                ))
                .map(score => ({
                    ...score,
                    rank: rank[score?.classification?.replace("I-", "") || "UNCLASSIFIED"] || 0
                }));

            if (relevantScores.length === 0) {
                return "UNCLASSIFIED";
            }

            const arrowCountRequirements = venue === "OUTDOOR"
                ? { ARCHER: 144, BOWMAN: 216, MASTER: 432 }
                : { ARCHER: 120, BOWMAN: 180, MASTER: 180 };

            const tiers = [
                "EMB", "GMB", "MB",
                "B1", "B2", "B3",
                "A1", "A2", "A3",
            ];

            for (const tier of tiers) {
                const tierRank = rank[tier];

                const qualifyingScores = relevantScores.filter(score => (
                    score.rank >= tierRank
                ));

                // Master Bowman Logic
                // - Record Status Events
                if (tierRank >= 7) {
                    const recordStatusScores = qualifyingScores.filter(score => (
                        score.competition === CompetitionStatus.RECORD_STATUS_COMPETITION
                    ));

                    const totalArrows = recordStatusScores.reduce((arrows, score) => (
                        arrows + score.numArrows
                    ), 0);

                    if (totalArrows >= arrowCountRequirements.MASTER) {
                        if (venue === Venue.OUTDOOR) return tier;
                        else return `I${tier}`;
                    }
                // Bowman Logic
                // Club Events, Open Competition or Record Status Events
                } else if (tierRank >= 4) {
                    const compScores = qualifyingScores.filter(score => (
                        score.competition === CompetitionStatus.RECORD_STATUS_COMPETITION ||
                        score.competition === CompetitionStatus.OPEN_COMPETITION ||
                        score.competition === CompetitionStatus.CLUB_EVENT
                    ));

                    const totalArrows = compScores.reduce((arrows, score) => (
                        arrows + score.numArrows
                    ), 0);

                    if (totalArrows >= arrowCountRequirements.BOWMAN) {
                        if (venue === Venue.OUTDOOR) return tier;
                        else return `I${tier}`;
                    }
                // Archer Logic
                // Any Event
                } else {
                    const totalArrows = qualifyingScores.reduce((arrows, score) => (
                        arrows + score.numArrows
                    ), 0);

                    if (totalArrows >= arrowCountRequirements.ARCHER) {
                        if (venue === Venue.OUTDOOR) return tier;
                        else return `I${tier}`;
                    }
                }
            }

            return "UNCLASSIFIED";
        };

        const bowstyles = Array.from(new Set(scores.map(score => score.bowstyle)));
        const summary = bowstyles.map(style => ({
            bowstyle: style,
            outdoor: {
                handicap: calculateOverallHandicap(Venue.OUTDOOR, style),
                classification: calculateOverallClassifiation(Venue.OUTDOOR, style),
            },
            indoor: {
                handicap: calculateOverallHandicap(Venue.INDOOR, style),
                classification: calculateOverallClassifiation(Venue.INDOOR, style),
            },
        }));

        return summary;

    } catch (error: any) {
        throw new Error("Classification Service Error: " + error.message);
    }
};
