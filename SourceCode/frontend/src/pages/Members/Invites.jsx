
import { useEffect, useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import UserInviteList from "../../components/InviteManagement/UserInviteList";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";

const MemberInvites = () => {
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

    useEffect(() => {
        const fetchInvites = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall(`/api/invites/my-invites?page=${currentPage}&limit=${invitesPerPage}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setInvites(data.invites);

                    setTotalPages(data.pagination.totalPages);
                    setTotalCount(data.pagination.totalCount);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvites();
    }, [ makeApiCall, currentPage, setTotalPages, setTotalCount ]);

    return (
        <div className="content">
            <Breadcrumbs />

            <h2>Invites</h2>
            <UserInviteList
                invites={invites}
                setInvites={setInvites}
                totalCount={totalCount}
                setTotalCount={setTotalCount}
                isLoading={isLoading}
                error={error}
                setError={setError}
            />

            <Pagination paginationProps={paginationProps} />
        </div>
    );
};

export default MemberInvites;
