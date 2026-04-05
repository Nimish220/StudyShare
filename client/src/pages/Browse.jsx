import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { categories } from '../constants';

const Browse = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/materials/explore', {
        params: { 
          search: searchQuery, 
          category: activeCategory 
        },
        headers
      });
      setMaterials(res.data);
    } catch (err) {
      console.error("Error fetching browse data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [activeCategory]);

  const handleDownload = async (id, fileUrl) => {
    try {
      await axios.patch(`http://localhost:5001/api/materials/download/${id}`);
      window.open(`http://localhost:5001/${fileUrl}`, '_blank');
      setMaterials(prev => prev.map(m => m.id === id ? { ...m, download_count: (m.download_count || 0) + 1 } : m));
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <main style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1250px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Header Section */}
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3e2723', fontFamily: 'serif' }}>Library Browser</h1>
          <p style={{ color: '#777' }}>Select a category and search for specific study materials.</p>
        </header>

        {/* 1. HORIZONTAL CATEGORIES BAR */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '30px',
          padding: '10px 0'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 24px',
                borderRadius: '25px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                backgroundColor: activeCategory === cat ? '#5d4037' : '#fff',
                color: activeCategory === cat ? 'white' : '#5d4037',
                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: activeCategory === cat ? 'none' : '1px solid #eee'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. SEARCH BAR (Now full width) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <input 
            type="text" 
            placeholder="Search by title, author, or keyword..." 
            style={{ 
              padding: '14px 20px', 
              borderRadius: '8px', 
              border: '1px solid #ddd', 
              flex: 1, 
              fontSize: '1rem', 
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMaterials()}
          />
          <button 
            onClick={fetchMaterials}
            style={{ 
              padding: '0 30px', 
              backgroundColor: '#5d4037', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Search
          </button>
        </div>

        {/* 3. MATERIALS GRID */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{ height: '340px', background: '#eee', borderRadius: '8px' }}></div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '20px', color: '#888', fontSize: '0.95rem', textAlign: 'center' }}>
                Showing <strong>{materials.length}</strong> results for <strong>{activeCategory}</strong>
              </div>

              <div className="materials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {materials.map((m) => (
                  <div key={m.id} className="material-card" style={{ 
                    background: 'white', padding: '24px', borderRadius: '8px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f3f3f3', 
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
                    height: '340px', position: 'relative' 
                  }}>
                    
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={m.isBookmarked ? "#e74c3c" : "#ccc"}>
                        <path d="M4 2H18C19.1 2 20 2.9 20 4V22L12 18L4 22V4C4 2.9 4.9 2 6 2H4Z" />
                      </svg>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2196f3', backgroundColor: '#e3f2fd', padding: '4px 12px', borderRadius: '15px', textTransform: 'uppercase' }}>
                          {m.category}
                        </span>
                        <span style={{ fontSize: '14px', color: '#f1c40f', fontWeight: 'bold' }}>
                          ⭐ {m.avg_rating > 0 ? Number(m.avg_rating).toFixed(1) : 'New'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', margin: '15px 0 5px 0', color: '#2c3e50', fontFamily: 'serif' }}>{m.title}</h3>
                      <p style={{ color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '10px' }}>by {m.author || m.uploader_name}</p>
                      <p style={{ color: '#34495e', fontSize: '0.9rem', lineHeight: '1.4', height: '60px', overflow: 'hidden' }}>{m.description}</p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>📥 {m.download_count || 0}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ backgroundColor: '#efebe9', color: '#5d4037', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Rate</button>
                          <button 
                              onClick={() => handleDownload(m.id, m.file_url)}
                              style={{ backgroundColor: '#5d4037', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                          >
                              Download
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && materials.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <h3 style={{ color: '#555' }}>No results found</h3>
              <p style={{ color: '#888' }}>Try a different category or search term.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Browse;