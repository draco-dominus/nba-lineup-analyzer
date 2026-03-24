import { useEffect, useState } from "react";

const EMPTY_LINEUP = {
  PG: null,
  SG: null,
  SF: null,
  PF: null,
  C: null,
};

function CompareLineupsPage() {
  const [lineupA, setLineupA] = useState(EMPTY_LINEUP);
  const [lineupB, setLineupB] = useState(EMPTY_LINEUP);

  const [activeSide, setActiveSide] = useState("A");
  const [activeSlot, setActiveSlot] = useState("PG");

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const isLineupAComplete = Object.values(lineupA).every((player) => player !== null);
  const isLineupBComplete = Object.values(lineupB).every((player) => player !== null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.trim().length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/players?search=${encodeURIComponent(
            debouncedSearch
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion search failed:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSlotSelect = (side, slot) => {
    setActiveSide(side);
    setActiveSlot(slot);
    setSearchValue("");
    setSuggestions([]);
    setError("");
  };

  const handleSelectPlayer = async (playerName) => {
    try {
      setError("");
      setComparison(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/player?name=${encodeURIComponent(playerName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load player");
        return;
      }

      if (activeSide === "A") {
        setLineupA((prev) => ({
          ...prev,
          [activeSlot]: data,
        }));
      } else {
        setLineupB((prev) => ({
          ...prev,
          [activeSlot]: data,
        }));
      }

      setSearchValue("");
      setDebouncedSearch("");
      setSuggestions([]);
    } catch (err) {
      console.error("Player fetch failed:", err);
      setError("Could not connect to backend");
    }
  };

  const removeFromLineup = (side, slot) => {
    setComparison(null);
    setError("");

    if (side === "A") {
      setLineupA((prev) => ({
        ...prev,
        [slot]: null,
      }));
    } else {
      setLineupB((prev) => ({
        ...prev,
        [slot]: null,
      }));
    }

    if (activeSide === side && activeSlot === slot) {
      setSearchValue("");
      setSuggestions([]);
    }
  };

  const resetLineup = (side) => {
    setComparison(null);
    setError("");

    if (side === "A") {
      setLineupA(EMPTY_LINEUP);
    } else {
      setLineupB(EMPTY_LINEUP);
    }

    if (activeSide === side) {
      setSearchValue("");
      setDebouncedSearch("");
      setSuggestions([]);
    }
  };

  const compareLineups = async () => {
    try {
      setError("");
      setComparison(null);
      setIsComparing(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/compare-lineups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lineup_a: lineupA,
            lineup_b: lineupB,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Server error: ${response.status}`);
        return;
      }

      setComparison(data);
    } catch (err) {
      console.error(err);
      setError("Request failed before server response");
    } finally {
      setIsComparing(false);
    }
  };

  const renderComparisonRow = (label, valueA, valueB) => {
    const aNum = Number(valueA);
    const bNum = Number(valueB);

    const aWins = !Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum > bNum;
    const bWins = !Number.isNaN(aNum) && !Number.isNaN(bNum) && bNum > aNum;

    return (
      <div className="compare-stat-row" key={label}>
        <div className={`compare-stat-value ${aWins ? "stat-winner" : ""}`}>
          {Number.isNaN(aNum) ? "—" : aNum}
        </div>
        <div className="compare-stat-label">{label}</div>
        <div className={`compare-stat-value ${bWins ? "stat-winner" : ""}`}>
          {Number.isNaN(bNum) ? "—" : bNum}
        </div>
      </div>
    );
  };

  const renderLineupRow = (title, lineup, side) => {
    return (
      <div className="compare-lineup-row-block">
        <div className="compare-lineup-row-header">
          <h2>{title}</h2>
          <button className="reset-btn" onClick={() => resetLineup(side)}>
            Reset {title}
          </button>
        </div>

        <div className="compare-lineup-row">
          {Object.entries(lineup).map(([slot, player]) => {
            const isActive = activeSide === side && activeSlot === slot;
            const imageUrl = player
              ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`
              : null;

            return (
              <div
                key={`${side}-${slot}`}
                className={`compare-inline-slot ${isActive ? "compare-inline-slot-active" : ""}`}
                onClick={() => handleSlotSelect(side, slot)}
              >
                <div className="compare-inline-slot-top">
                  <span className="compare-inline-slot-position">{slot}</span>
                  <span className="compare-inline-slot-side">Lineup {side}</span>
                </div>

                {player ? (
                  <>
                    <div className="compare-inline-slot-image-wrap">
                      <img
                        src={imageUrl}
                        alt={player.name}
                        className="compare-inline-slot-image"
                      />
                    </div>

                    <div className="compare-inline-slot-name">{player.name}</div>

                    <button
                      className="lineup-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromLineup(side, slot);
                      }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="compare-inline-empty-label">Select {slot}</div>

                    {isActive && (
                      <>
                        <input
                          className="compare-inline-search"
                          type="text"
                          placeholder={`Search ${slot}...`}
                          value={searchValue}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                            setError("");
                            setComparison(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && suggestions.length > 0) {
                              handleSelectPlayer(suggestions[0].name);
                            }
                          }}
                          autoFocus
                        />

                        {isSearching && (
                          <div
                            className="compare-inline-search-status"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Searching...
                          </div>
                        )}

                        {suggestions.length > 0 && (
                          <div
                            className="compare-inline-suggestions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {suggestions.map((p) => (
                              <div
                                key={p.id}
                                className="compare-inline-suggestion-item"
                                onClick={() => handleSelectPlayer(p.name)}
                              >
                                {p.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const offenseA =
    comparison?.lineup_a?.offense?.offense_score ??
    comparison?.lineupA?.offense?.offense_score;

  const offenseB =
    comparison?.lineup_b?.offense?.offense_score ??
    comparison?.lineupB?.offense?.offense_score;

  const defenseA =
    comparison?.lineup_a?.defense?.defense_score ??
    comparison?.lineupA?.defense?.defense_score;

  const defenseB =
    comparison?.lineup_b?.defense?.defense_score ??
    comparison?.lineupB?.defense?.defense_score;

  const overallA =
    comparison?.lineup_a?.overall?.overall_score ??
    comparison?.lineupA?.overall?.overall_score;

  const overallB =
    comparison?.lineup_b?.overall?.overall_score ??
    comparison?.lineupB?.overall?.overall_score;

  return (
    <section className="page-section">
      <h1>Compare Lineups</h1>
      <p>Build two lineups and compare them side by side.</p>

      {renderLineupRow("Lineup A", lineupA, "A")}
      {renderLineupRow("Lineup B", lineupB, "B")}

      <div className="compare-lineups-actions">
        <button
          className="analyze-btn"
          onClick={compareLineups}
          disabled={!(isLineupAComplete && isLineupBComplete)}
        >
          Compare Lineups
        </button>
      </div>

      {isComparing && <p className="analysis-loading">Comparing lineups...</p>}
      {error && <p className="lineup-error">{error}</p>}

      {comparison && (
        <div className="compare-summary-panel">
          <h2>Lineup Comparison</h2>

          <div className="compare-stat-table">
            {renderComparisonRow(
              "Offense",
              offenseA != null ? Number(offenseA.toFixed?.(1) ?? offenseA) : "—",
              offenseB != null ? Number(offenseB.toFixed?.(1) ?? offenseB) : "—"
            )}
            {renderComparisonRow(
              "Defense",
              defenseA != null ? Number(defenseA.toFixed?.(1) ?? defenseA) : "—",
              defenseB != null ? Number(defenseB.toFixed?.(1) ?? defenseB) : "—"
            )}
            {renderComparisonRow(
              "Overall",
              overallA != null ? Number(overallA.toFixed?.(1) ?? overallA) : "—",
              overallB != null ? Number(overallB.toFixed?.(1) ?? overallB) : "—"
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CompareLineupsPage;