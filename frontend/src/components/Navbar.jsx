import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          ⛏️ MineCraft Social
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/users" className="nav-link">Players</Link>
              <Link to={`/profile/${user._id}`} className="nav-link">Profile</Link>
              <button onClick={logout} className="btn btn-small btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
