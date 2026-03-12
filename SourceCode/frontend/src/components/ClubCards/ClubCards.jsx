import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";
import ClubCard from "../ClubCard/ClubCard";

const ClubCards = () => {
    const { user } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ clubs, setClubs ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await makeApiCall("/api/clubs/my-clubs");
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setClubs(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchClubs();
        }
    },  [ user, makeApiCall ]);

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>My Clubs.</h2>

            { isLoading && <p className="small centred">Loading clubs...</p> }
            { error && <p className="error-message">{ error }</p> }

            <div className={dashboardStyles.clubList}>
                {!isLoading && clubs.length > 0 ? (
                    <>
                        { clubs.map((membership) => (
                            <ClubCard membership={membership} key={membership.club.id} />
                        )) }

                        <p className="centred">See all of the clubs you are a member of on the <Link to="../clubs">My Clubs</Link> page.</p>
                    </>
                ) : (
                    <p className="small centred">No clubs to display.</p>
                )}
            </div>
        </div>
    );
};

export { ClubCards };
