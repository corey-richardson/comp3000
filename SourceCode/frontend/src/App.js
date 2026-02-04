import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import SubmitScore from "./pages/SubmitScore";
import MyScores from "./pages/MyScores";

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
                                path="/my-scores"
                                element={user ? <MyScores /> : <Navigate to="/" />}
                            />

                            <Route
                                path="/submit-score"
                                element={user ? <SubmitScore /> : <Navigate to="/" />}
                            />
                        </Routes>
                    )}

                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
