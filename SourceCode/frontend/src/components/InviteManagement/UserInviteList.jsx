import { Check, X } from "lucide-react";
import { useState } from "react";

import { useApi } from "../../hooks/useApi";
import badgeStyles from "../../styles/BadgeGroups.module.css";
import cardStyles from "../../styles/Card.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const UserInviteListItem = ({ invite, onAccept, onRemove, setError }) => {
    const { makeApiCall } = useApi();

    const [isConfirming, setIsConfirming] = useState(false);
    const [isActioning, setIsActioning] = useState(false);

    const handleAction = async (inviteId, action) => {
        setIsActioning(true);

        try {
            const response = await makeApiCall(`/api/invites/${inviteId}/${action}`, {
                method: "POST"
            });

            if (!response) return; // 401
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.error);
            }

            if (onAccept && action === "accept") {
                onAccept(data);
            }

            onRemove(inviteId);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsActioning(false);
            setIsConfirming(false);
        }
    };

    return (
        <div className={cardStyles.cardItem}>
            <div className={cardStyles.topRow}>
                <span className={cardStyles.date}>
                    Invited on { new Date(invite.created_at).toLocaleDateString() }
                </span>
            </div>

            <div className={cardStyles.mainInfo}>
                <strong>{ invite.club.name }</strong>

                <div className={badgeStyles.group}>
                    <button
                        onClick={() => handleAction(invite.id, "accept")}
                        className={badgeStyles.badge}
                        title={ "Accept Invite" }
                        disabled={isActioning || isConfirming}
                    >
                        <Check />
                    </button>

                    <button
                        onClick={() => setIsConfirming(true)}
                        className={badgeStyles.badge}
                        title={ "Decline Invite" }
                        disabled={isActioning || isConfirming}
                    >
                        <X />
                    </button>
                </div>
            </div>

            <div className={cardStyles.footerRow}>
                { invite.club.name } have invited you to join their club.
            </div>

            {isConfirming && (
                <DeleteOverlay
                    message={`Decline invite from ${ invite.club.name }?`}
                    onConfirm={() => handleAction(invite.id, "decline")}
                    onCancel={() => setIsConfirming(false)}
                    isPending={isActioning}
                    confirmButtonText="Decline"
                    confirmButtonTextAction="Declining"
                    type="row"
                />
            )}
        </div>
    );
};

const UserInviteList = ({
    invites, setInvites,
    totalCount, setTotalCount,
    onAccept,
    isLoading,
    error, setError
}) => {

    const handleRemove = (id) => {
        setInvites(prev => prev.filter(invite => invite.id !== id));
        setTotalCount(prev => prev - 1);
    };

    if (isLoading) return <p className="small centred">Loading invites...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!isLoading && invites.length === 0) return <p className="small centred">No pending invites.</p>;

    return (
        <div>
            {invites.map((invite) => (
                <UserInviteListItem
                    key={invite.id}
                    invite={invite}
                    onAccept={onAccept}
                    onRemove={handleRemove}
                    setError={setError}
                />
            ))}

            <p className="small centred">Displaying { invites.length } of { totalCount } invites.</p>
        </div>
    );
};

export default UserInviteList;
