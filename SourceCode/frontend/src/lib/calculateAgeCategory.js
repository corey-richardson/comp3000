import EnumMap from "./enumMap";

const CURRENT_YEAR = new Date().getFullYear();

function calculateAgeCategory(birthYear, yearToCompare = CURRENT_YEAR, formattingFlag = false) {

    if (birthYear === null) return formattingFlag ? EnumMap["SENIOR"] : "SENIOR";
    if (birthYear > (yearToCompare - 12)) return formattingFlag ? EnumMap["UNDER_12"] : "UNDER_12";
    if (birthYear > (yearToCompare - 14)) return formattingFlag ? EnumMap["UNDER_14"] : "UNDER_14";
    if (birthYear > (yearToCompare - 15)) return formattingFlag ? EnumMap["UNDER_15"] : "UNDER_15";
    if (birthYear > (yearToCompare - 16)) return formattingFlag ? EnumMap["UNDER_16"] : "UNDER_16";
    if (birthYear > (yearToCompare - 18)) return formattingFlag ? EnumMap["UNDER_18"] : "UNDER_18";
    if (birthYear > (yearToCompare - 21)) return formattingFlag ? EnumMap["UNDER_21"] : "UNDER_21";

    if (birthYear <= (yearToCompare - 50)) return formattingFlag ? EnumMap["OVER_FIFTY"] : "OVER_FIFTY";

    return formattingFlag ? EnumMap["SENIOR"] : "SENIOR";
}

export default calculateAgeCategory;
