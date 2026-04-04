import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Logic from script.js: Retrieve the user object from localStorage
  const userString = localStorage.getItem('studyshare_user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('studyshare_user');
    window.location.href = '/'; // Matches the behavior in your team's script
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span>StudyShare</span>
        </Link>
        
        <div className="nav-links" id="nav-links">
          {(!user || user.role === 'user') ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/browse">Browse</Link>
              {user && <Link to="/upload">Upload</Link>}
              {user && <Link to="/dashboard">Dashboard</Link>}
            </>
          ) : user.role === 'admin' ? (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/browse">Manage Content</Link>
            </>
          ) : (
            <>
              <Link to="/superadmin">Dashboard</Link>
              <Link to="/admin">Manage Users</Link>
            </>
          )}
        </div>

        <div className="nav-auth" id="nav-auth">
          {user ? (
            <>
              {/* This replaces the static 'user' with the actual logged-in username */}
              <span className="nav-user-info">
                {user.name} <span className="role-badge">({user.role})</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-ghost btn-sm" 
                style={{display:'flex', alignItems:'center', gap:'0.25rem'}}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>

        <button className="hamburger" id="hamburger" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="mobile-menu" id="mobile-menu">
        {/* Mobile items would be rendered here via state if needed */}
      </div>
    </nav>
  );
};

export default Navbar;