function PlayerCard({ player, onClick }) {
  const imageUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;

  return (
    <div className="player-card" onClick={onClick}>
      <img
        src={imageUrl}
        alt={player.name}
        className="player-headshot"
      />

      <div className="player-card-header">
        <h2>{player.name}</h2>
        <p>Current Season Stats</p>
      </div>

      <div className="player-card-stats">
        <div className="stat-box">
          <span className="stat-label">PTS</span>
          <span className="stat-value">{player.pts}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">AST</span>
          <span className="stat-value">{player.ast}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">REB</span>
          <span className="stat-value">{player.reb}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">STL</span>
          <span className="stat-value">{player.stl}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">BLK</span>
          <span className="stat-value">{player.blk}</span>
        </div>

        <div className="stat-box">
          <span className="stat-label">3PT%</span>
          <span className="stat-value">
            {player.fg3_pct ? (player.fg3_pct * 100).toFixed(1) + "%" : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;