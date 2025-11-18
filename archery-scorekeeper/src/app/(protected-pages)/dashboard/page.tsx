import { Metadata } from "next";

import RecentScores from "@/app/components/RecentScores/RecentScores";
import CurrentClassificationsAndHandicaps from "@/app/components/CurrentClAndHc/CurrentClAndHc";
import DetailsForm from "@/app/components/DetailsForm/DetailsForm";
import ClubCards from "@/app/components/ClubCards/ClubCards";
import EmergencyContacts from "@/app/components/EmergencyContacts/EmergencyContacts";

import dashboardStyles from "./Dashboard.module.css";

export const metadata: Metadata = {
    title: "Dashboard",
};

const Dashboard = () => {
    return ( 
        <div>
            <RecentScores />
            <CurrentClassificationsAndHandicaps />

            <div className={dashboardStyles.dashboardGrid}>
                <DetailsForm />
                <ClubCards />
            </div>

            <EmergencyContacts />
        </div>
     );
}
 
export default Dashboard;