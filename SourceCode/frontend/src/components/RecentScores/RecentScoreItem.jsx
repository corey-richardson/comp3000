import EnumMap from "../../lib/enumMap";
import { Sun, Warehouse } from "lucide-react";
import styles from "../../styles/ScoreItem.module.css";
import getClassificationClass from "../../lib/getClassificationClass";

const RecentScoreItem = ({ score }) => {
    const formattedDate = new Date(score.dateShot).toLocaleDateString();

    return ( 
        <div className={styles.recentScoreItem}>
            <div className={styles.topRow}>
                <span className={styles.date}>{ formattedDate }</span>
                <span className={styles.venueBadge} title={ EnumMap[score.venue] }>{ score.venue === "INDOOR" ?  <Warehouse /> : <Sun />}</span>
            </div>

            <div className={styles.mainInfo}>
                <div className={styles.roundDetails}>
                    <h3>{ score.roundName }</h3>
                    <p>{ EnumMap[score.bowstyle] }, { EnumMap[score.competition] }</p>
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
}
 
export default RecentScoreItem;
