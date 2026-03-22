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

    setLineup((prev) => ({
      ...prev,
      [slot]: player,
    }));
  };

  const removeFromLineup = (slot) => {
    setLineup((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  const analyzeLineup = async () => {
    try {
      setError("");
      setAnalysis(null);

      const lineupArray = Object.values(lineup);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze-lineup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineup: lineupArray }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setAnalysis(data);
    } catch {
      setError("Could not connect to backend");
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
              <strong>{slot}</strong>: {player ? player.name : "Empty"}

              {player && (
                <button onClick={() => removeFromLineup(slot)}>
                  Remove
                </button>
              )}
            </div>
          ))}

          {isLineupComplete && (
            <button onClick={analyzeLineup}>
              Analyze Lineup
            </button>
          )}

          {error && <p>{error}</p>}

          {analysis && (
            <div>
              <h3>Analysis</h3>
              <p>Offense: {analysis.offense?.offense_score}</p>
              <p>Defense: {analysis.defense?.defense_score}</p>
              <p>Overall: {analysis.overall?.overall_score}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LineupBuilderPage;