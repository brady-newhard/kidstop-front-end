import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleMenuItemClick = (callback = null) => {
    setMenuOpen(false);
    if (callback) callback();
  };

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to='/'>KidStop</Link>
        </div>
        <div className="toggle-container">
          <button 
            className="menu-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-container">
          <div className="nav-menu open">
            <ul>
              {user ? (
                <>
                  <li><Link to='/' onClick={() => handleMenuItemClick()}>Dashboard</Link></li>
                  <li><Link to='/playgroundfinder' onClick={() => handleMenuItemClick()}>Find KidStops</Link></li>
                  <li><Link to='/playgrounds/new' onClick={() => handleMenuItemClick()}>Add a KidStop</Link></li>
                  <li><Link to='/playgrounds' onClick={() => handleMenuItemClick()}>Favorites</Link></li>
                  <li><Link to='/games' onClick={() => handleMenuItemClick()}>Games</Link></li>
                  <li><Link to='/media' onClick={() => handleMenuItemClick()}>Media</Link></li>
                  <li><Link to='/parent-portal' onClick={() => handleMenuItemClick()}>Parent Portal</Link></li>
                  <li><Link to='/' onClick={() => handleMenuItemClick(handleSignOut)}>Sign Out</Link></li>
                </>
              ) : (
                <>
                  <li><Link to='/' onClick={() => handleMenuItemClick()}>Home</Link></li>
                  <li><Link to='/sign-in' onClick={() => handleMenuItemClick()}>Sign In</Link></li>
                  <li><Link to='/sign-up' onClick={() => handleMenuItemClick()}>Sign Up</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
