import { renderHook } from "@testing-library/react";
import { Check, X, Warehouse, Sun } from "lucide-react";
import { describe, it, expect } from "vitest";

import { useScoreItem } from "./useScoreItem";

describe("useScoreItem", () => {
    it("should return verified scores when status is VERIFIED", () => {
        const mockScore = {
            status: "VERIFIED",
            verified_at: "2026-04-14T20:26:00Z",
            venue: "INDOOR"
        };

        const { result } = renderHook(() => useScoreItem(mockScore));

        expect(result.current.statusIcon.type).toBe(Check);
        expect(result.current.statusTitle).toContain("Verified by Records Officer");
        expect(result.current.statusTitle).toContain("2026");
    });

    it("should return rejected scores with red color when status is REJECTED", () => {
        const mockScore = {
            status: "REJECTED",
            venue: "OUTDOOR"
        };
        const { result } = renderHook(() => useScoreItem(mockScore));

        expect(result.current.statusIcon.type).toBe(X);
        expect(result.current.statusIcon.props.color).toBe("#ff0000");
        expect(result.current.statusTitle).toBe("Rejected by Records Officer");
    });

    it("should return Outdoor scores (Sun) for outdoor venues", () => {
        const mockScore = {
            status: "PENDING",
            venue: "OUTDOOR"
        };
        const { result } = renderHook(() => useScoreItem(mockScore));

        expect(result.current.venueIcon.type).toBe(Sun);
    });

    it("should return Indoor scores (Warehouse) for indoor venues", () => {
        const mockScore = {
            status: "PENDING",
            venue: "INDOOR"
        };
        const { result } = renderHook(() => useScoreItem(mockScore));

        expect(result.current.venueIcon.type).toBe(Warehouse);
    });
});
