import { HatGlasses, Send } from "lucide-react";
import { useState } from "react";

import styles from "./InviteManagement.module.css";
import { useApi } from "../../hooks/useApi";
import formStyles from "../../styles/Forms.module.css";
import RoleSelection from "../RoleSelection/RoleSelection";

const InviteForm = ({ clubId, onInviteSuccess }) => {
    const { makeApiCall } = useApi();

    const [ membershipNumber, setMembershipNumber ] = useState("");
    const [ selectedRoles, setSelectedRoles ] = useState(["MEMBER"]);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleRoleChange = (role) => {
        setSelectedRoles((prev) => (
            prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [ ...prev, role ]
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/clubs/${clubId}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    membershipNumber,
                    asRoles: selectedRoles
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            onInviteSuccess(data);
            setMembershipNumber("");
            setSelectedRoles(["MEMBER"]);
        } catch (error) {
            setError(error.message || "Failed to invite member.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className={styles.listHeader}>
                <h3>Invite Member</h3>
            </div>

            <form
                className={`${formStyles.formContainer} ${formStyles.fullWidth}`}
                onSubmit={handleSubmit}
            >

                <div className={styles.topRow}>
                    <div className={formStyles.fieldGroup} style={{ flex: 2 }}>
                        <label
                            className={formStyles.labelWithIcon}
                            htmlFor="membershipNumber"
                            style={{ width: "100%" }}
                        >
                            <HatGlasses />
                            Membership Number:
                        </label>
                        <input
                            type="text"
                            id="membershipNumber"
                            name="membershipNumber"
                            value={membershipNumber}
                            onChange={(e) => setMembershipNumber(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!membershipNumber || selectedRoles.length === 0 || isSubmitting}
                        className={formStyles.rowButton}
                    >
                        <span>{ isSubmitting ? "Inviting..." : "Invite" }</span>
                        <Send />
                    </button>
                </div>

                <div className={styles.bottomRow}>
                    <RoleSelection
                        selectedRoles={selectedRoles}
                        onRoleChange={handleRoleChange}
                        disabled={isSubmitting}
                    />
                </div>

                { error && <p className="error-message">{ error }</p> }
            </form>
        </div>
    );
};

export default InviteForm;
