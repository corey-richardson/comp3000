import { Check, Pencil, Sun, Target, Trash, Warehouse, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";
import getClassificationClass from "../../lib/getClassificationClass";
import styles from "../../styles/ScoreItem.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const ScoreItem = ({ score, onDelete }) => {
    const { makeApiCall } = useApi();
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);

    const formattedDate = new Date(score.dateShot).toLocaleDateString();
    const verificationDate = score.verified_at ? new Date(score.verified_at) : null;

    const getStatusIcon = () => {
        switch (score.status) {
            case "VERIFIED":
                return <Check />;
            case "REJECTED":
                return <X />;
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

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/${score.id}`, { method: "DELETE" });
            if (!response) return; // 401

            if (response.ok) {
                onDelete(score.id); // Notify parent page to filter local state
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={styles.scoreItem}>
            <div className={styles.topRow}>
                <span className={styles.date}>{ formattedDate }</span>

                <div className={styles.badgeGroup}>
                    <span
                        className={styles.badge}
                        title={getStatusTitle()}
                    >
                        {getStatusIcon()}
                    </span>

                    <span className={styles.badge} title={ EnumMap[score.venue] }>
                        { score.venue === "INDOOR" ? <Warehouse /> : <Sun /> }
                    </span>

                    {!score.verified_at && (
                        <span className={styles.badge} title="Edit Score">
                            <Link to={`./edit/${score.id}`}><Pencil /></Link>
                        </span>
                    )}

                    <span className={styles.badge} title="Delete">
                        <button
                            onClick={() => setIsDeleting(true)}
                            className={styles.invisibleButton}
                        >
                            <Trash />
                        </button>
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

            <div className={styles.footerRow}>
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

            <span>{error}</span>
        </div>
    );
};

export default ScoreItem;
