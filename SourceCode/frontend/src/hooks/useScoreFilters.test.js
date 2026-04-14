import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useScoreFilters } from "./useScoreFilters";

const MOCK_SCORES = [
    {
        roundName: "Portsmouth",
        status: "VERIFIED",
        venue: "INDOOR",
        bowstyle: "RECURVE",
        dateShot: "2026-01-10",
        score: 550,
        ageCategory: "SENIOR",
        user: { sex: "MALE" }
    },
    {
        roundName: "WA 50m (Compound)",
        status: "SUBMITTED",
        venue: "OUTDOOR",
        bowstyle: "COMPOUND",
        dateShot: "2026-01-01",
        score: 680,
        ageCategory: "UNDER_21",
        user: { sex: "FEMALE" }
    }
];

describe("useScoreFilters", () => {
    it("should return all scores when no filters are applied", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        expect(result.current.hasActiveFilters).toBe(false);
        expect(result.current.filteredScores).toHaveLength(2);
    });

    it("should handle an empty input", () => {
        const { result } = renderHook(() => useScoreFilters());

        expect(result.current.filteredScores).toHaveLength(0);
        expect(result.current.filteredScores).toEqual([]);
    });

    it("should update hasActiveFilters when filter state is altered, and reset state on clear", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        expect(result.current.hasActiveFilters).toBe(false);

        act(() => {
            result.current.updateFilters("bowstyle", "COMPOUND");
        });
        expect(result.current.hasActiveFilters).toBe(true);

        act(() => {
            result.current.clearFilters();
        });
        expect(result.current.hasActiveFilters).toBe(false);

        expect(result.current.filters.bowstyle).toBe("ALL");
    });

    it("should filter by search phrase (case insensitively)", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("searchPhrase", "ports");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].roundName).toBe("Portsmouth");
    });

    it("should filter by status", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("status", "SUBMITTED");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].status).toBe("SUBMITTED");
    });

    it("should filter by venue", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("venue", "INDOOR");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].venue).toBe("INDOOR");
    });

    it("should filter by bowstyle", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("bowstyle", "COMPOUND");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].bowstyle).toBe("COMPOUND");
    });

    it("should filter by age category", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("ageCategory", "SENIOR");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].ageCategory).toBe("SENIOR");
    });

    it("should filter by sex", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("sex", "MALE");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].user?.sex).toBe("MALE");
    });

    it("should filter by date range (startDate)", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("startDate", "2026-01-05");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].roundName).toBe("Portsmouth");
    });

    it("should filter by date range (endDate)", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("endDate", "2026-01-05");
        });

        expect(result.current.hasActiveFilters).toBe(true);
        expect(result.current.filteredScores).toHaveLength(1);
        expect(result.current.filteredScores[0].roundName).toBe("WA 50m (Compound)");
    });

    it("should sort by date", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("sortOrder", "NEWEST");
        });
        expect(result.current.filteredScores[0].roundName).toBe("Portsmouth");

        act(() => {
            result.current.updateFilters("sortOrder", "OLDEST");
        });
        expect(result.current.filteredScores[0].roundName).toBe("WA 50m (Compound)");

    });

    it("should sort by score descending", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        act(() => {
            result.current.updateFilters("sortOrder", "SCORE");
        });

        expect(result.current.filteredScores[0].roundName).toBe("WA 50m (Compound)"); // 680
        expect(result.current.filteredScores[1].roundName).toBe("Portsmouth"); // 550
    });

    it("should gracefully handle an unknown sort key", () => {
        const { result } = renderHook(() => useScoreFilters(MOCK_SCORES));

        expect(() => {
            act(() => {
                result.current.updateFilters("sortOrder", "SCORE");
            });
        }).not.toThrow();
    });
});
