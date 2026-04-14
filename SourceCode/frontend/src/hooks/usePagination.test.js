import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { usePagination } from "./usePagination";

describe("usePagination", () => {
    it("should initialise with default values", () => {
        // Act
        const { result } = renderHook(() => usePagination());
        // Assert
        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalPages).toBe(1);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.loadNumber).toBe(25);
    });

    it("should increment currentPage with the nextPage method but remain clamped to lte totalPages", () => {
        const { result } = renderHook(() => usePagination());

        // totalPages = 2, currentPage = 1
        act(() => {
            result.current.setTotalPages(2);
        });

        // totalPages = 2, currentPage = 2
        act(() => {
            result.current.nextPage();
        });
        expect(result.current.currentPage).toBe(2);

        // totalPages = 2, currentPage = 2 (clamped)
        act(() => {
            result.current.nextPage();
        });
        expect(result.current.currentPage).toBe(2); // no change
    });

    it("should decrement currentPage with the prevPage method but remain clamped to gte 1", () => {
        // currentPage = 2
        const { result } = renderHook(() => usePagination(2));

        // currentPage = 1
        act(() => {
            result.current.prevPage();
        });
        expect(result.current.currentPage).toBe(1);

        // currentPage = 1 (clamped)
        act(() => {
            result.current.prevPage();
        });
        expect(result.current.currentPage).toBe(1); // no change
    });

    it("should reset currentPage to 1 when loadNumber changes", () => {
        // currentPage = 9
        const { result } = renderHook(() => usePagination(9));
        expect(result.current.currentPage).toBe(9);

        act(() => {
            result.current.setLoadNumber(10);
        });
        expect(result.current.currentPage).toBe(1);
    });
});
