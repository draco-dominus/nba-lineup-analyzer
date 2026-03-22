import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import PlayerSearchPage from "./pages/PlayerSearchPage";
import ComparePlayersPage from "./pages/ComparePlayersPage";
import LineupBuilderPage from "./pages/LineupBuilderPage";
import CompareLineupsPage from "./pages/CompareLineupsPage";
import RosterBuilderPage from "./pages/RosterBuilderPage";
import MinutesSimulationPage from "./pages/MinutesSimulationPage";

function App() {
  const [backendReady, setBackendReady] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);

  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);

        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        setBackendReady(true);
      } catch (err) {
        console.error("Backend wake-up failed:", err);
      } finally {
        setBackendLoading(false);
      }
    };

    wakeBackend();
  }, []);

  if (backendLoading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-content">
          <h1>Loading NBA Lineup Analyzer...</h1>
          <p>Waking up the backend. First load may take a few seconds.</p>
        </div>
      </div>
    );
  }

  if (!backendReady) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-content">
          <h1>Backend unavailable</h1>
          <p>Please refresh in a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players/search" element={<PlayerSearchPage />} />
            <Route path="/players/compare" element={<ComparePlayersPage />} />
            <Route path="/lineup-builder" element={<LineupBuilderPage />} />
            <Route path="/lineups/compare" element={<CompareLineupsPage />} />
            <Route path="/roster/build" element={<RosterBuilderPage />} />
            <Route path="/roster/simulate" element={<MinutesSimulationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;