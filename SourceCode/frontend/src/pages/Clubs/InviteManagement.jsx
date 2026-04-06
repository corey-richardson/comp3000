import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import InviteActivity from "../../components/InviteManagement/InviteActivity";
import InviteForm from "../../components/InviteManagement/InviteForm";
import InviteList from "../../components/InviteManagement/InviteList";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";
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
    const [ activity, setActivity ] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const fetchInvites = useCallback(async () => {
        if (!clubId) return;

        setIsLoading(true);
        setError(null);

        try {
            const [ invitesResponse, updatesResponse ] = await Promise.all([
                makeApiCall(`/api/clubs/${clubId}/invites?page=${currentPage}&limit=${invitesPerPage}`),
                makeApiCall(`/api/clubs/${clubId}/invites/activity`)
            ]);

            if (invitesResponse && invitesResponse.ok) {
                const inviteData = await invitesResponse.json();
                setInvites(inviteData.invites);
                setTotalPages(inviteData.pagination.totalPages);
                setTotalCount(inviteData.pagination.totalCount);
            }

            if (updatesResponse && updatesResponse.ok) {
                const updatesData = await updatesResponse.json();
                setActivity(updatesData);
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

    const handleAddInvite = (invite) => {
        setInvites(prev => [invite, ...prev]);
        setTotalCount(prev => prev + 1);

        setActivity(prev => [invite, ...prev]);
    };

    const handleRemoveInvite = (id) => {
        setInvites(prev => prev.filter(invite => invite.id !== id));
        setTotalCount(prev => prev - 1);

        setActivity(prev => prev.filter(invite => invite.id !== id));
    };

    return (
        <div className="content">
            <Breadcrumbs />
            <h2>Invite Management</h2>

            <div className={sideFormStyles.sideForm}>
                <>
                    <InviteList
                        invites={invites}
                        totalCount={totalCount}
                        isLoading={isLoading}
                        error={error}
                        onRevokeSuccess={handleRemoveInvite}
                    />

                    <Pagination paginationProps={paginationProps} />
                </>

                <InviteForm
                    clubId={clubId}
                    onInviteSuccess={handleAddInvite}
                />
            </div>

            <InviteActivity
                activity={activity}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};

export default InviteManagement;
