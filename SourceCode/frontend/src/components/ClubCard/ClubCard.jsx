import { ArrowRight, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

import styles from "./ClubCard.module.css";
import EnumMap from "../../lib/enumMap";

const ClubCard = ({ membership }) => {
    const { club, roles, joined_at, memberCount } = membership;
    const formattedDate = new Date(joined_at).toLocaleDateString();

    const isElevated = roles.some(role =>
        ["ADMIN", "CAPTAIN", "RECORDS", "COACH"].includes(role)
    );

    console.log(membership);

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
