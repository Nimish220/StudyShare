import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { categories } from '../constants';

const Browse = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // States for Rating Modal
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/materials/explore', {
        params: { search: searchQuery, category: activeCategory },
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

  // BOOKMARK TOGGLE LOGIC
  const handleBookmarkToggle = async (id, title) => {
    if (!token) return alert("Please login to bookmark materials!");
    
    try {
      const material = materials.find(m => m.id === id);
      const isCurrentlyBookmarked = material.isBookmarked;

      // Optimistic UI update
      setMaterials(prev => prev.map(m => 
        m.id === id ? { ...m, isBookmarked: !isCurrentlyBookmarked } : m
      ));

      if (!isCurrentlyBookmarked) {
        alert(`"${title}" has been bookmarked!`);
      } else {
        alert(`"${title}" has been unmarked!`);
      }
      // Note: Backend API call for bookmarks goes here
    } catch (err) {
      console.error("Bookmark failed:", err);
      fetchMaterials();
    }
  };

  // RATING SUBMISSION LOGIC
  const handleRateSubmit = async () => {
    if (!token) return alert("Please login to rate materials!");

    try {
      await axios.post('http://localhost:5001/api/materials/rate', {
        material_id: selectedMaterialId,
        rating: userRating,
        comment: userComment
      }, { headers });
      
      alert("Thank you for your feedback!");
      setShowRateModal(false);
      setUserComment('');
      fetchMaterials(); // Refresh to show new numerical average [cite: 18]
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

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
        
        {/* Header & Filters */}
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3e2723', fontFamily: 'serif' }}>Library Browser</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '10px 24px', borderRadius: '25px', border: 'none', cursor: 'pointer', backgroundColor: activeCategory === cat ? '#5d4037' : '#fff', color: activeCategory === cat ? 'white' : '#5d4037', border: '1px solid #eee' }}>{cat}</button>
            ))}
          </div>
        </header>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' }}>
          <input type="text" placeholder="Search..." style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchMaterials()} />
          <button onClick={fetchMaterials} style={{ padding: '0 30px', backgroundColor: '#5d4037', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Search</button>
        </div>

        {/* Materials Grid */}
        <div className="materials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {materials.map((m) => (
            <div key={m.id} className="material-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '340px', position: 'relative' }}>
              
              {/* FIXED BOOKMARK ICON */}
              <button onClick={() => handleBookmarkToggle(m.id, m.title)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={m.isBookmarked ? "#e74c3c" : "#ccc"} style={{ transition: 'fill 0.3s' }}>
                  <path d="M4 2H18C19.1 2 20 2.9 20 4V22L12 18L4 22V4C4 2.9 4.9 2 6 2H4Z" />
                </svg>
              </button>

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2196f3', backgroundColor: '#e3f2fd', padding: '4px 12px', borderRadius: '15px' }}>{m.category}</span>
                  <span style={{ fontSize: '14px', color: '#f1c40f', fontWeight: 'bold' }}>⭐ {m.avg_rating > 0 ? Number(m.avg_rating).toFixed(1) : 'New'}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: '15px 0 5px 0', color: '#2c3e50', fontFamily: 'serif' }}>{m.title}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>by {m.author || 'Contributor'}</p>
                <p style={{ color: '#34495e', fontSize: '0.9rem', marginTop: '10px' }}>{m.description}</p>
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>📥 {m.download_count || 0}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setSelectedMaterialId(m.id); setShowRateModal(true); }} style={{ backgroundColor: '#efebe9', color: '#5d4037', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Rate</button>
                  <button onClick={() => handleDownload(m.id, m.file_url)} style={{ backgroundColor: '#5d4037', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      {showRateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h2 style={{ marginBottom: '20px', fontFamily: 'serif' }}>Rate Material</h2>
            <input type="number" min="1" max="5" value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc' }} />
            <textarea placeholder="Your comments..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '15px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleRateSubmit} style={{ flex: 1, padding: '12px', backgroundColor: '#5d4037', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
              <button onClick={() => setShowRateModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Browse;