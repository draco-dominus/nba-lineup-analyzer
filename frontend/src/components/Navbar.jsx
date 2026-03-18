import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/">NBA Lineup Analyzer</Link>
      </div>

      <div className="nav-links">
        <div className="nav-item">
          <Link to="/">Home</Link>
        </div>

        <div className="nav-item dropdown">
          <span>Players</span>
          <div className="dropdown-menu">
            <Link to="/players/search">Browse Players</Link>
            <Link to="/players/compare">Compare Players</Link>
          </div>
        </div>

        <div className="nav-item dropdown">
          <span>Lineup Builder</span>
          <div className="dropdown-menu">
            <Link to="/lineups/analyze">Analyze Lineup</Link>
            <Link to="/lineups/compare">Compare Lineups</Link>
          </div>
        </div>

        <div className="nav-item dropdown">
          <span>Roster Builder</span>
          <div className="dropdown-menu">
            <Link to="/roster/build">Build Roster</Link>
            <Link to="/roster/simulate">Minutes Simulation</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;