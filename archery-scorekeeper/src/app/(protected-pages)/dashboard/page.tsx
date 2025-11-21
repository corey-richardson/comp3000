import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ClubCardsSkeleton, ClubCards } from "@/app/components/ClubCards/ClubCards";
import { CurrentClassificationsAndHandicapsSkeleton, CurrentClassificationsAndHandicaps } from "@/app/components/CurrentClAndHc/CurrentClAndHc";
import { DetailsFormSkeleton, DetailsForm } from "@/app/components/DetailsForm/DetailsForm";
import { EmergencyContactsSkeleton, EmergencyContacts } from "@/app/components/EmergencyContacts/EmergencyContacts";
import { RecentScoresSkeleton, RecentScores } from "@/app/components/RecentScores/RecentScores";
import { createServerSupabase } from "@/app/utils/supabase/server";

import dashboardStyles from "./Dashboard.module.css";

export const metadata: Metadata = {
    title: "Dashboard",
};

/* Suspense 'isolates' the loading time of each component, If one component is slow, React will still 
render the components which have already loaded in the meantime; improved UX. */

const Dashboard = async () => {
    const supabase = await createServerSupabase();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) {
        // Handle by middleware but type-guard placed here to satisfy TypeScript 
        redirect("/");
    }

    const userId = supabaseUser?.id;

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
