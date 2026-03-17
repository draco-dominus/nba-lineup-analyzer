import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("player");

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">NBA Lineup Analyzer</div>

        <div className="nav-links">
          <button
            className={activePage === "player" ? "active" : ""}
            onClick={() => setActivePage("player")}
          >
            Player Lookup
          </button>

          <button
            className={activePage === "lineup" ? "active" : ""}
            onClick={() => setActivePage("lineup")}
          >
            Lineup Builder
          </button>

          <button
            className={activePage === "compare" ? "active" : ""}
            onClick={() => setActivePage("compare")}
          >
            Compare Lineups
          </button>
        </div>
      </nav>

      <main className="page-content">
        {activePage === "player" && (
          <section className="page-section">
            <h1>Player Lookup</h1>
            <p>Search for a player and view current season stats.</p>

            <div className="player-search">
              <input
                type="text"
                placeholder="Enter player name..."
              />

              <button>Search</button>
            </div>

            <div className="player-results">
              <p>No player selected.</p>
            </div>
          </section>
        )}

        {activePage === "lineup" && (
          <section className="page-section">
            <h1>Lineup Builder</h1>
            <p>Build a lineup and analyze offense, defense, and overall score.</p>
          </section>
        )}

        {activePage === "compare" && (
          <section className="page-section">
            <h1>Compare Lineups</h1>
            <p>Compare two lineups and identify key advantages.</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;