import styles from "./EmergencyContacts.module.css";
import EnumMap from "../../lib/enumMap";

const EmergencyContactsReadOnly = ({ contacts = [] }) => {

    if (!contacts || contacts.length === 0) {
        return <p className="small centred">No emergency contacts to display.</p>;
    }

    return (
        <div className={styles.readOnlyGrid}>
            { contacts.map((contact) => (
                <div key={contact.id} className={styles.staticCard}>

                    <div className={styles.staticCardHeader}>
                        <strong>{contact.name} ({EnumMap[contact.relationshipToUser] || "Contact"})</strong>
                    </div>

                    <div className={styles.staticCardBody}>
                        <p>Phone: {contact.phoneNumber}</p>
                        <p>Email: {contact.emailAddress}</p>
                    </div>

                    { contact.updated_at && (
                        <div className={styles.staticCardFooter}>
                            <p className="small">Last updated: {new Date(contact.updated_at).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export { EmergencyContactsReadOnly };
