import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import RecentScoreItem from "./RecentScoreItem";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";

const RecentScores = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ scores, setScores ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchLatestScores = async () => {
            if (!authIsReady || !user?.id) return;

            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall(`/api/scores/user/${user.id}?limit=5`);
                if (!response) return; // 401

                const data = await response.json();
                if (response.ok) {
                    setScores(data.scores);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestScores();
    }, [user.id, user.token, makeApiCall, authIsReady]);

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Recent Scores.</h2>

            { scores && scores.length > 0 && (
                <>
                    { scores.map(score => (
                        <RecentScoreItem score={score} key={score.id} />
                    )) }

                    <p>See all of your scores on the <Link to="../scores">My Scores</Link> page.</p>
                </>
            )}

            { !isLoading && scores && scores.length === 0 && <p className="small centred">No scores to display.</p> }

            { isLoading && <p className="small centred">Loading...</p> }
            { error && <p className="error-message">{error}</p> }
        </div>
    );
};

export { RecentScores };
