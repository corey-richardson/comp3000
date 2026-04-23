import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ClubDangerZone from "../../components/ClubDangerZone/ClubDangerZone";
import MembershipTable from "../../components/MembershipTable/MembershipTable";
import { useApi } from "../../hooks/useApi";
import headerLinkStyles from "../../styles/HeaderLinks.module.css";

const ManageClub = () => {
    const { id: clubId } = useParams();
    const { makeApiCall } = useApi();

    const [ club, setClub ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall(`/api/clubs/${clubId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setClub(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClub();
    }, [ clubId, makeApiCall ]);

    const decrementMemberCount = () => {
        setClub(prev => ({ ...prev, memberCount: club.memberCount - 1 }));
    };

    return (
        <div className="content">
            <Breadcrumbs customLabel={club?.name} />

            {isLoading ? (
                <p>Loading club...</p>
            ) : (
                <>
                    <h2>Manage {club?.name}.</h2>

                    <div className={headerLinkStyles.grid}>
                        <Link
                            to={`/clubs/${clubId}/scores`}
                            state={{ fromClub: clubId, clubName: club?.name }}
                            className={`${headerLinkStyles.cell} ${headerLinkStyles.clickable}`}
                        >
                            Score Records Management
                        </Link>

                        <Link
                            to={`/clubs/${clubId}/invites`}
                            state={{ fromClub: clubId, clubName: club?.name }}
                            className={`${headerLinkStyles.cell} ${headerLinkStyles.clickable}`}
                        >
                            View and Manage Invites
                        </Link>

                        <span className={headerLinkStyles.cell} title="Member Count">
                            <Users />
                            { club?.memberCount }
                        </span>
                    </div>

                    <MembershipTable members={club?.members} clubName={club?.name} decrementMemberCount={decrementMemberCount} />

                    <ClubDangerZone clubId={clubId} clubName={club?.name} />
                </>
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </div>
    );
};

export default ManageClub;
