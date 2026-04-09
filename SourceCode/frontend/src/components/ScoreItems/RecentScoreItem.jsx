import { Check, Sun, Target, Warehouse, X } from "lucide-react";

import styles from "./ScoreItem.module.css";
import EnumMap from "../../lib/enumMap";
import getClassificationClass from "../../lib/getClassificationClass";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import cardStyles from "../../styles/Card.module.css";

const RecentScoreItem = ({ score }) => {
    const formattedDate = new Date(score.dateShot).toLocaleDateString();
    const verificationDate = score.verified_at ? new Date(score.verified_at) : null;

    const getStatusIcon = () => {
        switch (score.status) {
            case "VERIFIED":
                return <Check />;
            case "REJECTED":
                return <X color="#ff0000" />;
            default:
                return <Target />;
        }
    };

    const getStatusTitle = () => {
        if (score.status === "VERIFIED" && verificationDate) {
            return `Verified by Records Officer on ${verificationDate.toLocaleDateString()} at ${verificationDate.toLocaleTimeString()}`;
        }
        if (score.status === "REJECTED") {
            return "Rejected by Records Officer";
        }
        return "Pending verification by Records Officer";
    };

    return (
        <div className={cardStyles.cardItem}>
            <div className={cardStyles.topRow}>
                <span className={cardStyles.date}>{ formattedDate }</span>

                <div className={badgeStyles.group}>
                    <span
                        className={badgeStyles.infoBadge}
                        title={getStatusTitle()}
                    >
                        {getStatusIcon()}
                    </span>

                    <span className={badgeStyles.infoBadge} title={ EnumMap[score.venue] }>
                        { score.venue === "INDOOR" ? <Warehouse /> : <Sun /> }
                    </span>
                </div>
            </div>

            <div className={cardStyles.mainInfo}>
                <div className={styles.roundDetails}>
                    <h3>{ score.roundName }</h3>
                    <p>{ EnumMap[score.bowstyle] } { EnumMap[score.ageCategory] } { EnumMap[score.sex] }, { EnumMap[score.competition] }</p>
                </div>
                <div className={styles.scoreDisplay}>
                    <span className={styles.actualScore}>{score.score}</span>
                    <span className={styles.maxScore}>/ {score.maxScore}</span>
                </div>
            </div>

            <div className={cardStyles.footerRow}>
                <span className={`${styles.classificationBadge} ${getClassificationClass(score.classification)}`}>
                    { EnumMap[score.classification] || "Unclassified"}
                </span>

                <span className={styles.handicap}>Handicap: { score.handicap }</span>
            </div>
        </div>
    );
};

export default RecentScoreItem;
