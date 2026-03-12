import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ClubCard from "../../components/ClubCard/ClubCard";
import { useApi } from "../../hooks/useApi";

const Clubs = () => {
    const { makeApiCall } = useApi();

    const [ clubs, setClubs ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchClubs = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall("/api/clubs/my-clubs");
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setClubs(data.memberships);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClubs();
    }, [ makeApiCall ]);

    const onLeave = async (membershipId) => {
        const response = await makeApiCall(`/api/clubs/memberships/${membershipId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setClubs(clubs.filter(membership => membership.id !== membershipId));
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    };

    return (
        <div className="content">
            <Breadcrumbs />

            <h2>Clubs.</h2>
            <Link to="./create" className="centred">Create a New Club</Link>

            { isLoading && <p className="small centred">Loading clubs...</p> }
            { error && <p className="error-message">{ error }</p> }

            { !isLoading && clubs.length === 0 && (
                <p className="small centred">No clubs to display.</p>
            )}

            { !isLoading && clubs.map((membership) => (
                <ClubCard membership={membership} onLeave={onLeave} key={membership.club.id} />
            ))}
        </div>
    );
};

export default Clubs;
