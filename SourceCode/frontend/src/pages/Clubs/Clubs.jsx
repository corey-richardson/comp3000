import { Target } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ClubCard from "../../components/ClubCards/ClubCard";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";
import headerLinkStyles from "../../styles/HeaderLinks.module.css";

const Clubs = () => {
    const { makeApiCall } = useApi();

    const paginationProps = usePagination(1);
    const {
        currentPage,
        loadNumber,
        setTotalPages,
        totalCount, setTotalCount
    } = paginationProps;

    const [ clubs, setClubs ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const fetchClubs = useCallback(async (currentPage) => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await makeApiCall(`/api/clubs/my-clubs?page=${currentPage}&limit=${loadNumber}`);
            if (!response) return; // 401

            if (response.ok) {
                const data = await response.json();
                setClubs(data.memberships);

                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [ makeApiCall, loadNumber, setTotalCount, setTotalPages ]);

    useEffect(() => {
        fetchClubs(currentPage);
    }, [ currentPage, loadNumber, setTotalPages, setTotalCount, fetchClubs ]);

    const onLeave = async (membershipId) => {
        const response = await makeApiCall(`/api/clubs/memberships/${membershipId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setClubs(clubs.filter(membership => membership.id !== membershipId));

            setTotalCount(prev => prev - 1);
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    };

    return (
        <div className="content">
            <Breadcrumbs />

            <h2>Clubs.</h2>

            <div className={headerLinkStyles.grid}>
                <Link
                    to={"./create"}
                    className={`${headerLinkStyles.cell} ${headerLinkStyles.clickable}`}
                >
                    Create a New Club
                </Link>

                <Link
                    to={"./invites"}
                    className={`${headerLinkStyles.cell} ${headerLinkStyles.clickable}`}
                >
                    View Incoming Invites
                </Link>

                <span className={headerLinkStyles.cell} title={`You are a member of ${ clubs?.length } clubs.`}>
                    <Target />
                    { totalCount }
                </span>
            </div>

            <p className="small">{ totalCount } clubs to display. { clubs.length !== totalCount && <span>({ clubs.length } displayed.)</span> }</p>

            { isLoading && <p className="small centred">Loading clubs...</p> }
            { error && <p className="error-message">{ error }</p> }

            { !isLoading && clubs.length === 0 && (
                <p className="small centred">No clubs to display.</p>
            )}

            { !isLoading && clubs.map((membership) => (
                <ClubCard membership={membership} onLeave={onLeave} key={membership.club.id} />
            ))}

            <Pagination paginationProps={paginationProps} />
        </div>
    );
};

export default Clubs;
