import { AgeCategories, Sex } from "@prisma/client";
import { describe, it, expect } from "vitest";

import {
    toPrismaAge,
    toPrismaSex,
    toPythonAge,
    toPythonSex
} from "./enumAdapter";

describe("enumAdapter", () => {
    describe("toPrismaAge", () => {
        const cases = [
            { input: "UNDER_12", expected: AgeCategories.UNDER_12 },
            { input: "U12",      expected: AgeCategories.UNDER_12 },
            { input: "UNDER_14", expected: AgeCategories.UNDER_14 },
            { input: "U14",      expected: AgeCategories.UNDER_14 },
            { input: "UNDER_15", expected: AgeCategories.UNDER_15 },
            { input: "U15",      expected: AgeCategories.UNDER_15 },
            { input: "UNDER_16", expected: AgeCategories.UNDER_16 },
            { input: "U16",      expected: AgeCategories.UNDER_16 },
            { input: "UNDER_18", expected: AgeCategories.UNDER_18 },
            { input: "U18",      expected: AgeCategories.UNDER_18 },
            { input: "UNDER_21", expected: AgeCategories.UNDER_21 },
            { input: "U21",      expected: AgeCategories.UNDER_21 },
            { input: "ADULT",    expected: AgeCategories.SENIOR },
            { input: "SENIOR",   expected: AgeCategories.SENIOR },
            { input: "50_PLUS",  expected: AgeCategories.OVER_FIFTY },
            { input: "OVER_FIFTY", expected: AgeCategories.OVER_FIFTY },
        ];

        it.each(cases)("should map $input to AgeCategories.$expected", ({ input, expected }) => {
            expect(toPrismaAge(input)).toBe(expected);
        });

        it("should throw an error for invalid age categories", () => {
            expect(() => toPrismaAge("BABY")).toThrow("Invalid Prisma age category: BABY");
        });
    });

    describe("toPrismaSex", () => {
        it("should map MALE/OPEN to Sex.OPEN", () => {
            expect(toPrismaSex("MALE")).toBe(Sex.OPEN);
            expect(toPrismaSex("OPEN")).toBe(Sex.OPEN);
        });

        it("should map FEMALE to Sex.FEMALE", () => {
            expect(toPrismaSex("FEMALE")).toBe(Sex.FEMALE);
        });

        it("should throw an error for invalid sex", () => {
            expect(() => toPrismaSex("OTHER")).toThrow("Invalid sex: OTHER");
        });
    });

    describe("toPythonAge", () => {
        const cases = [
            { input: AgeCategories.UNDER_12,  expected: "UNDER_12" },
            { input: AgeCategories.UNDER_14,  expected: "UNDER_14" },
            { input: AgeCategories.UNDER_15,  expected: "UNDER_15" },
            { input: AgeCategories.UNDER_16,  expected: "UNDER_16" },
            { input: AgeCategories.UNDER_18,  expected: "UNDER_18" },
            { input: AgeCategories.UNDER_21,  expected: "UNDER_21" },
            { input: AgeCategories.SENIOR,    expected: "ADULT" },
            { input: AgeCategories.OVER_FIFTY, expected: "50_PLUS" },
        ];

        it.each(cases)("should map AgeCategories.$input to string $expected", ({ input, expected }) => {
            expect(toPythonAge(input)).toBe(expected);
        });

        it("should throw error for unhandled enum values", () => {
            expect(() => toPythonAge("INVALID_ENUM" as any)).toThrow("Invalid Python age category: INVALID_ENUM");
        });
    });

    describe("toPythonSex", () => {
        it("should map Sex.OPEN to MALE for Flask service compatibility", () => {
            expect(toPythonSex(Sex.OPEN)).toBe("MALE");
        });

        it("should map Sex.FEMALE to FEMALE for Flask service compatibility", () => {
            expect(toPythonSex(Sex.FEMALE)).toBe("FEMALE");
        });

        it("should throw error for unhandled enum values", () => {
            expect(() => toPythonSex("INVALID_ENUM" as any)).toThrow("Invalid sex: INVALID_ENUM");
        });
    });
});
