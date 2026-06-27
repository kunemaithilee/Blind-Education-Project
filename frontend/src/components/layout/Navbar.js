import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="topbar" aria-label="Main navigation">
      <Link className="brand" to="/">
        <span className="brand-mark">)))</span>
        <span>
          Echo<span>Learn</span>
        </span>
      </Link>

      <div className="topbar-actions">
        <Link to="/courses">Voice First</Link>
        <Link to="/assistant">AI Assistant</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
