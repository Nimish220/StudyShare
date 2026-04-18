import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const userString = sessionStorage.getItem('studyshare_user');
  const user = userString ? JSON.parse(userString) : null;

  // Sync: Close menu on route change and reset scroll
  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset'; 
  }, [location]);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    document.body.style.overflow = newState ? 'hidden' : 'unset';
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login'; 
  };

  // Content sync: Increased font weight and size for Mobile specifically
  const renderNavLinks = (isMobile = false) => (
    <>
      <Link 
        to="/" 
        className={location.pathname === '/' ? 'active' : ''}
        style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}
      >
        Home
      </Link>
      
      <Link 
        to="/browse" 
        className={location.pathname === '/browse' ? 'active' : ''}
        style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}
      >
        Browse Library
      </Link>

      {user?.role === 'student' && (
        <>
          <Link to="/upload" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>Upload Notes</Link>
          <Link to="/dashboard" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>Dashboard</Link>
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <Link to="/admin" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>Admin Panel</Link>
          <Link to="/admin?tab=content" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>Manage Content</Link>
        </>
      )}

      {user?.role === 'superadmin' && (
        <>
          <Link to="/superadmin" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>SuperAdmin</Link>
          <Link to="/superadmin?tab=manage-users" style={isMobile ? { fontSize: '1.5rem', fontWeight: '600' } : {}}>Manage Users</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        {/* BRAND LOGO */}
        <Link to="/" className="navbar-brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span style={{ letterSpacing: '-0.5px' }}>StudyShare</span>
        </Link>
        
        {/* LAPTOP NAVIGATION */}
        <div className="nav-links">
          {renderNavLinks(false)}
        </div>

        {/* LAPTOP AUTH */}
        <div className="nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <>
              {/* Profile Icon + Name Wrapper */}
              <Link to="/profile" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                textDecoration: 'none',
                color: 'inherit',
                padding: '5px 10px',
                borderRadius: '12px',
                transition: 'background 0.2s'
              }} className="nav-profile-link">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  <User size={18} />
                </div>
                <span className="nav-user-info" style={{ fontWeight: '600' }}>
                  {user.username}
                  <span className="role-badge" style={{ 
                    marginLeft: '8px', 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    background: '#6d4c41', 
                    color: 'white' 
                  }}>
                    {user.role}
                  </span>
                </span>
              </Link>

              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}
        </div>
        {/* MOBILE HAMBURGER BUTTON */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu" style={{ zIndex: 110 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" /> 
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>

        {/* MOBILE MENU OVERLAY */}
        <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 100,
          display: isMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          backgroundColor: 'var(--card)',
          padding: '100px 1.5rem 2rem', // Increased top padding for better breathing room
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          {/* Main Links Area - Increased Gap and Font Size */}
          <div className="nav-links" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', // More space between links
            marginBottom: '3rem' 
          }}>
            {renderNavLinks(true)}
          </div>

          {/* Auth Area - Fixed Size and Large Buttons */}
          <div className="nav-auth" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '2.5rem',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto'
          }}>
            {user ? (
              <>
                <div style={{ marginBottom: '0.5rem', color: 'var(--muted-foreground)', fontSize: '1.1rem' }}>
                  Logged in as <strong style={{color: 'var(--primary)'}}>{user.username || user.name}</strong>
                </div>
                <button onClick={handleLogout} className="btn btn-destructive btn-full" style={{ borderRadius: '12px', height: '56px', fontSize: '1.2rem', fontWeight: '700' }}>
                  Logout Account
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-full" style={{ borderRadius: '12px', height: '56px', fontSize: '1.2rem', fontWeight: '700' }}>
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-full" style={{ borderRadius: '12px', height: '56px', fontSize: '1.2rem', fontWeight: '700' }}>
                  Sign up for Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;