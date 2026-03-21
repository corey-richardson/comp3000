import { AlertTriangle, ArrowRight, Settings, Users, Unlink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./ClubCard.module.css";
import EnumMap from "../../lib/enumMap";
import deleteOverlayStyles from "../../styles/DeleteOverlay.module.css";

const ClubCard = ({ membership, onLeave }) => {
    const { club, roles, joined_at, memberCount } = membership;

    const [ isLeaving, setIsLeaving ] = useState(false);
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);

    const formattedDate = new Date(joined_at).toLocaleDateString();

    const isElevated = roles.some(role =>
        ["ADMIN", "CAPTAIN", "RECORDS", "COACH"].includes(role)
    );

    const handleLeaveClub = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);
        setIsLeaving(true);
    };

    const confirmLeave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPending(true);

        try {
            await onLeave(membership.id);
        } catch (error) {
            setIsPending(false);
            setError(error.message);
        } finally {
            setIsLeaving(false);
        }
    };

    const commonCardContent = (
        <>
            <div className={styles.topRow}>

                <span className={styles.date}>Since {formattedDate }</span>

                <div className={styles.badgeGroup}>
                    <span className={styles.badge} title="Member Count">
                        <Users />
                        { memberCount }
                    </span>

                    { isElevated && (
                        <span className={styles.badge} title="Manage Club">
                            <Settings />
                        </span>
                    )}

                    { onLeave && (
                        <span className={styles.badge} title="Leave Club">
                            <button
                                className={styles.invisibleButton}
                                onClick={handleLeaveClub}
                            >
                                <Unlink />
                            </button>
                        </span>
                    )}

                </div>

            </div>

            <div className={styles.mainInfo}>

                <div className={styles.clubInfo}>
                    <h3>{ club.name }</h3>

                    <div className={styles.rolesList}>
                        {roles.map((role) => (
                            <span key={role} className={styles.roleText}>
                                { EnumMap[role] }
                            </span>
                        ))}
                    </div>
                </div>

                {isElevated && (
                    <div className={styles.actionDisplay}>
                        <ArrowRight />
                    </div>
                )}

            </div>

            <div className={styles.footerRow}>
                <span className={`${styles.statusBadge} ${isElevated ? styles.elevated : styles.standard}`}>
                    {isElevated ? "Elevated Member" : "Standard Member"}
                </span>
            </div>

            { onLeave && isLeaving && (
                <div className={deleteOverlayStyles.overlay}>
                    <AlertTriangle size={24} />
                    <span className={deleteOverlayStyles.message}>Are you sure you want to leave this club?</span>

                    <div className={deleteOverlayStyles.buttonGroup}>
                        <button
                            onClick={confirmLeave}
                            disabled={isPending}
                            className={deleteOverlayStyles.confirmButton}
                        >
                            { isPending ? "Leaving..." : "Leave" }
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsLeaving(false);
                            }}
                            className={deleteOverlayStyles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </>
    );

    return isElevated ? (
        <Link to={`/clubs/${club.id}`} className={`${styles.clubItem} ${styles.clickable}`}>
            {commonCardContent}
        </Link>
    ) : (
        <div className={`${styles.card} ${styles.disabled}`}>
            {commonCardContent}
        </div>
    );
};

export default ClubCard;
