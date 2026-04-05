
import { useEffect, useState } from "react";

import ClubCards from "../components/ClubCards/ClubCards.jsx";
import CurrentClassificationsAndHandicaps from "../components/CurrentClAndHc/CurrentClAndHc.jsx";
import DetailsForm from "../components/DetailsForm/DetailsForm.jsx";
import EmergencyContacts from "../components/EmergencyContacts/EmergencyContacts.jsx";
import RecentScores from "../components/RecentScores/RecentScores.jsx";
import { useApi } from "../hooks/useApi";
import { useAuthContext } from "../hooks/useAuthContext";
import dashboardStyles from "../styles/Dashboard.module.css";

const Dashboard = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const userId = user?.id;

    const [ scores, setScores ] = useState([]);
    const [ summary, setSummary ] = useState(null);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchLatestScoresAndRecordsSummary = async () => {
            if (!authIsReady || !user?.id) return;

            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall(`/api/scores/user/${user.id}?limit=3`);
                if (!response) return; // 401

                const data = await response.json();
                if (response.ok) {
                    setScores(data.scores);
                    setSummary(data.summary);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestScoresAndRecordsSummary();
    }, [user.id, user.token, makeApiCall, authIsReady]);

    return (
        <div>

            <div className={dashboardStyles.dashboardGrid}>
                <RecentScores
                    scores={scores}
                    isLoading={isLoading}
                    error={error}
                />

                <ClubCards userId={userId} />

                <CurrentClassificationsAndHandicaps
                    summary={summary}
                    isLoading={isLoading}
                    error={error}
                />

                <div className={dashboardStyles.dashboardContainer}>
                    <DetailsForm userId={userId} />
                </div>

                <div className={dashboardStyles.dashboardContainer}>
                    <EmergencyContacts userId={userId}/>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
