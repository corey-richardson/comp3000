import { CircleX, HatGlasses, UserRound } from "lucide-react";
import { useState } from "react";

import styles from "./InviteManagement.module.css";
import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";
import badgeStyles from "../../styles/BadgeGroups.module.css";
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
        } catch (_error) {
            setError("Failed to revoke invite.");
        } finally {
            setIsRevoking(false);
            setIsPending(false);
        }
    };

    return (
        <div key={invite.id} className={styles.listItem}>
            <div className={styles.mainInfo}>

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

            <div className={styles.metaInfo}>
                <span className="small">Invited on <strong>{ new Date(invite.created_at).toLocaleDateString() }</strong>.</span>
                { invite.inviter && (
                    <span className="small">Invited by <strong>{ invite.inviter.firstName } { invite.inviter.lastName }</strong> ({ invite.inviter.username }).</span>
                )}

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
