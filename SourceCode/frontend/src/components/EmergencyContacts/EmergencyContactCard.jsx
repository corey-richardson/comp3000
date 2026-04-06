import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

import styles from "./EmergencyContacts.module.css";
import EnumMap from "../../lib/enumMap.js";
import formStyles from "../../styles/Forms.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay.jsx";

const EmergencyContactCard = ({ contact, onUpdate, onDelete, isLoading, RELATIONSHIP_OPTIONS }) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ formData, setFormData ] = useState({ ...contact });
    const [ isChanged, setIsChanged ] = useState(false);

    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ isPendingDeletion, setIsPendingDeletion ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleChange = async (field, value) => {
        await setFormData(prev => ({ ...prev, [field]: value }));
        setIsChanged(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const success = await onUpdate(formData);
        if (success) {
            setIsChanged(false);
        }
    };

    const confirmDeletion = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);
        setIsPendingDeletion(true);

        try {
            await onDelete(contact.id);
        } catch (error) {
            setIsPendingDeletion(false);
            setError(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div key={contact.id} className={styles.contactCard}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={styles.cardHeader}
            >
                <strong>{contact.name} ({EnumMap[contact.relationshipToUser] || "Contact"})</strong>

                <span>{isOpen ? (
                    <>Hide Details <ChevronUp size={20} /></>
                ) : (
                    <>Show Details <ChevronDown size={20} /></>
                )}</span>

            </div>

            {isOpen && (
                <form
                    onSubmit={handleUpdate}
                    className={styles.updateForm}
                >
                    <div className={formStyles.row}>
                        <div className={formStyles.fieldGroup}>
                            <label>*Name:</label>
                            <input
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className={formStyles.fieldGroup}>
                            <label>Relationship:</label>
                            <select
                                value={formData.relationshipToUser}
                                onChange={(e) => handleChange("relationshipToUser", e.target.value)}
                            >
                                <option value="NOT_SET" disabled>Please Select</option>
                                {RELATIONSHIP_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{EnumMap[opt]}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.fieldGroup}>
                            <label>*Phone Number:</label>
                            <input
                                value={formData.phoneNumber}
                                type="tel"
                                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                required
                            />
                        </div>

                        <div className={formStyles.fieldGroup}>
                            <label>Email:</label>
                            <input
                                value={formData.emailAddress}
                                type="email"
                                onChange={(e) => handleChange("emailAddress", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={!isChanged || isLoading || !formData.name || !formData.phoneNumber}
                        >
                            Update Contact
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsDeleting(true)}
                        >
                            Delete
                        </button>
                    </div>

                    <p className={styles.lastUpdated}>Last updated: {new Date(contact.updated_at).toLocaleString()}</p>
                </form>
            )}

            {isDeleting && (
                <DeleteOverlay
                    message="Are you sure you want to delete this contact?"
                    onConfirm={confirmDeletion}
                    onCancel={() => setIsDeleting(false)}
                    isPending={isPendingDeletion}
                />
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </div>
    );
};

export default EmergencyContactCard;
