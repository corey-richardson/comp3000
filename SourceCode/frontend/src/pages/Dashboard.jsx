import { useAuthContext } from "../hooks/useAuthContext";

import { RecentScores } from "../components/RecentScores/RecentScores.jsx";
import { CurrentClassificationsAndHandicaps } from "../components/CurrentClAndHc/CurrentClAndHc.jsx";
import { DetailsForm } from "../components/DetailsForm/DetailsForm.jsx";
import { ClubCards } from "../components/ClubCards/ClubCards.jsx";
import { EmergencyContacts } from "../components/EmergencyContacts/EmergencyContacts.jsx";

import dashboardStyles from "../styles/Dashboard.module.css";

/* Suspense 'isolates' the loading time of each component, If one component is slow, React will still 
render the components which have already loaded in the meantime; improved UX. */

const Dashboard = () => {
    const { user } = useAuthContext();
    const userId = user?.id;

    return ( 
        <div>
            <RecentScores userId={userId} />
            <CurrentClassificationsAndHandicaps userId={userId} />

            <div className={dashboardStyles.dashboardGrid}>
                <DetailsForm userId={userId} />
                <ClubCards userId={userId} />
            </div>

            <EmergencyContacts userId={userId}/>
        </div>
    );
}
 
export default Dashboard;
