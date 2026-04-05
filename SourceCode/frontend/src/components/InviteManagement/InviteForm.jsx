import { HatGlasses, Send } from "lucide-react";
import { useState } from "react";

import styles from "./InviteManagement.module.css";
import { useApi } from "../../hooks/useApi";
import formStyles from "../../styles/Forms.module.css";

const InviteForm = ({ clubId, onInviteSuccess }) => {
    const { makeApiCall } = useApi();

    const [ membershipNumber, setMembershipNumber ] = useState("");
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/clubs/${clubId}/invites`, {
                method: "POST",
                body: JSON.stringify({ membershipNumber }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            onInviteSuccess(data);
            setMembershipNumber("");
        } catch (_error) {
            setError("Failed to invite member.");
            console.log(_error);
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

                <div className={`${formStyles.row} ${formStyles.forceRow}`}>
                    <div className={formStyles.fieldGroup}>
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
                        disabled={!membershipNumber || isSubmitting}
                        className={formStyles.rowButton}
                    >
                        <span>{ isSubmitting ? "Inviting..." : "Invite" }</span>
                        <Send />
                    </button>
                </div>

                { error && <p className="error-message">{ error }</p> }
            </form>
        </div>
    );
};

export default InviteForm;
