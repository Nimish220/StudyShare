import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExplorePage = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('explore'); 
  const [loading, setLoading] = useState(false);

  // States for Rating Modal 
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5001/api/materials/explore';
      let config = { params: { search: searchTerm, category: selectedCategory }, headers };
      if (viewMode === 'my-uploads') url = 'http://localhost:5001/api/materials/my-uploads';

      const res = await axios.get(url, config);
      
      // Ensure the data is mapped correctly for React state
      const formattedData = res.data.map(item => ({
        ...item,
        // Convert to Boolean if backend returns 1/0 for isBookmarked
        isBookmarked: Boolean(item.isBookmarked), 
        // Ensure rating is a float for comparison
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
    fetchData();
  }, [selectedCategory, viewMode]); 

  // BOOKMARK TOGGLE WITH BOOK ICON & ALERTS
  const handleBookmark = async (id, title) => {
    try {
      const material = materials.find(m => m.id === id);
      const isCurrentlyBookmarked = material.isBookmarked;

      // Update UI immediately (Optimistic Update)
      setMaterials(prev => prev.map(m => 
        m.id === id ? { ...m, isBookmarked: !isCurrentlyBookmarked } : m
      ));

      if (!isCurrentlyBookmarked) {
        alert(`"${title}" has been bookmarked!`);
        // await axios.post('...', { material_id: id }, { headers });
      } else {
        alert(`"${title}" has been unmarked!`);
        // await axios.delete('...', { headers });
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
      fetchData(); // Revert to database state on failure
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

  const handleRateSubmit = async () => {
    try {
      await axios.post('http://localhost:5001/api/materials/rate', {
        material_id: selectedMaterialId,
        rating: userRating,
        comment: userComment
      }, { headers });
      
      alert("Review submitted!");
      setShowRateModal(false);
      setUserComment('');
      setUserRating(5);
      fetchData(); // Refreshes to show the new numerical average
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  return (
    <div className="container explore-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#3e2723', fontFamily: 'serif' }}>Explore Study Materials</h1>
        <div className="btn-group" style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn ${viewMode === 'explore' ? 'active' : ''}`} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: viewMode === 'explore' ? '#5d4037' : '#efebe9', color: viewMode === 'explore' ? 'white' : '#5d4037', width: '130px' }} onClick={() => setViewMode('explore')}>All Materials</button>
          <button className={`btn ${viewMode === 'my-uploads' ? 'active' : ''}`} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: viewMode === 'my-uploads' ? '#5d4037' : '#efebe9', color: viewMode === 'my-uploads' ? 'white' : '#5d4037', width: '130px' }} onClick={() => setViewMode('my-uploads')}>My Uploads</button>
        </div>
      </header>

      {viewMode === 'explore' && (
        <div className="filter-section" style={{ display: 'flex', gap: '12px', marginBottom: '40px', alignItems: 'center' }}>
          <input type="text" placeholder="Search by title..." style={{ padding: '12px 15px', borderRadius: '4px', border: '1px solid #ccc', width: '300px', minWidth: '300px' }} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} />
          <button style={{ padding: '12px 24px', backgroundColor: '#5d4037', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '110px' }} onClick={fetchData}>Search</button>
          <select style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', width: '220px', minWidth: '220px' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="DBMS">DBMS</option>
            <option value="OS">OS</option>
            <option value="CN">CN</option>
          </select>
        </div>
      )}

      {loading ? (<div style={{ textAlign: 'center', padding: '50px' }}>Searching...</div>) : (
        <div className="materials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {materials.map((m) => (
            <div key={m.id} className="material-card" style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f3f3f3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '340px', position: 'relative' }}>
              
              <button 
                onClick={() => handleBookmark(m.id, m.title)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={m.isBookmarked ? "#e74c3c" : "#ccc"} xmlns="http://www.w3.org/2000/svg" style={{ transition: 'fill 0.3s ease' }}>
                  <path d="M4 2H18C19.1 2 20 2.9 20 4V22L12 18L4 22V4C4 2.9 4.9 2 6 2H4Z" />
                  <path d="M6 4V19.5L12 16.5L18 19.5V4H6Z" fill="white" fillOpacity="0.2" />
                </svg>
              </button>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2196f3', backgroundColor: '#e3f2fd', padding: '4px 12px', borderRadius: '15px', textTransform: 'uppercase' }}>
                    {m.category}
                  </span>
                  {/* Rating Logic: "New" for 0 ratings, Number for everything else */}
                  <span style={{ fontSize: '14px', color: '#f1c40f', fontWeight: 'bold' }}>
                    ⭐ {m.avg_rating > 0 ? Number(m.avg_rating).toFixed(1) : 'New'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', margin: '15px 0 5px 0', color: '#2c3e50', fontFamily: 'serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.85rem', marginBottom: '10px' }}>by {m.author || 'Me'}</p>
                <p style={{ color: '#34495e', fontSize: '0.9rem', lineHeight: '1.4', height: '60px', overflow: 'hidden' }}>{m.description}</p>
              </div>
              
              <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#95a5a6' }}>📥 {m.download_count || 0} Downloads</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ backgroundColor: '#efebe9', color: '#5d4037', border: 'none', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }} onClick={() => { setSelectedMaterialId(m.id); setShowRateModal(true); }}>Rate</button>
                    <button style={{ backgroundColor: '#5d4037', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }} onClick={() => handleDownload(m.id, m.file_url)}>Download</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal remains same for feedback submission */}
      {showRateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h2 style={{ marginBottom: '20px', fontFamily: 'serif' }}>Submit Review</h2>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Rating (1-5 Stars):</label>
              <input type="number" min="1" max="5" value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <textarea placeholder="Feedback..." value={userComment} onChange={(e) => setUserComment(e.target.value)} style={{ width: '100%', padding: '10px', height: '100px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button onClick={handleRateSubmit} style={{ width: '100%', padding: '12px', backgroundColor: '#5d4037', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
            <button onClick={() => setShowRateModal(false)} style={{ width: '100%', marginTop: '5px', padding: '10px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;