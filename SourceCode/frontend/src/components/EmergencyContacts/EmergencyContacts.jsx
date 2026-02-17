import { ChevronUp, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import styles from "./EmergencyContacts.module.css";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import EnumMap from "../../lib/enumMap.js";
import formStyles from "../../styles/Forms.module.css";

const EmergencyContactsSkeleton = () => {
    return (
        <div className={formStyles.formContainer}>
            <h2>Emergency Contact Details.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
};

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

    const [newContactPending, setNewContactPending] = useState(false);
    const [changesPending, setChangesPending] = useState([]);
    const [openContactIndex, setOpenContactIndex] = useState(null);

    const toggleContact = (index) => setOpenContactIndex(openContactIndex === index ? null : index);

    /* API HANDLERS */

    const fetchContacts = useCallback(async () => {
        if (!authIsReady || !user?.id) return;
        setLoading(true);
        try {
            const response = await makeApiCall(`/api/contacts/user/${user.id}`);
            if (!response) return;
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
                return;
            }
            setContacts(data);
        } catch (_error) {
            setError("Could not load contacts.");
        } finally {
            setLoading(false);
        }
    }, [user?.id, authIsReady, makeApiCall]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleCreateNewContact = async (e) => {
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
        setNewContactPending(false);

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
                setChangesPending([]);
                setNewContactPending(false);
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

    const handleUpdateExistingContact = async (e, contact) => {
        e.preventDefault();
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
                setChangesPending(prev => prev.filter(id => id !== updatedContact.id));
                setChangesPending([]);
                setNewContactPending(false);
            }
        } catch (_error) {
            setError("Update Failed.");
            fetchContacts();
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExistingContact = async (contactId) => {
        if (!window.confirm("Are you sure?")) return;
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

    /* INPUT HANDLERS */
    const handleNewInputChange = (field) => (e) => {
        setNewContact(prev => ({ ...prev, [field]: e.target.value }));
        setNewContactPending(true);
    };

    const handleExistingContactChange = (index, field, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][field] = value;
        setContacts(updatedContacts);

        const contactId = contacts[index].id;
        if (!changesPending.includes(contactId)) {
            setChangesPending(prev => [...prev, contactId]);
        }
    };

    return (
        <div className={`${formStyles.formContainer} ${formStyles.fullWidth}`}>

            <h2>Emergency Contact Details.</h2>
            <p className="centred">Please provide up-to-date emergency contact details. This information is used by your club in case of urgent situations and will only be accessed by authorised officials. You can add, update, or remove contacts at any time. If you have privacy concerns, contact your club administrator.</p>
            <h3 className="subheader">Add a New Emergency Contact.</h3>

            <form onSubmit={handleCreateNewContact}>
                <div className={formStyles.row}>
                    <div className={formStyles.fieldGroup}>
                        <label>*Name:</label>
                        <input value={newContact.contactName} onChange={handleNewInputChange("contactName")} required />
                    </div>
                    <div className={formStyles.fieldGroup}>
                        <label>Relationship:</label>
                        <select value={newContact.relationshipType} onChange={handleNewInputChange("relationshipType")}>
                            <option value="NOT_SET" disabled>Please Select</option>
                            <option value="PARENT">{ EnumMap["PARENT"] }</option>
                            <option value="GRANDPARENT">{ EnumMap["GRANDPARENT"] }</option>
                            <option value="GUARDIAN">{ EnumMap["GUARDIAN"] }</option>
                            <option value="SPOUSE">{ EnumMap["SPOUSE"] }</option>
                            <option value="SIBLING">{ EnumMap["SIBLING"] }</option>
                            <option value="FRIEND">{ EnumMap["FRIEND"] }</option>
                            <option value="OTHER">{ EnumMap["OTHER"] }</option>
                        </select>
                    </div>
                </div>

                <div className={formStyles.row}>
                    <div className={formStyles.fieldGroup}>
                        <label>Phone Number</label>
                        <input value={newContact.contactPhone} type="tel" onChange={handleNewInputChange("contactPhone")} required />
                    </div>
                    <div className={formStyles.fieldGroup}>
                        <label>Email:</label>
                        <input value={newContact.contactEmail} type="email" onChange={handleNewInputChange("contactEmail")} />
                    </div>
                </div>

                <button type="submit" disabled={!newContactPending || loading}>
                    {loading ? "Adding..." : "Add New Contact"}
                </button>
            </form>

            { contacts && contacts.length > 0 && (
                <div className={styles.existingContacts}>
                    <h3 className="subheader">Existing Emergency Contacts.</h3>

                    {contacts.map((contact, index) => (
                        <div key={contact.id} className={styles.contactCard}>
                            <div onClick={() => toggleContact(index)} className={styles.cardHeader}>
                                <strong>{contact.name} ({EnumMap[contact.relationshipToUser] || "Contact"})</strong>
                                <span>{openContactIndex === index ? (
                                    <>Hide Details <ChevronUp size={20} /></>
                                ) : (
                                    <>Show Details <ChevronDown size={20} /></>
                                )}</span>
                            </div>

                            {openContactIndex === index && (
                                <form onSubmit={(e) => handleUpdateExistingContact(e, contact)} className={styles.updateForm}>
                                    <div className={formStyles.row}>
                                        <div className={formStyles.fieldGroup}>
                                            <label>*Name:</label>
                                            <input
                                                value={contact.name}
                                                onChange={(e) => handleExistingContactChange(index, "name", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className={formStyles.fieldGroup}>
                                            <label>Relationship:</label>
                                            <select
                                                value={contact.relationshipToUser}
                                                onChange={(e) => handleExistingContactChange(index, "relationshipToUser", e.target.value)}
                                            >
                                                <option value="NOT_SET" disabled>Please Select</option>
                                                <option value="PARENT">{ EnumMap["PARENT"] }</option>
                                                <option value="GRANDPARENT">{ EnumMap["GRANDPARENT"] }</option>
                                                <option value="GUARDIAN">{ EnumMap["GUARDIAN"] }</option>
                                                <option value="SPOUSE">{ EnumMap["SPOUSE"] }</option>
                                                <option value="SIBLING">{ EnumMap["SIBLING"] }</option>
                                                <option value="FRIEND">{ EnumMap["FRIEND"] }</option>
                                                <option value="OTHER">{ EnumMap["OTHER"] }</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={formStyles.row}>
                                        <div className={formStyles.fieldGroup}>
                                            <label>Phone Number</label>
                                            <input
                                                value={contact.phoneNumber}
                                                type="tel"
                                                onChange={(e) => handleExistingContactChange(index, "phoneNumber", e.target.value)}
                                            />
                                        </div>
                                        <div className={formStyles.fieldGroup}>
                                            <label>Email:</label>
                                            <input
                                                value={contact.emailAddress}
                                                type="email"
                                                onChange={(e) => handleExistingContactChange(index, "emailAddress", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.buttonGroup}>
                                        <button type="submit" disabled={!changesPending.includes(contact.id) || loading}>
                                            Update Contact
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteExistingContact(contact.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className={styles.lastUpdated}>Last updated: {new Date(contact.updated_at).toLocaleString()}</p>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export { EmergencyContactsSkeleton, EmergencyContacts };
