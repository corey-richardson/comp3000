import { ArrowRight, Settings, Users, Unlink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./ClubCard.module.css";
import EnumMap from "../../lib/enumMap";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import cardStyles from "../../styles/Card.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

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
            <div className={cardStyles.topRow}>

                <span className={cardStyles.date}>Since {formattedDate }</span>

                <div className={badgeStyles.group}>
                    <span className={badgeStyles.infoBadge} title="Member Count">
                        <Users />
                        { memberCount || "-" }
                    </span>

                    { isElevated && (
                        <span className={badgeStyles.badge} title="Manage Club">
                            <Settings />
                        </span>
                    )}

                    { onLeave && (
                        <span className={badgeStyles.badge} title="Leave Club">
                            <button
                                className={badgeStyles.invisibleButton}
                                onClick={handleLeaveClub}
                            >
                                <Unlink />
                            </button>
                        </span>
                    )}

                </div>

            </div>

            <div className={cardStyles.mainInfo}>

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

            <div className={cardStyles.footerRow}>
                <span className={`${styles.statusBadge} ${isElevated ? styles.elevated : styles.standard}`}>
                    {isElevated ? "Elevated Member" : "Standard Member"}
                </span>
            </div>

            { onLeave && isLeaving && (
                <DeleteOverlay
                    message="Are you sure you want to leave this club?"
                    onConfirm={confirmLeave}
                    onCancel={() => setIsLeaving(false)}
                    isPending={isPending}
                    confirmButtonText="Leave"
                    confirmButtonTextAction="Leaving"
                />
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </>
    );

    return isElevated ? (
        <Link
            to={`/clubs/${club.id}`}
            className={`${cardStyles.cardItem} ${cardStyles.clickable}`}
        >
            {commonCardContent}
        </Link>
    ) : (
        <div className={`${cardStyles.cardItem}`}>
            {commonCardContent}
        </div>
    );
};

export default ClubCard;
