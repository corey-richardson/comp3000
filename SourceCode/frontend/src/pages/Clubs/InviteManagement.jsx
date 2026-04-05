import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import InviteList from "../../components/InviteManagement/InviteList";
import { useApi } from "../../hooks/useApi";
import formStyles from "../../styles/LandingPageForms.module.css";
import sideFormStyles from "../../styles/SideForm.module.css";

const InviteManagement = () => {

    const { id: clubId } = useParams();
    const { makeApiCall } = useApi();

    const [ invites, setInvites ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const fetchInvites = useCallback(async () => {
        if (!clubId) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/clubs/${clubId}/invites`);
            if (!response) return; // 401

            if (response.ok) {
                const data = await response.json();
                setInvites(data);
            }
        } catch (_error) {
            setError("Failed to load invites.");
        } finally {
            setIsLoading(false);
        }

    }, [clubId, makeApiCall ]);

    useEffect(() => {
        fetchInvites();
    }, [ fetchInvites ]);

    const handleRemoveInvite = (id) => {
        setInvites(prev => prev.filter(invite => invite.id !== id));
    };

    return (
        <div className="content">
            <Breadcrumbs />
            <h2>Invite Management</h2>

            <div className={sideFormStyles.sideForm}>
                <div>
                    <InviteList
                        invites={invites}
                        isLoading={isLoading}
                        error={error}
                        onRevokeSuccess={handleRemoveInvite}
                    />
                </div>

                <div className={formStyles.formBox}>
                    <p>THIS WILL BE A FORM TO CREATE A NEW INVITE</p>
                </div>
            </div>
        </div>
    );
};

export default InviteManagement;
