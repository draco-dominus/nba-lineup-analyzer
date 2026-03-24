import { useState } from "react";
import NBACard from "../NBACard";

function ComparePlayersPage() {
  const [playerAName, setPlayerAName] = useState("");
  const [playerBName, setPlayerBName] = useState("");
  const [playerAData, setPlayerAData] = useState(null);
  const [playerBData, setPlayerBData] = useState(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");
  const [suggestionsA, setSuggestionsA] = useState([]);
  const [suggestionsB, setSuggestionsB] = useState([]);

  const fetchPlayer = async (name, side) => {
    try {
      if (side === "A") {
        setErrorA("");
        setPlayerAData(null);
      } else {
        setErrorB("");
        setPlayerBData(null);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/player?name=${encodeURIComponent(name)}`
      );

      const data = await response.json();

      if (!response.ok) {
        if (side === "A") {
          setErrorA(data.error || "Something went wrong");
        } else {
          setErrorB(data.error || "Something went wrong");
        }
        return;
      }

      if (side === "A") {
        setPlayerAData(data);
        setSuggestionsA([]);
      } else {
        setPlayerBData(data);
        setSuggestionsB([]);
      }
    } catch {
      if (side === "A") {
        setErrorA("Could not connect to backend");
      } else {
        setErrorB("Could not connect to backend");
      }
    }
  };

  const handleInputChange = async (e, side) => {
    const value = e.target.value;

    if (side === "A") {
      setPlayerAName(value);
      setPlayerAData(null);
      setErrorA("");
    } else {
      setPlayerBName(value);
      setPlayerBData(null);
      setErrorB("");
    }

    if (value.length < 3) {
      if (side === "A") {
        setSuggestionsA([]);
      } else {
        setSuggestionsB([]);
      }
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/players?search=${encodeURIComponent(value)}`
      );

      const data = await response.json();

      if (side === "A") {
        setSuggestionsA(data);
      } else {
        setSuggestionsB(data);
      }
    } catch {
      if (side === "A") {
        setSuggestionsA([]);
      } else {
        setSuggestionsB([]);
      }
    }
  };

  const renderComparisonRow = (label, valueA, valueB) => {
    const aWins = valueA > valueB;
    const bWins = valueB > valueA;

    return (
      <div className="compare-stat-row" key={label}>
        <div className={`compare-stat-value ${aWins ? "stat-winner" : ""}`}>
          {valueA ?? "—"}
        </div>
        <div className="compare-stat-label">{label}</div>
        <div className={`compare-stat-value ${bWins ? "stat-winner" : ""}`}>
          {valueB ?? "—"}
        </div>
      </div>
    );
  };

  return (
    <section className="page-section">
      <h1>Compare Players</h1>
      <p>Compare two players side by side.</p>

      <div className="compare-layout-two-column">
        <div className="compare-column">
          <h2>Player A</h2>

          <div className="player-search">
            <input
              type="text"
              placeholder="Search Player A..."
              value={playerAName}
              onChange={(e) => handleInputChange(e, "A")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerAName.trim()) {
                  fetchPlayer(playerAName, "A");
                }
              }}
            />
            <button onClick={() => fetchPlayer(playerAName, "A")}>
              Search
            </button>
          </div>

          {suggestionsA.length > 0 && (
            <div className="suggestions">
              {suggestionsA.map((p) => (
                <div
                  key={p.id}
                  className="suggestion-item"
                  onClick={() => {
                    setPlayerAName(p.name);
                    fetchPlayer(p.name, "A");
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}

          {errorA && <p className="lineup-error">{errorA}</p>}
          {playerAData && <NBACard player={playerAData} />}
        </div>

        <div className="compare-column">
          <h2>Player B</h2>

          <div className="player-search">
            <input
              type="text"
              placeholder="Search Player B..."
              value={playerBName}
              onChange={(e) => handleInputChange(e, "B")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && playerBName.trim()) {
                  fetchPlayer(playerBName, "B");
                }
              }}
            />
            <button onClick={() => fetchPlayer(playerBName, "B")}>
              Search
            </button>
          </div>

          {suggestionsB.length > 0 && (
            <div className="suggestions">
              {suggestionsB.map((p) => (
                <div
                  key={p.id}
                  className="suggestion-item"
                  onClick={() => {
                    setPlayerBName(p.name);
                    fetchPlayer(p.name, "B");
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}

          {errorB && <p className="lineup-error">{errorB}</p>}
          {playerBData && <NBACard player={playerBData} />}
        </div>
      </div>

      {playerAData && playerBData && (
        <div className="compare-summary-panel">
          <h2>Stat Comparison</h2>

          <div className="compare-stat-table">
            {renderComparisonRow("PTS", playerAData.pts, playerBData.pts)}
            {renderComparisonRow("AST", playerAData.ast, playerBData.ast)}
            {renderComparisonRow("REB", playerAData.reb, playerBData.reb)}
            {renderComparisonRow("STL", playerAData.stl, playerBData.stl)}
            {renderComparisonRow("BLK", playerAData.blk, playerBData.blk)}
            {renderComparisonRow(
              "3PT%",
              playerAData.fg3_pct ? (playerAData.fg3_pct * 100).toFixed(1) : "—",
              playerBData.fg3_pct ? (playerBData.fg3_pct * 100).toFixed(1) : "—"
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ComparePlayersPage;