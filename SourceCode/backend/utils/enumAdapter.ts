import { AgeCategories, Sex } from "@prisma/client";

// Python archeryutils -> Prisma Enums

export function toPrismaAge(age: string): AgeCategories {
    switch (age) {
        case "ADULT":
        case "SENIOR":
            return AgeCategories.SENIOR;
        case "50_PLUS":
        case "OVER_FIFTY":
            return AgeCategories.OVER_FIFTY;

        default:
            throw new Error(`Invalid age category: ${age}`);
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
        case AgeCategories.SENIOR:
            return "ADULT";
        case AgeCategories.OVER_FIFTY:
            return "50_PLUS";

        default:
            throw new Error(`Invalid age category: ${age}`);
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
