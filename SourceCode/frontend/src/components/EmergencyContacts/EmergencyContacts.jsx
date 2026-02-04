import { useAuthContext } from "../../hooks/useAuthContext";
import dashboardStyles from "../../styles/Dashboard.module.css";

const EmergencyContactsSkeleton = () => {
    return (
        <div>
            <h2>Emergency Contact Details.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
};

const EmergencyContacts = () => {
    const { user } = useAuthContext();

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Emergency Contact Details.</h2>
            <p>{user?.username}</p>
        </div>
    );
};

export { EmergencyContactsSkeleton, EmergencyContacts };
