import { useState, useEffect } from "react";
import NBACard from "../NBACard";

function PlayerSearchPage() {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);

  useEffect(() => {
  const fetchAllPlayers = async () => {
    try {
      setIsLoadingPlayers(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/players/all`);

      if (!response.ok) {
        throw new Error(`players/all failed with status ${response.status}`);
      }

      const data = await response.json();
      setAllPlayers(data);
    } catch (err) {
      console.error("Failed to load players:", err);
    } finally {
      setIsLoadingPlayers(false);
    }
  };

  fetchAllPlayers();
}, []);

  const fetchPlayer = async (name) => {
    try {
      setError("");
      setPlayerData(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/player?name=${encodeURIComponent(name)}`
      );

      let data = null;

      try {
        data = await response.json();
      } catch (err) {
        console.warn("JSON parse failed:", err);
      }

      if (!response.ok) {
        setError(data?.error || "Something went wrong");
        return;
      }

      if (!data) {
        setError("No data returned");
        return;
      }

      setPlayerData(data);
      setSuggestions([]);

    } catch {
      setError("Could not connect to backend");
    }
  };

  const handlePlayerSearch = async () => {
  if (!playerName.trim()) return;
  fetchPlayer(playerName);
};

  const handlePlayerInputChange = (e) => {
  const value = e.target.value;
  setPlayerName(value);
  setPlayerData(null);
  setError("");
  setSuggestions([]);
};

  return (
    <section className="page-section">
      <h1>Browse/Search Players</h1>
      <p>Search for a player and view current season stats.</p>

      <div className="player-search">
        <input
          type="text"
          placeholder="Enter player name..."
          value={playerName}
          onChange={handlePlayerInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePlayerSearch();
            }
          }}
        />
        <button onClick={handlePlayerSearch}>Search</button>
      </div>

        {/* Suggets playes as user searches */}
      {/* {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((p) => {
            const imageUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`;

            return (
              <div
                key={p.id}
                className="suggestion-item suggestion-player-row"
                onClick={() => {
                  setPlayerName(p.name);
                  setSuggestions([]);
                  fetchPlayer(p.name);
                }}
              >
                <img
                  src={imageUrl}
                  alt={p.name}
                  className="suggestion-headshot"
                />

                <div className="suggestion-player-info">
                  <div className="suggestion-player-name">{p.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      )} */}

          {!playerData && (
      <div className="player-browser">
        <h3>Top Players</h3>

        <div className="player-list">

        {isLoadingPlayers && <p>Loading top players...</p>}

        {!isLoadingPlayers &&
          allPlayers.map((p) => (
            <div
              key={p.id}
              className="player-card-mini"
              onClick={() => fetchPlayer(p.name)}
            >
              <img
                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`}
                alt={p.name}
              />

              <div className="player-mini-info">
                <div className="player-mini-name">{p.name}</div>
                <div className="player-mini-meta">
                  {p.team} • {p.position}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {playerData && (
    <button
      className="back-button"
      onClick={() => {
        setPlayerData(null);
        setPlayerName("");
        setError("");
        setSuggestions([]);
      }}
    >
      Back to Top Players
    </button>
  )}

      <div className="player-results">
        {error && <p>{error}</p>}
        {!error && !playerData && playerName.length === 0 && <p>No player selected.</p>}
        {playerData && <NBACard player={playerData} />}
      </div>
    </section>
  );
}
export default PlayerSearchPage;