/** Acts as a "single source of truth" for converting internal database enum 
 * keys into a display-ready string.
 * 
 * Ensures consistency across the application.
 */

const EnumMap = {
    // Membership Roles
    MEMBER: "Member",
    COACH : "Coach",
    RECORDS: "Records",
    CAPTAIN: "Captain",
    ADMIN: "Admin",
    // Bowstyles
    BAREBOW: "Barebow",
    RECURVE: "Recurve",
    COMPOUND: "Compound",
    LONGBOW: "Longbow",
    // Sex Categories
    OPEN: "Open",
    FEMALE: "Female",
    // Age Categories
    UNDER_12: "Under 12",
    UNDER_14: "Under 14",
    UNDER_15: "Under 15",
    UNDER_16: "Under 16",
    UNDER_18: "Under 18",
    UNDER_21: "Under 21",
    SENIOR: "Senior",
    OVER_FIFTY: "50+",
    // Category Not Set
    NOT_SET: "Not Set",
    // Emergency Contact Relationship Types
    PARENT: "Parent",
    GRANDPARENT: "Grandparent",
    GUARDIAN: "Guardian",
    SPOUSE: "Spouse",
    SIBLING: "Sibling",
    FRIEND: "Friend",
    OTHER: "Other",
    INDOOR: "Indoor",
    OUTDOOR: "Outdoor",
    // Indoor Classifications
    IA3: "Indoor Archer 3rd Class",
    IA2: "Indoor Archer 2nd Class",
    IA1: "Indoor Archer 1st Class",
    IB3: "Indoor Bowman 3rd Class",
    IB2: "Indoor Bowman 2nd Class",
    IB1: "Indoor Bowman 1st Class",
    IMB: "Indoor Master Bowman",
    IGMB: "Indoor Grand Master Bowman",
    // Outdoor Classifications
    A3: "Archer 3rd Class",
    A2: "Archer 2nd Class",
    A1: "Archer 1st Class",
    B3: "Bowman 3rd Class",
    B2: "Bowman 2nd Class",
    B1: "Bowman 1st Class",
    MB: "Master Bowman ",
    GMB: "Grand Master Bowman ",
    EMB: "Elite Master Bowman ",
    // Either Classification
    UNCLASSIFIED: "Unclassified",
    // Competition Statuses
    PRACTICE: "Club Practice",
    CLUB_EVENT: "Club Event / Target Day",
    OPEN_COMPETITION: "Open Competition",
    RECORD_STATUS_COMPETITION: "Record Status Competition",
    // Invite Statuses
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    DECLINED: "Declined",
};

export default EnumMap;
