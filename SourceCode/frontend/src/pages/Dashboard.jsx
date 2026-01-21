import { Suspense } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import { RecentScores, RecentScoresSkeleton } from "../components/RecentScores/RecentScores.jsx";
import { CurrentClassificationsAndHandicaps, CurrentClassificationsAndHandicapsSkeleton } from "../components/CurrentClAndHc/CurrentClAndHc.jsx";
import { DetailsForm, DetailsFormSkeleton } from "../components/DetailsForm/DetailsForm.jsx";
import { ClubCards, ClubCardsSkeleton } from "../components/ClubCards/ClubCards.jsx";
import { EmergencyContacts, EmergencyContactsSkeleton } from "../components/EmergencyContacts/EmergencyContacts.jsx";

import dashboardStyles from "../styles/Dashboard.module.css";

/* Suspense 'isolates' the loading time of each component, If one component is slow, React will still 
render the components which have already loaded in the meantime; improved UX. */

const Dashboard = () => {
    const { user } = useAuthContext();
    const userId = user?.id;

    return ( 
        <div>
            <Suspense fallback={<RecentScoresSkeleton />}>
                <RecentScores userId={userId} />
            </Suspense>

            <Suspense fallback={<CurrentClassificationsAndHandicapsSkeleton />}>
                <CurrentClassificationsAndHandicaps userId={userId} />
            </Suspense>

            <div className={dashboardStyles.dashboardGrid}>
                <Suspense fallback={<DetailsFormSkeleton />}>
                    <DetailsForm userId={userId} />
                </Suspense>
                
                <Suspense fallback={<ClubCardsSkeleton />}>
                    <ClubCards userId={userId} />
                </Suspense>
            </div>

            <Suspense fallback={<EmergencyContactsSkeleton />}>
                <EmergencyContacts userId={userId}/>
            </Suspense>
        </div>
    );
}
 
export default Dashboard;
