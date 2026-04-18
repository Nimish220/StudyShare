import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const userString = sessionStorage.getItem('studyshare_user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset'; 
  }, [location]);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    // Lock background scroll when menu is open
    document.body.style.overflow = newState ? 'hidden' : 'unset';
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login'; 
  };

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Home</Link>
      <Link to="/browse" className={location.pathname === '/browse' ? 'active-link' : ''}>Browse Library</Link>
      {user?.role === 'student' && (
        <>
          <Link to="/upload" className={location.pathname === '/upload' ? 'active-link' : ''}>Upload Notes</Link>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active-link' : ''}>Dashboard</Link>
        </>
      )}
      {(user?.role === 'admin' || user?.role === 'superadmin') && (
        <Link 
          to={user.role === 'admin' ? "/admin" : "/superadmin"} 
          className={location.pathname.includes('admin') || location.pathname.includes('superadmin') ? 'active-link' : ''}
        >
          {user.role === 'admin' ? "Admin Panel" : "SuperAdmin"}
        </Link>
      )}
    </>
  );

  return (
    <>
      <style>{`
        /* 1. LAYOUT & STABILITY */
        .navbar {
          width: 100%;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-sizing: border-box;
          border-bottom: 1px solid #f0f0f0;
        }

        .nav-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          /* Padding: Top/Bottom 12px, Right 35px (pushes hamburger left), Left 10px (pushes logo left) */
          padding: 12px 35px 12px 10px; 
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px; /* Space between Book icon and StudyShare */
          text-decoration: none;
          color: #2d1b15;
          flex-shrink: 0;
        }

        /* 2. ACTIVE HIGHLIGHT BOX (The Scroller/Highlighter) */
        .active-link {
          background-color: #6d4c41 !important;
          color: #ffffff !important;
          padding: 10px 20px !important;
          border-radius: 8px;
          font-weight: 700 !important;
        }

        /* 3. MOBILE UI ADJUSTMENTS */
        @media (max-width: 768px) {
          .nav-container {
             padding: 10px 30px 10px 10px; 
          }
          
          .brand-text {
            font-size: 1.05rem !important;
          }
          
          /* SPACE BETWEEN LOGO AND PROFILE */
          .nav-right-group {
            gap: 20px !important; 
          }

          .nav-username {
            display: none !important; /* Keep username hidden on mobile top-bar */
          }

          .desktop-nav, .logout-btn-desktop {
            display: none !important;
          }
        }

        /* 4. FIXED FULL-SCREEN MENU */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: #ffffff; /* Solid white background */
          display: ${isMenuOpen ? 'flex' : 'none'};
          flex-direction: column;
          align-items: center;
          justify-content: flex-start; /* Start from top */
          padding-top: 120px; /* Space for links */
          z-index: 2000;
          overflow-y: auto; /* Allows menu itself to scroll if items go off screen */
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 2.2rem;
          text-align: center;
          margin-bottom: 3rem;
          width: 100%;
        }

        .mobile-links a {
          font-size: 1.6rem;
          font-weight: 600;
          text-decoration: none;
          color: #2d1b15;
          width: fit-content;
          margin: 0 auto;
          padding: 12px 24px;
          transition: 0.3s ease;
        }

        .hamburger-icon {
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2101; /* Must be higher than overlay */
          color: #2d1b15;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .desktop-nav {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .desktop-nav a {
          text-decoration: none;
          color: #4a3728;
          font-weight: 500;
          padding: 8px 12px;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          {/* LOGO (Further Left) */}
          <Link to="/" className="navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span className="brand-text" style={{fontWeight: 800}}>StudyShare</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="desktop-nav">
            {renderNavLinks(false)}
          </div>

          {/* RIGHT SIDE SECTION */}
          <div className="nav-right-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user && (
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#f5f1ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="#6d4c41" />
                </div>
                {/* Username shows on laptop, hidden on mobile by CSS */}
                <span className="nav-username" style={{ fontWeight: '600', fontSize: '0.9rem', marginLeft: '10px' }}>{user.username}</span>
              </Link>
            )}

            {user && (
              <button onClick={handleLogout} className="logout-btn-desktop" style={{ background: 'none', border: '1px solid #ddd', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Logout
              </button>
            )}

            {/* HAMBURGER (Nudged further left via container padding) */}
            <button className="hamburger-icon" onClick={toggleMenu} aria-label="Toggle Menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* FULL SCREEN OVERLAY (Covers background content entirely) */}
        <div className="mobile-overlay">
          <div className="mobile-links">
            {renderNavLinks(true)}
          </div>
          
          <div style={{width: '75%', borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center'}}>
            {user ? (
              <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: '#6d4c41', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
                Logout Account
              </button>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none', color: '#6d4c41', fontWeight: '700', fontSize: '1.2rem' }}>Log In</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;