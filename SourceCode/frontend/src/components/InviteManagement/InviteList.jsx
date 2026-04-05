import InviteListItem from "./InviteListItem";
import styles from "./InviteManagement.module.css";

const InviteList = ({ invites, isLoading, error, onRevokeSuccess }) => {

    return (
        <div className={styles.listContainer}>

            <div className={styles.listHeader}>
                <h3>Invites</h3>
                <p className="small">{ invites?.length || "No" } active invites loaded.</p>
            </div>

            <div className={styles.listContent}>
                { invites.map((invite) => (
                    <InviteListItem
                        key={invite.id}
                        invite={invite}
                        onRevokeSuccess={() => onRevokeSuccess(invite.id) }
                    />
                ))}

                {invites.length === 0 && <p className="small centred">No invitations found.</p>}
            </div>

            { error && <p className="error-message">{ error }</p> }
        </div>
    );
};

export default InviteList;
