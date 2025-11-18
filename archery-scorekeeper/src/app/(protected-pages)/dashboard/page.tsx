import { Metadata } from "next";

import RecentScores from "@/app/components/RecentScores/RecentScores";
import CurrentClassificationsAndHandicaps from "@/app/components/CurrentClAndHc/CurrentClAndHc";
import DetailsForm from "@/app/components/DetailsForm/DetailsForm";
import ClubCards from "@/app/components/ClubCards/ClubCards";
import EmergencyContacts from "@/app/components/EmergencyContacts/EmergencyContacts";

import { createServerSupabase } from "@/app/utils/supabase/server";

import dashboardStyles from "./Dashboard.module.css";

export const metadata: Metadata = {
    title: "Dashboard",
};

const Dashboard = async () => {
    const supabase = await createServerSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    return ( 
        <div>
            <h1>{ session?.user.email }</h1>

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
