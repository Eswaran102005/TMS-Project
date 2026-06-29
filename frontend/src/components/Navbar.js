import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          TMS
        </Link>
        
        {isAuthenticated && (
          <button 
            className={`menu-toggle ${isMobileOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu} 
            aria-label="Toggle navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        )}

        <div className={`nav-menu-wrapper ${isMobileOpen ? 'active' : ''} ${!isAuthenticated ? 'logged-out' : ''}`}>
          {isAuthenticated ? (
            <>
              <div className="nav-links">
                <Link to="/complaints/new" className="nav-link" onClick={closeMobileMenu}>Raise Complaint</Link>
                {user?.role !== 'SuperAdmin' && <Link to="/my-complaints" className="nav-link" onClick={closeMobileMenu}>My Complaints</Link>}
                {user?.role === 'SuperAdmin' && (
                  <>
                    <Link to="/departments" className="nav-link" onClick={closeMobileMenu}>Departments</Link>
                    <Link to="/programmes" className="nav-link" onClick={closeMobileMenu}>Programmes</Link>
                    <Link to="/blocks" className="nav-link" onClick={closeMobileMenu}>Blocks</Link>
                    <Link to="/rooms" className="nav-link" onClick={closeMobileMenu}>Rooms</Link>
                    <Link to="/roles" className="nav-link" onClick={closeMobileMenu}>Roles</Link>
                    <Link to="/users" className="nav-link" onClick={closeMobileMenu}>Users</Link>
                  </>
                )}
                {user?.role === 'SuperAdmin' && <Link to="/complaints" className="nav-link" onClick={closeMobileMenu}>All Complaints</Link>}
              </div>

              <div className="nav-actions">
                <span className="nav-user">Hello, {user?.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <div className="nav-links">
              <Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
