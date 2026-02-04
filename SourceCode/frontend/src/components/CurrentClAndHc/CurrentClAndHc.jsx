import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";

const CurrentClassificationsAndHandicapsSkeleton = () => {
    return (
        <div>
            <h2>Current Classifications and Handicaps.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
};

const CurrentClassificationsAndHandicaps = () => {
    const { user } = useAuthContext();

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Current Classifications and Handicaps.</h2>
            <p>{ user?.username }</p>
        </div>
    );
};

export { CurrentClassificationsAndHandicapsSkeleton, CurrentClassificationsAndHandicaps };
