import { useState } from "react";

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

function CompareLineupsPage() {
  const [compareLineupA, setCompareLineupA] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  const [compareLineupB, setCompareLineupB] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  const [compareInputs, setCompareInputs] = useState({
    A: { PG: "", SG: "", SF: "", PF: "", C: "" },
    B: { PG: "", SG: "", SF: "", PF: "", C: "" },
  });

  const [activeField, setActiveField] = useState(null);
  const [compareSuggestions, setCompareSuggestions] = useState([]);

  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareError, setCompareError] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  const isCompareReady =
    Object.values(compareLineupA).every((player) => player !== null) &&
    Object.values(compareLineupB).every((player) => player !== null);

  const handleCompareInputChange = async (side, position, value) => {
    setCompareInputs((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [position]: value,
      },
    }));

    setActiveField(`${side}-${position}`);

    if (value.length < 3) {
      setCompareSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/players?search=${encodeURIComponent(value)}`
      );

      const data = await response.json();
      setCompareSuggestions(data);
    } catch {
      setCompareSuggestions([]);
    }
  };

  const handleSelectComparePlayer = async (side, position, playerName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/player?name=${encodeURIComponent(playerName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      if (side === "A") {
        setCompareLineupA((prev) => ({
          ...prev,
          [position]: data,
        }));
      } else {
        setCompareLineupB((prev) => ({
          ...prev,
          [position]: data,
        }));
      }

      setCompareInputs((prev) => ({
        ...prev,
        [side]: {
          ...prev[side],
          [position]: playerName,
        },
      }));

      setCompareSuggestions([]);
      setActiveField(null);
    } catch {
      console.log("Could not load compare player");
    }
  };

  const clearCompareSlot = (side, position) => {
    if (side === "A") {
      setCompareLineupA((prev) => ({
        ...prev,
        [position]: null,
      }));
    } else {
      setCompareLineupB((prev) => ({
        ...prev,
        [position]: null,
      }));
    }

    setCompareInputs((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [position]: "",
      },
    }));

    setCompareSuggestions([]);
    setActiveField(null);
  };

  const renderLineupColumn = (side, lineup) => {
    return (
      <div className="compare-column">
        <h2>{side === "A" ? "Lineup A" : "Lineup B"}</h2>

        <div className="compare-slot-list">
          {POSITIONS.map((position) => {
            const player = lineup[position];
            const fieldKey = `${side}-${position}`;
            const isActive = activeField === fieldKey;

            return (
              <div key={fieldKey} className="compare-slot-card">
                <div className="compare-slot-header">
                  <span className="slot-position">{position}</span>

                  {player && (
                    <button
                      className="slot-clear"
                      onClick={() => clearCompareSlot(side, position)}
                    >
                      ×
                    </button>
                  )}
                </div>

                <input
                  className="compare-slot-input"
                  type="text"
                  placeholder={`Search ${position}...`}
                  value={compareInputs[side][position]}
                  onChange={(e) =>
                    handleCompareInputChange(side, position, e.target.value)
                  }
                  onFocus={() => setActiveField(fieldKey)}
                />

                <div className="compare-slot-player-name">
                  {player ? player.name : "Empty"}
                </div>

                {isActive && compareSuggestions.length > 0 && (
                  <div className="suggestions compare-suggestions">
                    {compareSuggestions.map((p) => (
                      <div
                        key={p.id}
                        className="suggestion-item"
                        onClick={() =>
                          handleSelectComparePlayer(side, position, p.name)
                        }
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCompareLineups = async () => {
  try {
    setCompareError("");
    setComparisonResult(null);
    setIsComparing(true);

    const response = await fetch("http://127.0.0.1:5000/compare-lineups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lineup_a: compareLineupA,
        lineup_b: compareLineupB,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setCompareError(data.error || "Something went wrong");
      return;
    }

    setComparisonResult(data);
  } catch {
    setCompareError("Could not connect to backend");
  } finally {
    setIsComparing(false);
  }
};

  return (
    <section className="page-section">
      <h1>Compare Lineups</h1>
      <p>Build two lineups side by side and compare them.</p>

      <div className="compare-layout-two-column">
        {renderLineupColumn("A", compareLineupA)}
        {renderLineupColumn("B", compareLineupB)}
      </div>

      {isCompareReady && (
      <button className="analyze-button" onClick={handleCompareLineups}>
        Compare Lineups
      </button>
    )}

    {compareError && <p className="lineup-error">{compareError}</p>}

    {isComparing && <p className="analysis-loading">Comparing lineups...</p>}
    {comparisonResult && (
  <div className="analysis-panel">
    <h2>Comparison Results</h2>

    <div className="analysis-scores">
      <p>Lineup A Offense: {comparisonResult.lineup_a_offense}</p>
      <p>Lineup B Offense: {comparisonResult.lineup_b_offense}</p>
    </div>

    <div className="analysis-scores">
      <p>Lineup A Defense: {comparisonResult.lineup_a_defense}</p>
      <p>Lineup B Defense: {comparisonResult.lineup_b_defense}</p>
    </div>

    <div className="analysis-scores">
      <p>Lineup A Overall: {comparisonResult.lineup_a_score}</p>
      <p>Lineup B Overall: {comparisonResult.lineup_b_score}</p>
    </div>

    <h3>Advantages</h3>
    <p>Offense Advantage: {comparisonResult.offense_advantage}</p>
    <p>Defense Advantage: {comparisonResult.defense_advantage}</p>

    <h3>Key Edge</h3>
    <p>
      {comparisonResult.key_team} by {comparisonResult.key_gap} in{" "}
      {comparisonResult.key_area}
    </p>

    <h3>Winner</h3>
    <p>{comparisonResult.winner}</p>
  </div>
)}
    </section>
  );
}

export default CompareLineupsPage;