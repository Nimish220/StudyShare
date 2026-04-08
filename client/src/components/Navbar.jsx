import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const userString = localStorage.getItem('studyshare_user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
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
        
        <div className="nav-links">
        <Link to="/">Home</Link>

        {/* STUDENT: Needs Browse to find new notes */}
        {user?.role === 'student' && (
          <>
            <Link to="/browse">Browse</Link> {/* This points to ExplorePage */}
            <Link to="/upload">Upload</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}

        {/* ADMIN: Usually manages content via the Admin Dashboard, 
            but can have Browse for quick viewing */}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin?tab=content">Manage Content</Link>
          </>
        )}

        {/* SUPERADMIN: Usually focuses on users, but can have a link if needed */}
        {user?.role === 'superadmin' && (
          <>
            <Link to="/superadmin">Dashboard</Link>
            <Link to="/superadmin?tab=manage-users">Manage Users</Link>
            <Link to="/browse">Browse All</Link>
          </>
        )}
      
        {/* GUEST: Needs to see what's available to be convinced to sign up */}
        {!user && <Link to="/browse">Browse</Link>}
      </div>
        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-user-info">
                {user.username || user.name} 
                <span className="role-badge" style={{ marginLeft: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
                  {user.role}
                </span>
              </span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
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
      </div>
    </nav>
  );
};

export default Navbar;