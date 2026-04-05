import { Check, Sun, Warehouse, X } from "lucide-react";

import EnumMap from "../../lib/enumMap";
import getClassificationClass from "../../lib/getClassificationClass";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import styles from "../../styles/ScoreItem.module.css";

const RecentScoreItem = ({ score }) => {
    const formattedDate = new Date(score.dateShot).toLocaleDateString();

    return (
        <div className={styles.scoreItem}>
            <div className={styles.topRow}>
                <span className={styles.date}>{ formattedDate }</span>

                <div className={badgeStyles.group}>
                    <span className={badgeStyles.infoBadge} title={score.verifiedAt ? "Processed by Records Officer" : "Unprocessed by Records Officer"}>
                        { score.verifiedAt ? <Check /> : <X /> }
                    </span>

                    <span className={badgeStyles.infoBadge} title={ EnumMap[score.venue] }>
                        { score.venue === "INDOOR" ? <Warehouse /> : <Sun /> }
                    </span>
                </div>
            </div>

            <div className={styles.mainInfo}>
                <div className={styles.roundDetails}>
                    <h3>{ score.roundName }</h3>
                    <p>{ EnumMap[score.bowstyle] } { EnumMap[score.ageCategory] } { EnumMap[score.sex] }, { EnumMap[score.competition] }</p>
                </div>
                <div className={styles.scoreDisplay}>
                    <span className={styles.actualScore}>{score.score}</span>
                    <span className={styles.maxScore}>/ {score.maxScore}</span>
                </div>
            </div>

            <div className={styles.footerRow}>
                <span className={`${styles.classificationBadge} ${getClassificationClass(score.classification)}`}>
                    { EnumMap[score.classification] || "Unclassified"}
                </span>

                <span className={styles.handicap}>Handicap: { score.handicap }</span>
            </div>
        </div>
    );
};

export default RecentScoreItem;
