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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    );
};

export { CurrentClassificationsAndHandicapsSkeleton, CurrentClassificationsAndHandicaps };
