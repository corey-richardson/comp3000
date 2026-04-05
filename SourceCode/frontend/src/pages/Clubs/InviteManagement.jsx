import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import InviteList from "../../components/InviteManagement/InviteList";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";
import formStyles from "../../styles/LandingPageForms.module.css";
import sideFormStyles from "../../styles/SideForm.module.css";

const InviteManagement = () => {

    const { id: clubId } = useParams();
    const { makeApiCall } = useApi();

    const paginationProps = usePagination();
    const {
        currentPage, setTotalPages,
        totalCount, setTotalCount
    } = paginationProps;

    const invitesPerPage = 10;

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
            const response = await makeApiCall(`/api/clubs/${clubId}/invites?page=${currentPage}&limit=${invitesPerPage}`);
            if (!response) return; // 401

            if (response.ok) {
                const data = await response.json();
                setInvites(data.invites);

                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }
        } catch (_error) {
            setError("Failed to load invites.");
        } finally {
            setIsLoading(false);
        }

    }, [clubId, makeApiCall, currentPage, setTotalPages, setTotalCount ]);

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
                        totalCount={totalCount}
                        isLoading={isLoading}
                        error={error}
                        onRevokeSuccess={handleRemoveInvite}
                    />

                    <Pagination paginationProps={paginationProps} />
                </div>

                <div className={formStyles.formBox}>
                    <p>THIS WILL BE A FORM TO CREATE A NEW INVITE</p>
                </div>
            </div>
        </div>
    );
};

export default InviteManagement;
