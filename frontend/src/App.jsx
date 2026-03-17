import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("player");
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handlePlayerSearch = async () => {
    try {
      setError("");
      setPlayerData(null);

      const response = await fetch(
        `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setPlayerData(data);
    } catch (err) {
      setError("Could not connect to backend");
    }
  };

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
                value={playerName}
                onChange={async (e) => {
                  const value = e.target.value;
                  setPlayerName(value);

                  if (value.length < 3) {
                    setSuggestions([]);
                    return;
                  }

                  try {
                    const response = await fetch(
                      `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
                    );

                    const data = await response.json();
                    setSuggestions(data);
                  } catch {
                    setSuggestions([]);
                  }
                }}
              />

              <button onClick={handlePlayerSearch}>Search</button>
            </div>

            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="suggestion-item"
                    onClick={() => {
                      setPlayerName(p.name);
                      setSuggestions([]);
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}

            <div className="player-results">
              {error && <p>{error}</p>}

              {!error && !playerData && <p>No player selected.</p>}

              {playerData && (
                <div>
                  <h2>{playerData.name}</h2>
                  <p>Points per game: {playerData.pts}</p>
                  <p>Assists per game: {playerData.ast}</p>
                  <p>Rebounds per game: {playerData.reb}</p>
                  <p>Steals per game: {playerData.stl}</p>
                  <p>Blocks per game: {playerData.blk}</p>
                  <p>3PT Made per game: {playerData.fg3m}</p>
                  <p>3PT Percentage: {playerData.fg3_pct}</p>
                </div>
              )}
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