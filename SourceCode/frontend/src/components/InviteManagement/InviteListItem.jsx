import { CircleX, HatGlasses, UserRound } from "lucide-react";
import { useState } from "react";

import styles from "./InviteManagement.module.css";
import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import cardStyles from "../../styles/Card.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const InviteListItem = ({ invite, onRevokeSuccess }) => {
    const [ isRevoking, setIsRevoking ] = useState(false);
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);

    const { makeApiCall } = useApi();

    const confirmRevoke = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/invites/${invite.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            onRevokeSuccess();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsRevoking(false);
            setIsPending(false);
        }
    };

    return (
        <div
            key={invite.id}
            className={cardStyles.cardItem}
        >
            <div className={cardStyles.topRow}>

                <div className={styles.userIdentity}>
                    { invite.invitee ? (
                        <><UserRound /> { invite.invitee.username } ({ invite.membershipNumber })</>
                    ) : (
                        <><HatGlasses /> Unlinked User ({ invite.membershipNumber })</>
                    )}
                </div>

                <div className={styles.inviteInfo}>
                    { EnumMap[invite.status] }
                </div>

            </div>

            <div className={cardStyles.mainInfo}>
                <div className={cardStyles.date}>
                    <span className="small">Invited on <strong>{ new Date(invite.created_at).toLocaleDateString() }</strong>. </span>
                    { invite.inviter && (
                        <span className="small">Invited by <strong>{ invite.inviter.firstName } { invite.inviter.lastName }</strong> ({ invite.inviter.username }).</span>
                    )}
                </div>

                {invite.status === "PENDING" && (
                    <button
                        onClick={() => setIsRevoking(true)}
                        className={badgeStyles.badge}
                        title="Revoke Invitation"
                    >
                        <CircleX />
                    </button>
                )}
            </div>

            <div className={cardStyles.footerRow}>
                { invite.asRoles.length > 0 && (
                    <span>
                        &nbsp;Roles: <strong>{invite.asRoles.map(role => EnumMap[role] || role).join(", ")}</strong>
                    </span>
                )}
            </div>

            { isRevoking && (
                <DeleteOverlay
                    message="Are you sure you want to revoke this invite?"
                    onConfirm={confirmRevoke}
                    onCancel={() => setIsRevoking(false)}
                    isPending={isPending}
                    confirmButtonText="Revoke"
                    confirmButtonTextAction="Revoking"
                />
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </div>
    );
};

export default InviteListItem;

/**
{invite.asRoles?.length > 0 && (
    <div className={styles.roleList}>
        {invite.asRoles?.map((role, index) => (
            <span key={role} className={styles.roleItem}>
                {EnumMap[role] || role}
                {index < invite.asRoles?.length - 1 && ","}
            </span>
        ))}
    </div>
)}
 */
