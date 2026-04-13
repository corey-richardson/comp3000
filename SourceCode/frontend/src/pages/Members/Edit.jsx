import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import RoleSelection from "../../components/RoleSelection/RoleSelection";
import { useApi } from "../../hooks/useApi";

const MemberEdit = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await makeApiCall(`/api/profiles/${userId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [ userId, makeApiCall ]);

    if (isLoading) {
        return (
            <div className="content">
                <Breadcrumbs customLabel="Loading..." />
                <p className="small centred">Loading user...</p>
            </div>
        );
    }

    return (
        <div className="content">
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <h2>Edit {`${user?.firstName} ${user?.lastName}`}</h2>

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberEdit;
