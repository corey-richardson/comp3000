import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";
import EnumMap from "../../lib/enumMap";

const RecentScoresSkeleton = () => {
    return ( 
        <div>
            <h2>Recent Scores.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}
 
const RecentScores = () => {
    const { user } = useAuthContext();

    const [ scores, setScores ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchLatestScores = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await fetch(`/api/scores/user/${user.id}?limit=10`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setScores(data);
                    console.log(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestScores();
    }, [user.id, user.token]);


    return ( 
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Recent Scores.</h2>

            { scores && scores.length > 0 && (
                scores.map(score => (
                    <div className={dashboardStyles.recentScoreItem} key={score.id}>
                        <p>{score.roundName}: {score.score}/{score.maxScore} | {EnumMap[score.classification]} (H/C: {score.handicap}) ({new Date(score.dateShot).toLocaleDateString()})</p>
                    </div>
                ))
            )}

            { scores && scores.length === 0 && <p className="small centred">No scores to display.</p> }
            { isLoading && <p className="small centred">Loading...</p> }
            { error && <p className="error-message">{error}</p> }
        </div>
    );
}
 
export { RecentScoresSkeleton, RecentScores };
