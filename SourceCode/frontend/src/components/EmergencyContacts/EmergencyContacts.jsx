import { useCallback, useEffect, useState } from "react";

import EmergencyContactCard from "./EmergencyContactCard";
import styles from "./EmergencyContacts.module.css";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import EnumMap from "../../lib/enumMap.js";
import formStyles from "../../styles/Forms.module.css";

const RELATIONSHIP_OPTIONS = ["PARENT", "GRANDPARENT", "GUARDIAN", "SPOUSE", "SIBLING", "FRIEND", "OTHER"];

const EmergencyContacts = () => {
    /* CONTEXT / HOOKS */
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    /* STATE */
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newContact, setNewContact] = useState({
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        relationshipType: "NOT_SET"
    });

    /* API HANDLERS */

    const fetchContacts = useCallback(async () => {
        if (!authIsReady || !user?.id) return;
        setLoading(true);

        try {
            const response = await makeApiCall(`/api/contacts/user/${user.id}`);
            const data = await response.json();

            if (response.ok) {
                setContacts(data.contacts);
            }
        } catch (_error) {
            setError("Could not load contacts.");
        } finally {
            setLoading(false);
        }
    }, [user?.id, authIsReady, makeApiCall]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const tempId = "temp-" + Date.now();
        const optimisticContact = {
            id: tempId,
            name: newContact.contactName,
            phoneNumber: newContact.contactPhone,
            emailAddress: newContact.contactEmail,
            relationshipToUser: newContact.relationshipType,
            updatedAt: new Date().toISOString(),
        };

        setContacts(prev => [...prev, optimisticContact]);
        setNewContact({ contactName: "", contactPhone: "", contactEmail: "", relationshipType: "NOT_SET" });

        try {
            const response = await makeApiCall(`/api/contacts/user/${user.id}`, {
                method: "POST",
                body: JSON.stringify({
                    name: optimisticContact.name,
                    phoneNumber: optimisticContact.phoneNumber,
                    emailAddress: optimisticContact.emailAddress,
                    relationshipToUser: optimisticContact.relationshipToUser !== "NOT_SET" ? optimisticContact.relationshipToUser : null,
                }),
            });

            if (response.ok) {
                const savedContact = await response.json();
                setContacts(prev => prev.map(c => c.id === tempId ? savedContact : c));
            } else {
                setContacts(prev => prev.filter(c => c.id !== tempId));
                setError("Failed to create contact.");
            }
        } catch (_error) {
            setError("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (contact) => {
        setLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/contacts/${contact.id}`, {
                method: "PATCH",
                body: JSON.stringify({ contact }),
            });

            if (response.ok) {
                const updatedContact = await response.json();
                setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
                return true;
            }
        } catch (_error) {
            setError("Update Failed.");
            fetchContacts();
        } finally {
            setLoading(false);
        }

        return false;
    };

    const handleDelete = async (contactId) => {
        setLoading(true);

        try {
            const response = await makeApiCall(`/api/contacts/${contactId}`, { method: "DELETE" });
            if (response.ok) {
                setContacts(prev => prev.filter(c => c.id !== contactId));
            }
        } catch (_error) {
            setError("Delete failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${formStyles.formContainer} ${formStyles.fullWidth}`}>

            <h2>Emergency Contact Details.</h2>
            <p className="centred">Please provide up-to-date emergency contact details. This information is used by your club in case of urgent situations and will only be accessed by authorised officials. You can add, update, or remove contacts at any time. If you have privacy concerns, contact your club administrator.</p>
            <h3 className="subheader">Add a New Emergency Contact.</h3>

            <form onSubmit={handleCreate}>
                <div className={formStyles.row}>
                    <div className={formStyles.fieldGroup}>
                        <label>*Name:</label>
                        <input
                            value={newContact.contactName}
                            onChange={(e) => setNewContact({ ...newContact, contactName: e.target.value })}
                            required
                        />
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label>Relationship:</label>
                        <select
                            value={newContact.relationshipType}
                            onChange={(e) => setNewContact({ ...newContact, relationshipType: e.target.value })}
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
                        <label>*Phone Number</label>
                        <input
                            value={newContact.contactPhone}
                            type="tel"
                            onChange={(e) => setNewContact({ ...newContact, contactPhone: e.target.value })}
                            required
                        />
                    </div>
                    <div className={formStyles.fieldGroup}>
                        <label>Email:</label>
                        <input
                            value={newContact.contactEmail}
                            type="email"
                            onChange={(e) => setNewContact({ ...newContact, contactEmail: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!newContact.contactName || !newContact.contactPhone || loading}>
                    {loading ? "Adding..." : "Add New Contact"}
                </button>
            </form>

            { contacts && contacts.length > 0 && (
                <div className={styles.existingContacts}>
                    <h3 className="subheader">Existing Emergency Contacts.</h3>

                    {contacts.map((contact) => (
                        <EmergencyContactCard
                            key={contact.id}
                            contact={contact}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            loading={loading}
                            RELATIONSHIP_OPTIONS={RELATIONSHIP_OPTIONS}
                        />
                    ))}
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default EmergencyContacts;
