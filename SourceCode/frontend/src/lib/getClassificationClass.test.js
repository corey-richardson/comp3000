import { describe, it, expect, vi } from "vitest";

import getClassificationClass from "./getClassificationClass";

// Mocked CSS Module
vi.mock("../components/ScoreItems/ScoreItem.module.css", () => ({
    default: {
        classMB: "mock-mb-style",
        classBowman: "mock-bowman-style",
        classArcher: "mock-archer-style",
        classUC: "mock-unclassified-style",
    },
}));

describe("getClassificationClass", () => {
    it("should return classUC as a fallback", () => {
        expect(getClassificationClass(null)).toBe("mock-unclassified-style");
        expect(getClassificationClass(undefined)).toBe("mock-unclassified-style");
    });

    describe("Master Bowman Categories", () => {
        it("should return classMB for Outdoor Master Bowman types", () => {
            expect(getClassificationClass("MB")).toBe("mock-mb-style");
            expect(getClassificationClass("GMB")).toBe("mock-mb-style");
            expect(getClassificationClass("EMB")).toBe("mock-mb-style");
        });

        it("should return classMB for Indoor Master Bowman types", () => {
            expect(getClassificationClass("IMB")).toBe("mock-mb-style");
            expect(getClassificationClass("IGMB")).toBe("mock-mb-style");
        });
    });

    describe("Bowman Categories", () => {
        it("should return classBowman for Outdoor Bowman (B1, B2, B3)", () => {
            expect(getClassificationClass("B1")).toBe("mock-bowman-style");
            expect(getClassificationClass("B3")).toBe("mock-bowman-style");
        });

        it("should return classBowman for Indoor Bowman (IB1, IB2, IB3)", () => {
            expect(getClassificationClass("IB1")).toBe("mock-bowman-style");
            expect(getClassificationClass("IB2")).toBe("mock-bowman-style");
        });
    });

    describe("Archer Categories", () => {
        it("should return classArcher for Outdoor Archer (A1, A2, A3)", () => {
            expect(getClassificationClass("A1")).toBe("mock-archer-style");
            expect(getClassificationClass("A3")).toBe("mock-archer-style");
        });

        it("should return classArcher for Indoor Archer (IA1, IA2, IA3)", () => {
            expect(getClassificationClass("IA1")).toBe("mock-archer-style");
            expect(getClassificationClass("IA3")).toBe("mock-archer-style");
        });
    });

    describe("Unclassified Scores", () => {
        it("should return classUC for UC and NC", () => {
            expect(getClassificationClass("UC")).toBe("mock-unclassified-style");
            expect(getClassificationClass("NC")).toBe("mock-unclassified-style");
        });
    });
});
