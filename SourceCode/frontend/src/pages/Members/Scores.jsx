import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { useApi } from "../../hooks/useApi";

const MemberScores = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);
    const [ scores, setScores] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await makeApiCall(`/api/scores/user/${userId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setScores(data.scores);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [ userId, makeApiCall ]);

    if (isLoading) {
        return (
            <div className="content">
                <Breadcrumbs customLabel="Loading..." />
                <p className="small centred">Loading scores...</p>
            </div>
        );
    }

    return (
        <div className="content">
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <h2>Scores for {`${user?.firstName} ${user?.lastName}`}</h2>
            <p className="small">{scores.length} scores to display.</p>

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberScores;
