import { Check, Trash, X } from "lucide-react";
import { useState } from "react";

import EnumMap from "../../lib/enumMap";
import getClassificationClass from "../../lib/getClassificationClass";
import styles from "../../styles/ScoreItem.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const EditableScoreItem = ({ score, onDelete, onStatusUpdate, isPending }) => {
    const [ isDeleting, setIsDeleting ] = useState(false);

    const formattedDate = new Date(score.dateShot).toLocaleDateString();

    return (
        <div className={styles.scoreItem}>
            <div className={styles.topRow}>
                <span className={styles.date}>{ formattedDate }</span>

                <div className={styles.badgeGroup}>
                    <div className={styles.classificationBadge}>
                        { score.status }
                    </div>

                    { score.status !== "VERIFIED" && (
                        <button
                            onClick={() => onStatusUpdate(score.id, "VERIFIED")}
                            className={styles.badge} title={ "Approve Score" }
                        >
                            <Check />
                        </button>
                    )}

                    { score.status !== "REJECTED" && (
                        <button
                            onClick={() => onStatusUpdate(score.id, "REJECTED")}
                            className={styles.badge}
                            title={ "Reject Score" }
                        >
                            <X />
                        </button>
                    )}

                    <button
                        onClick={() => setIsDeleting(true)}
                        className={styles.badge}
                        title={ "Delete Score" }
                    >
                        <Trash />
                    </button>
                </div>

            </div>

            <div className={styles.mainInfo}>
                <div className={styles.roundDetails}>
                    <h3>{score.roundName}</h3>
                    <p>{ EnumMap[score.bowstyle] } { EnumMap[score.ageCategory] } { EnumMap[score.sex] }, { EnumMap[score.competition] }, { EnumMap[score.venue] }</p>

                </div>

                <div className={styles.scoreDisplay}>
                    <span className={styles.actualScore}>{score.score}</span>
                    <span className={styles.maxScore}>/ {score.maxScore}</span>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statBlock}>
                    <label>Hits</label>
                    <span>{score.hits || 0}</span>
                </div>

                <div className={styles.statBlock}>
                    <label>10s/9s</label>
                    <span>{score.tens || 0} / {score.nines || 0}</span>
                </div>

                <div className={styles.statBlock}>
                    <label>Xs</label>
                    <span>{score.xs || 0}</span>
                </div>
            </div>

            {(score.notes || score.journal) && (
                <div className={styles.notesGrid}>
                    {score.notes && (
                        <div className={styles.notesBlock}>
                            <label>Notes</label>
                            <span>{score.notes}</span>
                        </div>
                    )}

                    {score.journal && (
                        <div className={styles.notesBlock}>
                            <label>Journal</label>
                            <span>{score.journal}</span>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.footerRow}>
                <span className={`${styles.classificationBadge} ${getClassificationClass(score.classification)}`}>
                    Official Classification: { EnumMap[score.classification] || "Unclassified"}
                </span>

                { score.uncappedClassification && score.classification !== score.uncappedClassification && (
                    <span className={`${styles.classificationBadge} ${getClassificationClass(score.uncappedClassification)}`}>
                        Performance: { EnumMap[score.uncappedClassification] || "Unclassified"}
                    </span>
                )}

                {score.handicap && (
                    <span className={styles.handicap}>
                        Handicap: <strong>{Math.round(score.handicap)}</strong>
                    </span>
                )}
            </div>

            {isDeleting && (
                <DeleteOverlay
                    message="Remove this score from the user's records?"
                    onConfirm={() => onDelete(score.id)}
                    onCancel={() => setIsDeleting(false)}
                    isPending={isPending}
                />
            )}
        </div>
    );
};

export default EditableScoreItem;
