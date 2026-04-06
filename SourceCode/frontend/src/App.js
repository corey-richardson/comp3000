import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import Clubs from "./pages/Clubs/Clubs";
import CreateClub from "./pages/Clubs/CreateClub";
import InviteManagement from "./pages/Clubs/InviteManagement";
import ManageClub from "./pages/Clubs/ManageClub";
import RecordsManagement from "./pages/Clubs/RecordManagement";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import MemberEdit from "./pages/Members/Edit";
import MemberEmergencyContacts from "./pages/Members/EmergencyContacts";
import MemberInvites from "./pages/Members/Invites";
import MemberScores from "./pages/Members/Scores";
import EditScore from "./pages/Scores/EditScore";
import MyScores from "./pages/Scores/MyScores";
import SubmitScore from "./pages/Scores/SubmitScore";

function App() {
    const { user, authIsReady } = useAuthContext();

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <div className="pages">

                    { authIsReady && (
                        <Routes>
                            <Route
                                path="/"
                                element={!user ? <LandingPage /> : <Navigate to="/dashboard" />}
                            />

                            <Route
                                path="/dashboard"
                                element={user ? <Dashboard /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/scores"
                                element={user ? <MyScores /> : <Navigate to="/" />}
                            />

                            <Route path="/scores/edit" element={<Navigate to="/scores" replace />} />
                            <Route
                                path="/scores/edit/:id"
                                element={user ? <EditScore /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/scores/submit"
                                element={user ? <SubmitScore /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs"
                                element={user ? <Clubs /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/create"
                                element={user ? <CreateClub /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/invites"
                                element={user ? <MemberInvites /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/members/emergency-contacts/:userId"
                                element={user ? <MemberEmergencyContacts /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/members/edit/:userId"
                                element={user ? <MemberEdit /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/members/:userId"
                                element={user ? <MemberScores /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/:id/records"
                                element={user ? <RecordsManagement /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/:id/invites"
                                element={user ? <InviteManagement /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/clubs/:id"
                                element={user ? <ManageClub /> : <Navigate to="/" />}
                            />
                        </Routes>
                    )}

                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
