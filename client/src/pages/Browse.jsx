import React, { useState, useEffect } from 'react';
import axios from 'axios';

const allCategories = [
  'All', 'Computer Science', 'Mathematics', 'Chemistry', 'Physics', 
  'Biology', 'History', 'Economics', 'Literature', 'Business', 
  'Environmental', 'DSA', 'DBMS', 'OS', 'CN'
];

const Browse = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('explore'); 
  const [loading, setLoading] = useState(false);

  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('studyshare_user'));
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let url = viewMode === 'my-uploads' 
        ? 'http://localhost:5001/api/materials/my-uploads' 
        : 'http://localhost:5001/api/materials/explore';

      const res = await axios.get(url, {
        params: { search: searchQuery, category: activeCategory },
        headers
      });

      const formattedData = res.data.map(item => ({
        ...item,
        isBookmarked: Boolean(item.isBookmarked),
        avg_rating: parseFloat(item.avg_rating) || 0 
      }));

      setMaterials(formattedData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [activeCategory, viewMode]);

  const handleBookmarkToggle = (id) => {
    if (!token) return alert("Login to bookmark!");
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, isBookmarked: !m.isBookmarked } : m));
  };

  const handleDownload = async (id, fileUrl) => {
    try {
      await axios.patch(`http://localhost:5001/api/materials/download/${id}`);
      window.open(`http://localhost:5001/${fileUrl}`, '_blank');
      setMaterials(prev => prev.map(m => m.id === id ? { ...m, download_count: (m.download_count || 0) + 1 } : m));
    } catch (err) { console.error(err); }
  };

  const handleRateSubmit = async () => {
    try {
      await axios.post('http://localhost:5001/api/materials/rate', {
        material_id: selectedMaterialId, rating: userRating, comment: userComment
      }, { headers });
      setShowRateModal(false);
      fetchMaterials();
    } catch (err) { alert("Error submitting rating"); }
  };

  return (
    <main style={{ backgroundColor: '#fcfaf9', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* HEADER SECTION - Mobile Responsive */}
        <header style={{ padding: '40px 0 20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '20px',
            marginBottom: '30px' 
          }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '700', color: '#3e2723', fontFamily: 'serif', margin: 0 }}>
              Explore Study Materials
            </h1>
            
            {/* TOGGLE SWITCH */}
            <div style={{ display: 'flex', background: '#f0edea', padding: '4px', borderRadius: '30px' }}>
              <button 
                onClick={() => setViewMode('explore')}
                style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s', backgroundColor: viewMode === 'explore' ? '#6d4c41' : 'transparent', color: viewMode === 'explore' ? 'white' : '#6d4c41', fontSize: '14px' }}
              >
                All Materials
              </button>
              {user?.role === 'student' && (
                <button 
                  onClick={() => setViewMode('my-uploads')}
                  style={{ padding: '10px 20px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s', backgroundColor: viewMode === 'my-uploads' ? '#6d4c41' : 'transparent', color: viewMode === 'my-uploads' ? 'white' : '#6d4c41', fontSize: '14px' }}
                >
                  My Uploads
                </button>
              )}
            </div>
          </div>

          {/* SEARCH & CATEGORY BAR - Mobile Friendly stack */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <input 
              type="text" 
              placeholder="Search by title..." 
              style={{ flex: '1 1 300px', border: '1px solid #ddd', padding: '12px 15px', fontSize: '16px', outline: 'none', borderRadius: '4px' }} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMaterials()}
            />
            <button 
              onClick={fetchMaterials} 
              style={{ backgroundColor: '#6d4c41', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              Search
            </button>
            
            <select 
              style={{ flex: '1 1 200px', padding: '12px 15px', borderRadius: '4px', border: '2px solid black', fontSize: '16px', backgroundColor: 'white' }} 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </header>

        {/* GRID SECTION */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>Searching Library...</div>
        ) : (
          <>
            {materials.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '25px', 
                marginTop: '30px' 
              }}>
                {materials.map((m) => (
                  <div key={m.id} style={{ background: 'white', padding: '28px', borderRadius: '20px', border: '1px solid #f0edeb', display: 'flex', flexDirection: 'column', height: '380px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#2196f3', background: '#e3f2fd', padding: '5px 12px', borderRadius: '8px', textTransform: 'uppercase' }}>{m.category}</span>
                      <button onClick={() => handleBookmarkToggle(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill={m.isBookmarked ? "#e74c3c" : "none"} stroke={m.isBookmarked ? "#e74c3c" : "#b0a4a2"} strokeWidth="2.5">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2d1b18', marginBottom: '8px' }}>{m.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>⭐ {m.avg_rating > 0 ? m.avg_rating.toFixed(1) : 'New'}</span>
                        <span style={{ color: '#b0a4a2' }}>• By {m.author || 'Anonymous'}</span>
                      </div>
                      <p style={{ color: '#5c4d4a', fontSize: '0.95rem', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                        {m.description}
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid #f5f2f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#b0a4a2' }}>📥 {m.download_count || 0} views</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setSelectedMaterialId(m.id); setShowRateModal(true); }} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e0dcd9', background: 'white', color: '#5d4037', cursor: 'pointer' }}>Rate</button>
                        <button onClick={() => handleDownload(m.id, m.file_url)} style={{ padding: '8px 18px', borderRadius: '10px', border: 'none', background: '#5d4037', color: 'white', cursor: 'pointer' }}>Download</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE LOGIC */
              <div style={{ 
                textAlign: 'center', 
                padding: '80px 20px', 
                background: 'white', 
                borderRadius: '20px', 
                marginTop: '30px',
                border: '2px dashed #ddd'
              }}>
                <h2 style={{ color: '#6d4c41', fontSize: '1.8rem', marginBottom: '10px' }}>No Content Available</h2>
                <p style={{ color: '#7a6a67' }}>
                  {viewMode === 'my-uploads' 
                    ? "You haven't uploaded any materials yet." 
                    : `We couldn't find any materials for "${activeCategory}" or your search term.`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* RATING MODAL (Remains similar but mobile scaled) */}
      {showRateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#2d1b18', marginBottom: '10px' }}>Rate Resource</h2>
            <input type="number" min="1" max="5" value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e0dcd9', marginBottom: '15px' }} />
            <textarea placeholder="Comment..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '12px', height: '100px', borderRadius: '12px', border: '1px solid #e0dcd9', marginBottom: '25px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleRateSubmit} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#5d4037', color: 'white', fontWeight: 'bold' }}>Submit</button>
              <button onClick={() => setShowRateModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#f5f2f0', color: '#5d4037' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Browse;