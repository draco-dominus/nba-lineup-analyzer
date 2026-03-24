import { useEffect, useState } from "react";

function LineupBuilderPage() {
  const [lineup, setLineup] = useState({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  const [activeSlot, setActiveSlot] = useState("PG");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const isLineupComplete = Object.values(lineup).every((player) => player !== null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/players?search=${encodeURIComponent(debouncedSearch)}`
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

  const handleSelectPlayer = async (playerName) => {
    try {
      setError("");
      setAnalysis(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/player?name=${encodeURIComponent(playerName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load player");
        return;
      }

      setLineup((prev) => ({
        ...prev,
        [activeSlot]: data,
      }));

      setSearchValue("");
      setDebouncedSearch("");
      setSuggestions([]);
    } catch (err) {
      console.error("Player fetch failed:", err);
      setError("Could not connect to backend");
    }
  };

  const removeFromLineup = (slot) => {
    setAnalysis(null);
    setError("");

    setLineup((prev) => ({
      ...prev,
      [slot]: null,
    }));
  };

  const resetLineup = () => {
    setLineup({
      PG: null,
      SG: null,
      SF: null,
      PF: null,
      C: null,
    });
    setAnalysis(null);
    setError("");
    setSearchValue("");
    setDebouncedSearch("");
    setSuggestions([]);
    setActiveSlot("PG");
  };

  const analyzeLineup = async () => {
    try {
      setError("");
      setAnalysis(null);
      setIsAnalyzing(true);

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
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
  <section className="page-section">
    <h1>Lineup Builder</h1>
    <p>Click a slot, search any player, and build your lineup.</p>

    <div className="starting-lineup-board">
      <div className="starting-lineup-header">Starting Lineup</div>

      <div className="starting-lineup-grid">
        {Object.entries(lineup).map(([slot, player]) => {
          const imageUrl = player
            ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`
            : null;

          return (
            <div
              key={slot}
              className={`lineup-player-card ${activeSlot === slot ? "lineup-player-card-active" : ""}`}
              onClick={() => setActiveSlot(slot)}
            >
              <div className="lineup-player-position">{slot}</div>

              <div className="lineup-player-image-wrap">
                {player ? (
                  <img
                    src={imageUrl}
                    alt={player.name}
                    className="lineup-player-image"
                  />
                ) : (
                  <div className="lineup-player-placeholder">Select {slot}</div>
                )}
              </div>

              <div className="lineup-player-footer">
                <div className="lineup-player-name">
                  {player ? player.name : "Empty Slot"}
                </div>

                {player && (
                  <button
                    className="lineup-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromLineup(slot);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="lineup-builder-controls">
      <h2>Selected Position: {activeSlot}</h2>

      <div className="player-search">
        <input
          type="text"
          placeholder={`Search player for ${activeSlot}...`}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setError("");
            setAnalysis(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions.length > 0) {
              handleSelectPlayer(suggestions[0].name);
            }
          }}
        />
      </div>

      {isSearching && <p>Searching players...</p>}

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((p) => (
            <div
              key={p.id}
              className="suggestion-item"
              onClick={() => handleSelectPlayer(p.name)}
            >
              {p.name}
            </div>
          ))}
        </div>
      )}

      <div className="lineup-builder-actions">
        <button className="reset-btn" onClick={resetLineup}>
          Reset Lineup
        </button>

        {isLineupComplete && (
          <button className="analyze-btn" onClick={analyzeLineup}>
            Analyze Lineup
          </button>
        )}
      </div>

      {isAnalyzing && <p className="analysis-loading">Analyzing lineup...</p>}
      {error && <p className="lineup-error">{error}</p>}

      {analysis && (
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
  </section>
);
}

export default LineupBuilderPage;