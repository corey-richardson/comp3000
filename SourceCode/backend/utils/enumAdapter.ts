import { AgeCategories, Sex } from "@prisma/client";

// Python archeryutils -> Prisma Enums

export function toPrismaAge(age: string): AgeCategories {
    switch (age) {
        case "UNDER_12":
        case "U12":
            return AgeCategories.UNDER_12;
        case "UNDER_14":
        case "U14":
            return AgeCategories.UNDER_14;
        case "UNDER_15":
        case "U15":
            return AgeCategories.UNDER_15;
        case "UNDER_16":
        case "U16":
            return AgeCategories.UNDER_16;
        case "UNDER_18":
        case "U18":
            return AgeCategories.UNDER_18;
        case "UNDER_21":
        case "U21":
            return AgeCategories.UNDER_21;
        case "ADULT":
        case "SENIOR":
            return AgeCategories.SENIOR;
        case "50_PLUS":
        case "OVER_FIFTY":
            return AgeCategories.OVER_FIFTY;

        default:
            throw new Error(`Invalid Prisma age category: ${age}`);
    }
}

export function toPrismaSex(sex: string): Sex {
    switch (sex) {
        case "MALE":
        case "OPEN":
            return Sex.OPEN;
        case "FEMALE":
            return Sex.FEMALE;

        default:
            throw new Error(`Invalid sex: ${sex}`);
    }
}

// Prisma -> archeryutils Enums

export function toPythonAge(age: AgeCategories): string {
    switch (age) {
        case AgeCategories.UNDER_12:
            return "UNDER_12";
        case AgeCategories.UNDER_14:
            return "UNDER_14";
        case AgeCategories.UNDER_15:
            return "UNDER_15";
        case AgeCategories.UNDER_16:
            return "UNDER_16";
        case AgeCategories.UNDER_18:
            return "UNDER_18";
        case AgeCategories.UNDER_21:
            return "UNDER_21";
        case AgeCategories.SENIOR:
            return "ADULT";
        case AgeCategories.OVER_FIFTY:
            return "50_PLUS";

        default:
            throw new Error(`Invalid Python age category: ${age}`);
    }
}

export function toPythonSex(sex: Sex): string {
    switch (sex) {
        case Sex.OPEN:
            return "MALE";
        case Sex.FEMALE:
            return "FEMALE";

        default:
            throw new Error(`Invalid sex: ${sex}`);
    }
}
