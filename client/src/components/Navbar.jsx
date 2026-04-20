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
    return () => { document.body.style.overflow = 'unset'; };
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

  // Helper function to handle class logic for all links
  const getLinkClass = (path) => location.pathname === path ? 'active-link' : '';

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link to="/" className={getLinkClass('/')}>Home</Link>
      {user && (
        <Link to="/browse" className={getLinkClass('/browse')}>Browse Library</Link>
      )}
      
      {!user && (
        <>
          <Link to="/login" className={getLinkClass('/login')}>Login</Link>
          <Link to="/signup" className={getLinkClass('/signup')}>Sign Up</Link>
        </>
      )}

      {user?.role === 'student' && (
        <>
          <Link to="/upload" className={getLinkClass('/upload')}>Upload Notes</Link>
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
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
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #2d1b15;
          flex-shrink: 0;
        }

        /* THE BROWN BOX (Shared for Desktop and Mobile) */
        .active-link {
          background-color: #6d4c41 !important;
          color: #ffffff !important;
          padding: 10px 20px !important;
          border-radius: 8px;
          font-weight: 700 !important;
        }

        .desktop-nav {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        
        .desktop-nav a {
          text-decoration: none;
          color: #6d4c41;
          font-weight: 600;
          padding: 10px 20px; 
          border-radius: 8px;
          transition: 0.2s ease;
          display: inline-block;
        }

        .hamburger-icon {
          display: none; 
          background: none;
          border: none;
          cursor: pointer;
          z-index: 2101;
          color: #2d1b15;
          padding: 5px;
        }

        @media (max-width: 768px) {
          .hamburger-icon { display: flex; }
          .desktop-nav, .logout-btn-desktop, .nav-username {
            display: none !important;
          }
          .nav-container { padding: 10px 30px 10px 10px; }
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: #ffffff;
          display: ${isMenuOpen ? 'flex' : 'none'};
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 120px;
          z-index: 2000;
          overflow-y: auto;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: center;
          width: 100%;
        }

        .mobile-links a {
          font-size: 1.4rem;
          font-weight: 600;
          text-decoration: none;
          color: #6d4c41;
          width: fit-content;
          margin: 0 auto;
          padding: 10px 20px; /* Standard padding so box looks same when active */
          border-radius: 8px;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="navbar-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span className="brand-text" style={{fontWeight: 800}}>StudyShare</span>
          </Link>

          <div className="desktop-nav">
            {renderNavLinks()}
          </div>

          <div className="nav-right-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user && (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#f5f1ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="#6d4c41" />
                  </div>
                  <span className="nav-username" style={{ fontWeight: '600', fontSize: '0.9rem', marginLeft: '10px', color: '#6d4c41' }}>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="logout-btn-desktop" style={{ background: 'none', border: '1px solid #6d4c41', color: '#6d4c41', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </>
            )}

            <button className="hamburger-icon" onClick={toggleMenu}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <div className="mobile-overlay">
          <div className="mobile-links">
            {renderNavLinks()}
          </div>
          <div style={{width: '75%', borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center', marginTop: '20px'}}>
            {user && (
              <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: '#6d4c41', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem' }}>
                Logout Account
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;