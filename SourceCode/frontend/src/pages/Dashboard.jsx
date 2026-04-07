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

    const [ scores, setScores ] = useState([]);
    const [ scoresTotalCount, setScoresTotalCount ] = useState(0);
    const [ summary, setSummary ] = useState(null);
    const [ isScoresLoading, setIsScoresLoading ] = useState(true);

    const [ memberships, setMemberships ] = useState([]);
    const [ membershipTotalCount, setMembershipTotalCount ] = useState(0);
    const [ isMembershipsLoading, setIsMembershipsLoading ] = useState(true);

    const [ invites, setInvites ] = useState([]);
    const [ invitesTotalCount, setInvitesTotalCount ] = useState(0);
    const [ isInvitesLoading, setIsInvitesLoading ] = useState(true);

    const [ profile, setProfile ] = useState(null);
    const [ isProfileLoading, setIsProfileLoading ] = useState(true);

    const [ contacts, setContacts ] = useState([]);
    const [ isContactsLoading, setIsContactsLoading ] = useState(true);

    const [ errors, setErrors ] = useState({
        scores: null,
        memberships: null,
        invites: null,
        profile: null,
        contacts: null
    });

    const keyBasedErrorSetter = (key) => (error) => {
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleAddMembership = (newMembership) => {
        setMemberships(prev => [ newMembership, ...prev ]);
        setMembershipTotalCount(prev => prev + 1);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!authIsReady || !user?.id) return;

            setIsScoresLoading(true);
            setIsMembershipsLoading(true);
            setIsInvitesLoading(true);
            setIsProfileLoading(true);
            setIsContactsLoading(true);

            setErrors({});

            const handleResponse = async (response, onSuccess, errorKey, setIsLoading) => {
                try {
                    if (!response) return;
                    const data = await response.json();

                    if (response.ok) {
                        onSuccess(data);
                    } else {
                        setErrors(prev => ({ ...prev, [errorKey]: data.error }));
                    }

                    setIsLoading(false);
                } catch (error) {
                    setErrors(prev => ({ ...prev, [errorKey]: "Error processing response." }));
                } finally {
                    setIsLoading(false);
                }
            };

            try {
                const [
                    scoreResponse,
                    membershipResponse,
                    invitesResponse,
                    profileResponse,
                    contactResponse
                ] = await Promise.all([
                    makeApiCall(`/api/scores/user/${user?.id}?limit=3`),
                    makeApiCall("/api/clubs/my-clubs?limit=3"),
                    makeApiCall("/api/invites/my-invites?limit=3"),
                    makeApiCall(`/api/profiles/${user?.id}`),
                    makeApiCall(`/api/contacts/user/${user?.id}`)
                ]);

                handleResponse(scoreResponse, (data) => {
                    setScores(data.scores);
                    setScoresTotalCount(data.pagination.totalCount);
                    setSummary(data.summary);
                }, "scores", setIsScoresLoading);

                handleResponse(membershipResponse, (data) => {
                    setMemberships(data.memberships);
                    setMembershipTotalCount(data.totalCount);
                }, "memberships", setIsMembershipsLoading);

                handleResponse(invitesResponse, (data) => {
                    setInvites(data.invites);
                    setInvitesTotalCount(data.pagination.totalCount);
                }, "invites", setIsInvitesLoading);

                handleResponse(profileResponse, (data) => {
                    setProfile(data);
                }, "profile", setIsProfileLoading);

                handleResponse(contactResponse, (data) => {
                    setContacts(data.contacts);
                }, "contacts", setIsContactsLoading);

            } catch (error) {
                setErrors(prev => ({ ...prev, global: "Connection error. Please refresh." }));
            } finally {
                setIsScoresLoading(false);
                setIsMembershipsLoading(false);
                setIsProfileLoading(false);
                setIsContactsLoading(false);
            }
        };

        fetchDashboardData();
    }, [ user.id, authIsReady, makeApiCall ]);

    return (
        <div>

            <div className={dashboardStyles.dashboardGrid}>
                <RecentScores
                    scores={scores}
                    totalCount={scoresTotalCount}
                    isLoading={isScoresLoading}
                    error={errors.scores}
                />

                <ClubCards
                    clubs={memberships}
                    totalCount={membershipTotalCount}
                    isLoading={isMembershipsLoading}
                    error={errors.memberships}
                />

                {invites.length > 0 && (
                    <div className={dashboardStyles.dashboardContainer}>
                        <h2>My Invites.</h2>

                        <UserInviteList
                            invites={invites}
                            setInvites={setInvites}
                            totalCount={invitesTotalCount}
                            setTotalCount={setInvitesTotalCount}
                            onAccept={handleAddMembership}
                            isLoading={isInvitesLoading}
                            error={errors.invites}
                            setError={keyBasedErrorSetter("invites")}
                        />
                    </div>
                )}

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
