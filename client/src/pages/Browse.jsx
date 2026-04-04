import React, { useState } from 'react';
import { materials, categories } from '../constants';

const Browse = () => {
  // State for search and category filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter logic: This replaces your initBrowse() function from script.js
  const filteredMaterials = materials.filter((m) => {
    const matchesQuery = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'All' || m.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <main>
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '1.5rem' }}>Browse Materials</h1>
        
        {/* Search Bar Section */}
        <div className="search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            id="browse-search" 
            className="form-control" 
            placeholder="Search by title, author, or keyword..." 
            style={{ paddingLeft: '2.5rem', height: '48px', fontSize: '1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Bar: Dynamically generated from categories array */}
        <div className="filter-bar" id="filter-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-pill ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="results-count">
          {filteredMaterials.length} result{filteredMaterials.length !== 1 ? 's' : ''} found
        </p>

        {/* Materials Grid */}
        <div className="card-grid" id="browse-grid">
          {filteredMaterials.map((m) => (
            <a key={m.id} href="#" className="material-card" onClick={(e) => e.preventDefault()}>
              <div className="card-top">
                <span className="card-type-icon" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {m.type}
                </span>
                <span className="card-badge">{m.category}</span>
              </div>
              <div className="card-title">{m.title}</div>
              <p className="card-author">by {m.author}</p>
              <div className="card-meta">
                <span className="card-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {m.downloads}
                </span>
                <span className="card-meta-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.6, color: 'var(--primary)' }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {m.rating.toFixed(1)}
                </span>
                <span className="card-meta-item"><span className="type-label">{m.type}</span></span>
              </div>
            </a>
          ))}
        </div>

        {/* No Results Message */}
        {filteredMaterials.length === 0 && (
          <div id="no-results" style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--muted-foreground)' }}>
            <p style={{ fontSize: '1.125rem' }}>No materials found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Browse;