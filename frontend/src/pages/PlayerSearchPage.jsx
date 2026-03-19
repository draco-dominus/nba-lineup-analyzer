import { useState, useEffect } from "react";
import NBACard from "../NBACard";

function PlayerSearchPage() {
  const [playerName, setPlayerName] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const response = await fetch("import.meta.env.VITE_API_URL/players/all");
        const data = await response.json();
        setAllPlayers(data);
      } catch {
        console.error("Failed to load players");
      }
    };

    fetchAllPlayers();
  }, []);

  const fetchPlayer = async (name) => {
    try {
      setError("");
      setPlayerData(null);

      const response = await fetch(
        `import.meta.env.VITE_API_URL/player?name=${encodeURIComponent(name)}`
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

  const handlePlayerSearch = async () => {
    fetchPlayer(playerName);
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
        `import.meta.env.VITE_API_URL/players?search=${encodeURIComponent(value)}`
      );

      const data = await response.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
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
        />
        <button onClick={handlePlayerSearch}>Search</button>
      </div>

      {suggestions.length > 0 && (
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
      )}

      <div className="player-browser">
  <h3>Top Players</h3>

        <div className="player-list">
            {allPlayers.slice(0, 50).map((p) => {
            const imageUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.id}.png`;

            return (
                <div
                key={p.id}
                className="player-card-mini"
                onClick={() => fetchPlayer(p.name)}
                >
                <img src={imageUrl} alt={p.name} />

                <div className="player-mini-info">
                    <div className="player-mini-name">{p.name}</div>
                    <div className="player-mini-meta">
                    {p.position ? `${p.team} • ${p.position}` : p.team}
                    </div>
                </div>
                </div>
            );
            })}
        </div>
        </div>

      <div className="player-results">
        {error && <p>{error}</p>}
        {!error && !playerData && <p>No player selected.</p>}
        {playerData && <NBACard player={playerData} />}
      </div>
    </section>
  );
}

export default PlayerSearchPage;