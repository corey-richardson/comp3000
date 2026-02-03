import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar/Navbar";
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
