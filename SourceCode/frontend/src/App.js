import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import CreateClub from "./pages/CreateClub";
import Dashboard from "./pages/Dashboard";
import EditScore from "./pages/EditScore";
import LandingPage from "./pages/LandingPage";
import MyScores from "./pages/MyScores";
import SubmitScore from "./pages/SubmitScore";

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
                                path="/clubs/create"
                                element={user ? <CreateClub /> : <Navigate to="/" />}
                            />
                        </Routes>
                    )}

                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
