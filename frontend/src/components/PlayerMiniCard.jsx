function PlayerMiniCard({ player, onClick }) {
  const imageUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.id}.png`;

  return (
    <div className="player-mini-card" onClick={onClick}>
      <img
        src={imageUrl}
        alt={player.name}
        className="player-mini-headshot"
      />

      <div className="player-mini-content">
        <div className="player-mini-name">{player.name}</div>
        <div className="player-mini-meta">
          {player.position}
        </div>
      </div>
    </div>
  );
}

export default PlayerMiniCard;