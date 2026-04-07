
import { Check, X, Clock } from "lucide-react";

import styles from "./InviteManagement.module.css";

const InviteActivity = ({ activity, isLoading, error }) => {

    const getLatestAction = (invite) => {
        if (invite.status === "ACCEPTED" && invite.accepted_at) {
            return {
                verb: "was",
                label: "accepted",
                date: invite.accepted_at,
                Icon: Check
            };
        }
        if (invite.status === "DECLINED" && invite.declined_at) {
            return {
                verb: "was",
                label: "declined",
                date: invite.declined_at,
                Icon: X
            };
        }
        return {
            verb: "is",
            label: "pending",
            date: invite.created_at,
            Icon: Clock
        };
    };

    if (error) return <p className="error-message">{ error }</p>;
    if (isLoading) return <p className="small centred">Loading activity...</p>;
    if (activity?.length === 0) return <p className="small centred">No recent activity.</p>;

    return (
        <div>
            <div className={styles.listHeader}>
                <h3>Recent Activity (30 days)</h3>
            </div>

            <div className={styles.activityList}>
                {activity.map((invite) => {
                    const { verb, label, date, Icon } = getLatestAction(invite);

                    const inviteeName = invite.invitee
                        ? `${invite.invitee.firstName} ${invite.invitee.lastName}`
                        : invite.membershipNumber || "New Member";

                    const inviterName = `${invite.inviter.firstName} ${invite.inviter.lastName}`;

                    return (
                        <div
                            key={invite.id}
                            className={styles.activityRow}
                        >
                            <Icon />

                            <p className={styles.actionText}>
                                <strong>{ inviteeName }</strong> was invited by <strong>{ inviterName }</strong>.
                                Their invite { verb } <strong>{ label }</strong> on&nbsp;
                                <strong>{ new Date(date).toLocaleDateString() }</strong> at&nbsp;
                                <strong>{ new Date(date).toLocaleTimeString() }</strong>.
                            </p>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default InviteActivity;
