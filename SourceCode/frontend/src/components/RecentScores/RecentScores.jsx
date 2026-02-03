import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";

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

    return ( 
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Recent Scores.</h2>
            <p>{user?.username}</p>
        </div>
    );
}
 
export { RecentScoresSkeleton, RecentScores };
