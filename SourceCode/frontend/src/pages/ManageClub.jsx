import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs/Breadcrumbs";
import { useApi } from "../hooks/useApi";

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

    return (
        <div className="content">
            <Breadcrumbs customLabel={club?.name} />

            {isLoading ? (
                <p>Loading club...</p>
            ) : (
                <>
                    <h2>Manage {club?.name}.</h2>
                    <p>{ club?.memberCount }</p>
                </>
            )}
        </div>
    );
};

export default ManageClub;
