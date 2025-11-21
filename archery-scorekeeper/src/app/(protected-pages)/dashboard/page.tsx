import { Metadata } from "next";
import { Suspense } from "react";

import { RecentScoresSkeleton, RecentScores } from "@/app/components/RecentScores/RecentScores";
import { CurrentClassificationsAndHandicapsSkeleton, CurrentClassificationsAndHandicaps } from "@/app/components/CurrentClAndHc/CurrentClAndHc";
import { DetailsFormSkeleton, DetailsForm } from "@/app/components/DetailsForm/DetailsForm";
import { ClubCardsSkeleton, ClubCards } from "@/app/components/ClubCards/ClubCards";
import { EmergencyContactsSkeleton, EmergencyContacts } from "@/app/components/EmergencyContacts/EmergencyContacts";

import { createServerSupabase } from "@/app/utils/supabase/server";

import dashboardStyles from "./Dashboard.module.css";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Dashboard",
};

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
