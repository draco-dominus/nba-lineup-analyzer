import { useState } from "react";
import NBACard from "../NBACard";

function PlayerSearchPage() {
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
  );
}

export default PlayerSearchPage;