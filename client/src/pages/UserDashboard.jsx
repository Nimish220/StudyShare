import React from 'react';
import { Link } from 'react-router-dom';
import { materials } from '../constants';

const Dashboard = () => {
  // Logic from script.js: Populate bookmarked grid with first 6 materials
  const bookmarkedMaterials = materials.slice(0, 6);
  const user = JSON.parse(localStorage.getItem('studyshare_user')) || { name: 'User123' };

  return (
    <main>
      <div className="container dashboard-page">
        <h1>User Dashboard</h1>
        <p className="subtitle">Welcome back, <span id="user-name">{user.name}</span></p>

        <div className="stat-cards">
          <div className="stat-card stat-card-center">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
            <div className="value">12</div>
            <div className="label">Uploads</div>
          </div>
          <div className="stat-card stat-card-center">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
            <div className="value">340</div>
            <div className="label">Downloads</div>
          </div>
          <div className="stat-card stat-card-center">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></div>
            <div className="value">28</div>
            <div className="label">Bookmarks</div>
          </div>
          <div className="stat-card stat-card-center">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <div className="value">4.6</div>
            <div className="label">Avg Rating</div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/upload" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload New
          </Link>
          <Link to="/browse" className="btn btn-outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Browse Notes
          </Link>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Bookmarked Materials</h2>
        
        <div className="card-grid-3" id="bookmarked-grid">
          {bookmarkedMaterials.map((m) => (
            <a key={m.id} href="#" className="material-card" onClick={(e) => e.preventDefault()}>
              <div className="card-top">
                <span className="card-badge">{m.category}</span>
              </div>
              <div className="card-title">{m.title}</div>
              <p className="card-author">by {m.author}</p>
              <div className="card-meta">
                <span className="card-meta-item">📥 {m.downloads}</span>
                <span className="card-meta-item">⭐ {m.rating}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;