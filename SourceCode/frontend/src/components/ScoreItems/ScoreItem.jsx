import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./ScoreItem.module.css";
import { useApi } from "../../hooks/useApi";
import { useScoreItem } from "../../hooks/useScoreItem";
import EnumMap from "../../lib/enumMap";
import getClassificationClass from "../../lib/getClassificationClass";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import cardStyles from "../../styles/Card.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const ScoreItem = ({
    score,
    onDelete,
    isEditable = false,
    minimal = false
}) => {
    const { makeApiCall } = useApi();
    const { formattedDate, statusIcon, statusTitle, venueIcon } = useScoreItem(score);

    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/${score.id}`, { method: "DELETE" });
            if (!response) return; // 401

            if (response.ok) {
                onDelete(score.id);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={cardStyles.cardItem}>
            <div className={cardStyles.topRow}>
                <span className={cardStyles.date}>{ formattedDate }</span>

                <div className={badgeStyles.group}>
                    <div className={badgeStyles.group}>
                        <span
                            className={badgeStyles.infoBadge}
                            title={statusTitle}
                        >
                            { statusIcon }
                        </span>

                        <span className={badgeStyles.infoBadge} title={ EnumMap[score.venue] }>
                            { venueIcon }
                        </span>
                    </div>

                    {isEditable && !score.verified_at && (
                        <Link
                            to={`./edit/${score.id}`}
                            title="Edit Score"
                            className={badgeStyles.badge}
                        >
                            <Pencil />
                        </Link>
                    )}

                    {!minimal && onDelete && (
                        <button
                            onClick={() => setIsDeleting(true)}
                            className={badgeStyles.badge}
                            title="Delete Score"
                        >
                            <Trash />
                        </button>
                    )}

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

            {!minimal && (
                <>
                    <div className={styles.statsGrid}>
                        <div className={styles.statBlock}>
                            <label>Xs</label>
                            <span>{score.xs ?? "-"}</span>
                        </div>

                        <div className={styles.statBlock}>
                            <label>10s / 9s</label>
                            <span>{score.tens ?? 0} / {score.nines ?? 0}</span>
                        </div>

                        <div className={styles.statBlock}>
                            <label>Hits</label>
                            <span>{score.hits ?? "-"}</span>
                        </div>
                    </div>

                    {(score.notes || score.journal) && (
                        <div className={styles.notesGrid}>
                            {score.notes && (
                                <div className={styles.notesBlock}>
                                    <label>Notes</label>
                                    <span>{score.notes ?? "-"}</span>
                                </div>
                            )}

                            {score.journal && (
                                <div className={styles.notesBlock}>
                                    <label>Journal</label>
                                    <span>{score.journal ?? "-"}</span>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <div className={cardStyles.footerRow}>
                <span className={`${styles.classificationBadge} ${getClassificationClass(score.classification)}`}>
                    Official Classification: { EnumMap[score.classification] || "Unclassified"}
                </span>

                { score.uncappedClassification && score.classification !== score.uncappedClassification && (
                    <span className={`${styles.classificationBadge} ${getClassificationClass(score.uncappedClassification)}`}>
                        Performance: { EnumMap[score.uncappedClassification] || "Unclassified"}
                    </span>
                )}

                <span className={styles.handicap}>Handicap: { score.handicap }</span>
            </div>

            {isDeleting && (
                <DeleteOverlay
                    message="Are you sure you want to delete this score?"
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleting(false)}
                    isPending={isPending}
                />
            )}

            {error && <span className="error-message small centred">{ error }</span>}
        </div>
    );
};

export default ScoreItem;
