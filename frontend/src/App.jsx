import { useState } from "react";
import "./App.css";
import NBACard from "./NBACard";

function App() {
  const [activePage, setActivePage] = useState("player");
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [lineupAnalysis, setLineupAnalysis] = useState(null);
  const [lineupError, setLineupError] = useState("");

  const [lineup, setLineup] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  const [activeSlot, setActiveSlot] = useState("PG");
  const [lineupSearch, setLineupSearch] = useState("");
  const [lineupSuggestions, setLineupSuggestions] = useState([]);

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
      setSuggestions([]);
    } catch {
      setError("Could not connect to backend");
    }
  };

  const handlePlayerInputChange = async (e) => {
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
  };

  const handleAnalyzeLineup = async () => {
  try {
    setLineupError("");
    setLineupAnalysis(null);

    const hasEmptySlot = Object.values(lineup).some((player) => player === null);

    if (hasEmptySlot) {
      setLineupError("Please fill all five positions before analyzing.");
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/analyze-lineup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lineup }),
    });

    const data = await response.json();

    if (!response.ok) {
      setLineupError(data.error || "Something went wrong");
      return;
    }

    setLineupAnalysis(data);
  } catch {
    setLineupError("Could not connect to backend");
  }
};

  const handleLineupInputChange = async (e) => {
    const value = e.target.value;
    setLineupSearch(value);

    if (value.length < 3) {
      setLineupSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
      );

      const data = await response.json();
      setLineupSuggestions(data);
    } catch {
      setLineupSuggestions([]);
    }
  };

  const handleSelectLineupPlayer = async (playerName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setLineup((prev) => ({
        ...prev,
        [activeSlot]: data,
      }));

      setLineupSearch("");
      setLineupSuggestions([]);
    } catch {
      console.log("Could not load player");
    }
  };

  const clearSlot = (slot) => {
    setLineup((prev) => ({
      ...prev,
      [slot]: null,
    }));
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
                onChange={handlePlayerInputChange}
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
              {playerData && <NBACard player={playerData} />}
            </div>
          </section>
        )}

        {activePage === "lineup" && (
          <section className="page-section">
            <h1>Lineup Builder</h1>
            <p>Click a position, search for a player, and build your lineup.</p>

            <div className="lineup-builder-layout">
              <div className="lineup-slots">
                {Object.entries(lineup).map(([position, player]) => (
                  <div
                    key={position}
                    className={`lineup-slot ${activeSlot === position ? "slot-active" : ""}`}
                    onClick={() => setActiveSlot(position)}
                  >
                    <div className="lineup-slot-top">
                      <span className="slot-position">{position}</span>
                      {player && (
                        <button
                          className="slot-clear"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSlot(position);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="slot-player">
                      {player ? player.name : "Empty"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="lineup-search-panel">
                <h2>Selected Position: {activeSlot}</h2>

                <div className="player-search">
                  <input
                    type="text"
                    placeholder={`Search player for ${activeSlot}...`}
                    value={lineupSearch}
                    onChange={handleLineupInputChange}
                  />
                </div>

                {lineupSuggestions.length > 0 && (
                  <div className="suggestions">
                    {lineupSuggestions.map((p) => (
                      <div
                        key={p.id}
                        className="suggestion-item"
                        onClick={() => handleSelectLineupPlayer(p.name)}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}

                <button className="analyze-button" onClick={handleAnalyzeLineup}>
                  Analyze Lineup
                </button>

                {lineupError && <p>{lineupError}</p>}

                {lineupAnalysis && (
                  <div className="lineup-analysis-results">
                    <h2>Lineup Analysis</h2>

                    <div className="analysis-grid">
                      <div className="analysis-box">
                        <span className="analysis-label">Offense</span>
                        <span className="analysis-value">
                          {lineupAnalysis.offense.offense_score}
                        </span>
                      </div>

                      <div className="analysis-box">
                        <span className="analysis-label">Defense</span>
                        <span className="analysis-value">
                          {lineupAnalysis.defense.defense_score}
                        </span>
                      </div>

                      <div className="analysis-box">
                        <span className="analysis-label">Overall</span>
                        <span className="analysis-value">
                          {lineupAnalysis.overall.overall_score}
                        </span>
                      </div>
                    </div>

                    <div className="lineup-insights">
                      <h3>Identity</h3>
                      <p>{lineupAnalysis.insights.identity}</p>

                      <h3>Strengths</h3>
                      {lineupAnalysis.insights.strengths.length > 0 ? (
                        <ul>
                          {lineupAnalysis.insights.strengths.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No major strengths detected.</p>
                      )}

                      <h3>Weaknesses</h3>
                      {lineupAnalysis.insights.weaknesses.length > 0 ? (
                        <ul>
                          {lineupAnalysis.insights.weaknesses.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No major weaknesses detected.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="lineup-preview">
                  {lineup[activeSlot] ? (
                    <NBACard player={lineup[activeSlot]} />
                  ) : (
                    <p>No player selected for {activeSlot}.</p>
                  )}
                </div>
              </div>
            </div>
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