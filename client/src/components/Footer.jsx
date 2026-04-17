import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Get user from sessionStorage exactly like the Navbar does
  const user = JSON.parse(sessionStorage.getItem('studyshare_user'));

  // Logic to determine the path and label based on role
  const getDashboardInfo = () => {
    if (!user) return { path: "/login", label: "Login" };
    
    switch (user.role) {
      case 'superadmin':
        return { path: "/superadmin", label: "SuperAdmin Dashboard" };
      case 'admin':
        return { path: "/admin", label: "Admin Dashboard" };
      default:
        return { path: "/dashboard", label: "User Dashboard" };
    }
  };

  const dashboardInfo = getDashboardInfo();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span>StudyShare</span>
              </div>
              <p className="footer-desc">A free, open platform for students and educators to share notes, books, and study materials. Learn together, grow together.</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/browse">Browse Materials</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                
                {/* DYNAMIC LINK: Shows the specific dashboard name based on role */}
                <li>
                  <Link to={dashboardInfo.path}>{dashboardInfo.label}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <div className="footer-social">
                <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
                <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">© 2026 StudyShare. All rights reserved. Built for learners, by learners.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;