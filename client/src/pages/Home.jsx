import React from 'react';
import { Link } from 'react-router-dom';
import { materials, categories } from '../constants';

const Home = () => {
  // Get the first 8 materials for the "Popular" section as per initHome()
  const featuredMaterials = materials.slice(0, 8);
  // Get categories (excluding "All") for the category pills section
  const homeCategories = categories.filter(c => c !== 'All');

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content animate-fade-in">
              <h1>Share Knowledge, <span className="highlight">Empower Learning</span></h1>
              <p className="hero-desc">Upload, discover, and download study materials for free. A community-driven platform built for students and educators worldwide.</p>
              <div className="hero-buttons">
                <Link to="/browse" className="btn btn-primary btn-lg">Browse Materials</Link>
                <Link to="/upload" className="btn btn-outline btn-lg">Upload Notes</Link>
              </div>
            </div>
            <div className="stats-row animate-fade-in">
              <div><div className="stat-value">12,400+</div><div className="stat-label">Materials</div></div>
              <div><div className="stat-value">8,200+</div><div className="stat-label">Users</div></div>
              <div><div className="stat-value">95,000+</div><div className="stat-label">Downloads</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Materials Section */}
      <section className="section-lg">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Popular Materials</h2>
              <p>Most downloaded study resources this month</p>
            </div>
            <Link to="/browse">View all <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></Link>
          </div>
          
          <div className="card-grid" id="featured-grid">
            {featuredMaterials.map((m) => (
              <a key={m.id} href="#" className="material-card" onClick={(e) => e.preventDefault()}>
                <div className="card-top">
                  <span className="card-type-icon" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>{m.type}</span>
                  <span className="card-badge">{m.category}</span>
                </div>
                <div className="card-title">{m.title}</div>
                <p className="card-author">by {m.author}</p>
                <div className="card-meta">
                  <span className="card-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {m.downloads}
                  </span>
                  <span className="card-meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.6, color: 'var(--primary)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {m.rating.toFixed(1)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '2.5rem' }}>Browse by Category</h2>
          <div className="category-pills">
            {homeCategories.map((c) => (
              <Link key={c} to={`/browse?category=${encodeURIComponent(c)}`} className="category-pill">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to contribute?</h2>
            <p>Share your notes and help thousands of students ace their exams.</p>
            <Link to="/signup" className="btn btn-secondary btn-lg">Get Started Free</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;