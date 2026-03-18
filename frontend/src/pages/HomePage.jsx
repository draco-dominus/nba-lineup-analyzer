import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page-section">
      <h1>NBA Lineup Analyzer</h1>
      <p>
        Build lineups, compare players, and analyze team fit using advanced
        basketball analytics.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <Link to="/players/search">
          <button>Browse Players</button>
        </Link>

        <Link to="/lineups/analyze">
          <button>Analyze Lineup</button>
        </Link>

        <Link to="/lineups/compare">
          <button>Compare Lineups</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;