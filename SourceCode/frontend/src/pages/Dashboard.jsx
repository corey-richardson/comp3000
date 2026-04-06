import { useEffect, useState } from "react";

import ClubCards from "../components/ClubCards/ClubCards.jsx";
import CurrentClassificationsAndHandicaps from "../components/CurrentClAndHc/CurrentClAndHc.jsx";
import DetailsForm from "../components/DetailsForm/DetailsForm.jsx";
import EmergencyContacts from "../components/EmergencyContacts/EmergencyContacts.jsx";
import UserInviteList from "../components/InviteManagement/UserInviteList";
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
    const [ isScoresLoading, setIsScoresLoading ] = useState(true);

    const [ memberships, setMemberships ] = useState([]);
    const [ membershipTotalCount, setMembershipTotalCount ] = useState(0);
    const [ invites, setInvites ] = useState([]);
    const [ isMembershipsLoading, setIsMembershipsLoading ] = useState(true);

    const [ profile, setProfile ] = useState(null);
    const [ isProfileLoading, setIsProfileLoading ] = useState(true);

    const [ contacts, setContacts ] = useState([]);
    const [ isContactsLoading, setIsContactsLoading ] = useState(true);

    const [ errors, setErrors ] = useState({
        scores: null,
        memberships: null,
        profile: null,
        contacts: null
    });

    const keyBasedErrorSetter = (key) => (error) => {
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!authIsReady || !user?.id) return;

            setIsScoresLoading(true);
            setIsMembershipsLoading(true);
            setIsProfileLoading(true);
            setIsContactsLoading(true);

            setErrors({});

            try {
                const [
                    scoreResponse,
                    membershipResponse,
                    profileResponse,
                    contactResponse
                ] = await Promise.all([
                    makeApiCall(`/api/scores/user/${userId}?limit=3`),
                    makeApiCall("/api/clubs/my-clubs?limit=3"),
                    makeApiCall(`/api/profiles/${userId}`),
                    makeApiCall(`/api/contacts/user/${user.id}`)
                ]);

                if (scoreResponse && scoreResponse.ok) {
                    const scoreData = await scoreResponse.json();
                    setScores(scoreData.scores);
                    setSummary(scoreData.summary);
                    setIsScoresLoading(false);
                } else if (scoreResponse && !scoreResponse.ok) {
                    const scoreData = await scoreResponse.json();
                    setErrors(prev => ({ ...prev, scores: scoreData.error }));
                }

                if (membershipResponse && membershipResponse.ok) {
                    const membershipData = await membershipResponse.json();
                    setMemberships(membershipData.memberships);
                    setMembershipTotalCount(membershipData.totalCount);
                    setInvites(membershipData.invites);
                    setIsMembershipsLoading(false);
                } else if (membershipResponse && !membershipResponse.ok) {
                    const membershipData = await membershipResponse.json();
                    setErrors(prev => ({ ...prev, memberships: membershipData.error }));
                }

                if (profileResponse && profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    setProfile(profileData);
                    setIsProfileLoading(false);
                }

                if (contactResponse && contactResponse.ok) {
                    const contactData = await contactResponse.json();
                    setContacts(contactData.contacts);
                    setIsContactsLoading(false);
                }

            } catch (error) {
                setErrors(prev => ({ ...prev, global: "Connection error. Please refresh." }));
            }
        };

        fetchDashboardData();
    }, [ user.id, authIsReady, makeApiCall ]);

    return (
        <div>

            <div className={dashboardStyles.dashboardGrid}>
                <RecentScores
                    scores={scores}
                    isLoading={isScoresLoading}
                    error={errors.scores}
                />

                <ClubCards
                    clubs={memberships}
                    totalCount={membershipTotalCount}
                    isLoading={isMembershipsLoading}
                    error={errors.memberships}
                />

                <div className={dashboardStyles.dashboardContainer}>
                    <h2>My Invites.</h2>

                    <UserInviteList
                        invites={invites}
                        isLoading={isScoresLoading}
                        error={errors.memberships}
                    />
                </div>

                <CurrentClassificationsAndHandicaps
                    summary={summary}
                    isLoading={isScoresLoading}
                    error={errors.scores}
                />

                <div className={dashboardStyles.dashboardContainer}>
                    <DetailsForm
                        profile={profile}
                        setProfile={setProfile}
                        isLoading={isProfileLoading}
                        setIsLoading={setIsProfileLoading}
                        error={errors.profile}
                        setError={keyBasedErrorSetter("profile")}
                    />
                </div>

                <div className={dashboardStyles.dashboardContainer}>
                    <EmergencyContacts
                        contacts={contacts}
                        setContacts={setContacts}
                        isLoading={isContactsLoading}
                        setIsLoading={setIsContactsLoading}
                        error={errors.contacts}
                        setError={keyBasedErrorSetter("contacts")}
                    />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
