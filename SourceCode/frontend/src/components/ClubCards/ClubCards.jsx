import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";

const ClubCardsSkeleton = () => {
    return (
        <div>
            <h2>My Clubs.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
};

const ClubCards = () => {
    const { user } = useAuthContext();

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>My Clubs.</h2>
            <p>{user?.username}</p>
        </div>
    );
};

export { ClubCardsSkeleton, ClubCards };
