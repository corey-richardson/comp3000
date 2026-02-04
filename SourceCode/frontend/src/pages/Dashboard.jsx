
import { ClubCards } from "../components/ClubCards/ClubCards.jsx";
import { CurrentClassificationsAndHandicaps } from "../components/CurrentClAndHc/CurrentClAndHc.jsx";
import { DetailsForm } from "../components/DetailsForm/DetailsForm.jsx";
import { EmergencyContacts } from "../components/EmergencyContacts/EmergencyContacts.jsx";
import { RecentScores } from "../components/RecentScores/RecentScores.jsx";
import { useAuthContext } from "../hooks/useAuthContext";
import dashboardStyles from "../styles/Dashboard.module.css";

const Dashboard = () => {
    const { user } = useAuthContext();
    const userId = user?.id;

    return (
        <div>

            <div className={dashboardStyles.dashboardGrid}>
                <RecentScores userId={userId} />
                <CurrentClassificationsAndHandicaps userId={userId} />
            </div>

            <DetailsForm userId={userId} />

            <div className={dashboardStyles.dashboardGrid}>
                <ClubCards userId={userId} />
                <EmergencyContacts userId={userId}/>
            </div>

        </div>
    );
};

export default Dashboard;
