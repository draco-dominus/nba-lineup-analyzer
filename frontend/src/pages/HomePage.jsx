import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="home">
      <div className="home-hero">
        <p className="home-eyebrow">NBA lineup tools, reimagined</p>

        <h1>Build, compare, and explore NBA lineups</h1>

        <p className="home-subtext">
          Discover players, create 5-man combinations, compare lineups, and test
          roster ideas in one place.
        </p>

        <div className="home-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/lineup-builder")}
          >
            Build Lineup
          </button>

          <button onClick={() => navigate("/players/search")}>
            Browse Players
          </button>

          <button onClick={() => navigate("/lineups/compare")}>
            Compare Lineups
          </button>

          <button onClick={() => navigate("/roster/build")}>
            Roster Builder
          </button>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>Build Lineups</h3>
          <p>
            Create 5-man groups by position and experiment with different
            player combinations.
          </p>
        </div>

        <div className="feature-card">
          <h3>Browse Players</h3>
          <p>
            Search players, view stats, and explore standout names across the
            league.
          </p>
        </div>

        <div className="feature-card">
          <h3>Compare Lineups</h3>
          <p>
            Put two lineups side by side and see where one group has the edge.
          </p>
        </div>

        <div className="feature-card">
          <h3>Build Rosters</h3>
          <p>
            Test roster ideas and think through how different pieces fit
            together.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HomePage;