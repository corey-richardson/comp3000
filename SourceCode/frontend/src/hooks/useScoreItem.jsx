import { Check, Sun, Target, Warehouse, X } from "lucide-react";

/**
 * This hook handles UI formatting for a Score object
 * * Date Formatting
 * * Status Icon Selection
 * * Status Title Selection
 * * Venue Icon Selection
 * @param {Object} score
 * @returns {string} formattedDate Date String
 * @returns {Object} statusIcon `lucide-react` Icon
 * @returns {string} statusTitle Tooltip text
 * @returns {Object} venueIcon `lucide-react` Icon representing Indoor or Outdoor venue
 */
export const useScoreItem = (score) => {
    const formattedDate = new Date(score.dateShot).toLocaleDateString();
    const verificationDate = score.verified_at ? new Date(score.verified_at) : null;

    const statusIcon = score.status === "VERIFIED"
        ? <Check />
        : score.status === "REJECTED"
            ? <X color="#ff0000" />
            : <Target />;

    const statusTitle = score.status === "VERIFIED" && verificationDate
        ? `Verified by Records Officer on ${verificationDate.toLocaleDateString()} at ${verificationDate.toLocaleTimeString()}`
        : score.status === "REJECTED"
            ? "Rejected by Records Officer"
            : "Pending verification by Records Officer";

    const venueIcon = score.venue === "INDOOR"
        ? <Warehouse />
        : <Sun />;

    return { formattedDate, statusIcon, statusTitle, venueIcon };
};
