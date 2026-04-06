const CURRENT_YEAR = new Date().getFullYear();

function calculateAgeCategory(birthYear, yearToCompare = CURRENT_YEAR) {

    if (birthYear === null) return "SENIOR";

    if (birthYear > (yearToCompare - 12)) return "UNDER_12";
    if (birthYear > (yearToCompare - 14)) return "UNDER_14";
    if (birthYear > (yearToCompare - 15)) return "UNDER_15";
    if (birthYear > (yearToCompare - 16)) return "UNDER_16";
    if (birthYear > (yearToCompare - 18)) return "UNDER_18";
    if (birthYear > (yearToCompare - 21)) return "UNDER_21";

    if (birthYear <= (yearToCompare - 50)) return "OVER_FIFTY";

    return "SENIOR";
}

export default calculateAgeCategory;
