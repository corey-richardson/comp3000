import { describe, it, expect } from "vitest";

import calculateAgeCategory from "./calculateAgeCategory";

describe("calculateAgeCategory", () => {
    const TEST_YEAR = 2026;

    it("should return SENIOR if birthYear is null", () => {
        expect(calculateAgeCategory(null, TEST_YEAR)).toBe("SENIOR");
    });

    it("should use the current year if yearCompare is ommitted", () => {
        const currentYear = new Date().getFullYear();
        expect(calculateAgeCategory(currentYear - 20)).toBe("UNDER_21");
    });

    describe("Junior Categories", () => {
        it("should return UNDER_12 for someone aged 11", () => {
            expect(calculateAgeCategory(2015, TEST_YEAR)).toBe("UNDER_12");
        });

        it("should return UNDER_14 for someone aged 12", () => {
            expect(calculateAgeCategory(2014, TEST_YEAR)).toBe("UNDER_14");
        });

        it("should return UNDER_14 for someone aged 13", () => {
            expect(calculateAgeCategory(2013, TEST_YEAR)).toBe("UNDER_14");
        });

        it("should return UNDER_15 for someone aged 14", () => {
            expect(calculateAgeCategory(2012, TEST_YEAR)).toBe("UNDER_15");
        });

        it("should return UNDER_16 for someone aged 15", () => {
            expect(calculateAgeCategory(2011, TEST_YEAR)).toBe("UNDER_16");
        });

        it("should return UNDER_18 for someone aged 16", () => {
            expect(calculateAgeCategory(2010, TEST_YEAR)).toBe("UNDER_18");
        });

        it("should return UNDER_18 for someone aged 17", () => {
            expect(calculateAgeCategory(2009, TEST_YEAR)).toBe("UNDER_18");
        });

        it("should return UNDER_21 for someone aged 18", () => {
            expect(calculateAgeCategory(2008, TEST_YEAR)).toBe("UNDER_21");
        });

        it("should return UNDER_21 for someone aged 19", () => {
            expect(calculateAgeCategory(2007, TEST_YEAR)).toBe("UNDER_21");
        });

        it("should return UNDER_21 for someone aged 20", () => {
            expect(calculateAgeCategory(2006, TEST_YEAR)).toBe("UNDER_21");
        });
    });

    describe("Senior Category", () => {
        it("should return SENIOR for someone aged 21", () => {
            expect(calculateAgeCategory(2005, TEST_YEAR)).toBe("SENIOR");
        });

        it("should return SENIOR for someone aged 22", () => {
            expect(calculateAgeCategory(2004, TEST_YEAR)).toBe("SENIOR");
        });

        it("should return SENIOR for someone aged 49", () => {
            expect(calculateAgeCategory(1977, TEST_YEAR)).toBe("SENIOR");
        });
    });

    describe("Over Fifties Category", () => {
        it("should return OVER_FIFTY for someone aged 50", () => {
            expect(calculateAgeCategory(1976, TEST_YEAR)).toBe("OVER_FIFTY");
        });

        it("should return OVER_FIFTY for someone aged 2026", () => {
            expect(calculateAgeCategory(0, TEST_YEAR)).toBe("OVER_FIFTY");
        });
    });
});
