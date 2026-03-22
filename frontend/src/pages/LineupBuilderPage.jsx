import { useState } from "react";
import PlayerMiniCard from "../components/PlayerMiniCard";

function LineupBuilderPage() {
  const [lineup, setLineup] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const allPlayers = [
  {
    id: 2544,
    name: "LeBron James",
    position: "F",
    pts: 25.3,
    ast: 8.3,
    reb: 7.1,
    stl: 1.2,
    blk: 0.6,
    fg3_pct: 0.387,
    fg3m: 2.1,
  },
  {
    id: 201939,
    name: "Stephen Curry",
    position: "G",
    pts: 26.4,
    ast: 5.1,
    reb: 4.5,
    stl: 0.7,
    blk: 0.4,
    fg3_pct: 0.408,
    fg3m: 4.8,
  },
  {
    id: 203999,
    name: "Nikola Jokic",
    position: "C",
    pts: 29.6,
    ast: 10.2,
    reb: 12.7,
    stl: 1.8,
    blk: 0.9,
    fg3_pct: 0.359,
    fg3m: 1.8,
  },
  {
    id: 1628369,
    name: "Jayson Tatum",
    position: "F",
    pts: 26.8,
    ast: 6.0,
    reb: 8.7,
    stl: 1.1,
    blk: 0.6,
    fg3_pct: 0.376,
    fg3m: 3.2,
  },
  {
    id: 1630162,
    name: "Anthony Edwards",
    position: "G",
    pts: 27.6,
    ast: 4.5,
    reb: 5.7,
    stl: 1.3,
    blk: 0.5,
    fg3_pct: 0.357,
    fg3m: 3.0,
  },
];

  const isLineupComplete = Object.values(lineup).every((player) => player !== null);

  const addToLineup = (player) => {
  const alreadyInLineup = Object.values(lineup).some(
    (p) => p && p.id === player.id
  );

  if (alreadyInLineup) return;

  let slot = null;

  if (player.position === "G") {
    if (!lineup.PG) slot = "PG";
    else if (!lineup.SG) slot = "SG";
  } else if (player.position === "F") {
    if (!lineup.SF) slot = "SF";
    else if (!lineup.PF) slot = "PF";
  } else if (player.position === "C") {
    if (!lineup.C) slot = "C";
  }

  if (!slot) return;

  setAnalysis(null);
  setError("");

  setLineup((prev) => ({
    ...prev,
    [slot]: player,
  }));
};

  const removeFromLineup = (slot) => {
  setAnalysis(null);
  setError("");

  setLineup((prev) => ({
    ...prev,
    [slot]: null,
  }));
};

  const analyzeLineup = async () => {
  try {
    setError("");
    setAnalysis(null);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analyze-lineup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineup }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || `Server error: ${response.status}`);
      return;
    }

    setAnalysis(data);
  } catch (err) {
    console.error(err);
    setError("Request failed before server response");
  }
};

  return (
    <section className="page-section">
      <h1>Lineup Builder</h1>
      <p>Click players to build your lineup.</p>

      <div className="lineup-page">
        <div className="player-browser">
          <h2>Players</h2>

          <div className="player-grid">
            {allPlayers.map((p) => (
              <PlayerMiniCard
                key={p.id}
                player={p}
                onClick={() => addToLineup(p)}
              />
            ))}
          </div>
        </div>

        <div className="lineup">
      <h2>Your Lineup</h2>

      {Object.entries(lineup).map(([slot, player]) => (
        <div key={slot} className="lineup-slot">
          <strong>{slot}</strong> {player ? `: ${player.name}` : ": Empty"}

          {player && (
            <button onClick={() => removeFromLineup(slot)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        className="reset-btn"
        onClick={() => {
          setLineup({
            PG: null,
            SG: null,
            SF: null,
            PF: null,
            C: null,
          });
          setAnalysis(null);
          setError("");
        }}
      >
        Reset Lineup
      </button>

      {isLineupComplete && (
        <button className="analyze-btn" onClick={analyzeLineup}>
          Analyze Lineup
        </button>
      )}

      {error && <p>{error}</p>}

      {isLineupComplete && analysis && (
        <div className="analysis-panel">
          <h3>Lineup Analysis</h3>

          <div className="analysis-cards">
            <div className="analysis-card">
              <span>Offense</span>
              <h2>{analysis.offense?.offense_score.toFixed(1)}</h2>
            </div>

            <div className="analysis-card">
              <span>Defense</span>
              <h2>{analysis.defense?.defense_score.toFixed(1)}</h2>
            </div>

            <div className="analysis-card highlight">
              <span>Overall</span>
              <h2>{analysis.overall?.overall_score.toFixed(1)}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
    </section>
  );
}

export default LineupBuilderPage;