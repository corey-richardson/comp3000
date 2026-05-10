import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useScoreFilters } from "./useScoreFilters";

describe("useScoreFilters Hook", () => {
    const INITIAL_FILTERS = {
        searchPhrase: "",
        status: "ALL",
        venue: "ALL",
        bowstyle: "ALL",
        ageCategory: "ALL",
        sex: "ALL",
        sortOrder: "NEWEST",
        startDate: "",
        endDate: ""
    };

    it("should initialize with default filter values", () => {
        const { result } = renderHook(() => useScoreFilters());

        expect(result.current.filters).toEqual(INITIAL_FILTERS);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should update a specific filter field", () => {
        const { result } = renderHook(() => useScoreFilters());

        act(() => {
            result.current.updateFilters("bowstyle", "BAREBOW");
        });

        expect(result.current.filters.bowstyle).toBe("BAREBOW");
        expect(result.current.filters.status).toBe("ALL");
    });

    it("should correctly identify when filters are not active", () => {
        const { result } = renderHook(() => useScoreFilters());
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should correctly identify when filters are active", () => {
        const { result } = renderHook(() => useScoreFilters());

        act(() => {
            result.current.updateFilters("searchPhrase", "Portsmouth");
        });

        expect(result.current.hasActiveFilters).toBe(true);
    });

    it("should reset to initial state when clearFilters is called", () => {
        const { result } = renderHook(() => useScoreFilters());

        act(() => {
            result.current.updateFilters("status", "VERIFIED");
            result.current.updateFilters("venue", "INDOOR");
        });

        expect(result.current.hasActiveFilters).toBe(true);

        act(() => {
            result.current.clearFilters();
        });

        expect(result.current.filters).toEqual(INITIAL_FILTERS);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should maintain other filter values when one is updated", () => {
        const { result } = renderHook(() => useScoreFilters());

        act(() => {
            result.current.updateFilters("sex", "FEMALE");
        });

        act(() => {
            result.current.updateFilters("sortOrder", "SCORE_DESC");
        });

        expect(result.current.filters.sex).toBe("FEMALE");
        expect(result.current.filters.sortOrder).toBe("SCORE_DESC");
    });
});
