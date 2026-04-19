import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const allCategories = [
  'All', 'Computer Science', 'Mathematics', 'Chemistry', 'Physics', 
  'Biology', 'History', 'Economics', 'Literature', 'Business', 
  'Environmental', 'DSA', 'DBMS', 'OS', 'CN'
];

const Browse = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.state?.view || 'explore'); 
  const [loading, setLoading] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('studyshare_user') || 'null');
 
  const getHeaders = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
  // 1. Define the function with useCallback so it doesn't change on every render
const fetchMaterials = useCallback(async () => {
  const currentToken = sessionStorage.getItem('token'); 
  if (!currentToken && viewMode === 'my-uploads') {
      console.warn("No token found for private view");
      return; 
  }
  const fetchHeaders = (currentToken && currentToken !== "null") ? { Authorization: `Bearer ${currentToken}` } : {};
  
  setLoading(true);
  try {
    let url = viewMode === 'my-uploads' 
      ? `${import.meta.env.VITE_API_URL}/api/materials/my-uploads` 
      : `${import.meta.env.VITE_API_URL}/api/materials/explore`;

    const res = await axios.get(url, {
      params: { search: searchQuery, category: activeCategory },
      headers: fetchHeaders
    });

    const formattedData = res.data.map(item => ({
      ...item,
      isBookmarked: item.isBookmarked === 1 || item.isBookmarked === true,
      avg_rating: parseFloat(item.avg_rating) || 0 
    }));

    setMaterials(formattedData);
  } catch (err) {
    if (err.response?.status === 401) {
       console.error("Session expired on refresh");
    }
    setMaterials([]);
  } finally {
    setLoading(false);
  }
}, [viewMode, searchQuery, activeCategory]); // Dependencies for the function itself

// 2. Correct useEffect: Pass the function name, NO parentheses ()
useEffect(() => {
  fetchMaterials();
}, [fetchMaterials]);

  useEffect(() => {
    if (location.state?.view) {
      setViewMode(location.state.view);
    }
  }, [location.state]);

  const handleBookmarkToggle = async (id) => {
  const headers = getHeaders();
 if (!headers.Authorization) return alert("Login to bookmark!");

  try {
    // Send the request to the backend
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/materials/bookmark`, 
      { material_id: id }, 
      { headers }
    );

    // Update the UI locally so it feels fast
    setMaterials(prev => 
      prev.map(m => m.id === id ? { ...m, isBookmarked: res.data.isBookmarked } : m)
    );
    if (res.data.isBookmarked) {
      console.log("Bookmark updated");
    } else {
      console.log("Bookmark Removed!");
    }
  } catch (err) {
    console.error("Bookmark Error:", err);
    alert("Could not update bookmark.");
  }
};

  const handleDownload = async (id, fileUrl) => {
  try {
    // 1. Update the download/view count in your MySQL DB via your backend API
    const token = sessionStorage.getItem('token');
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/materials/download/${id}`, {}, { headers: getHeaders() });

    // 2. Open the file in a new tab
    // We REMOVED `${import.meta.env.VITE_API_URL}/` because fileUrl is now a full Cloudinary HTTPS link
    window.open(fileUrl, '_blank', 'noopener,noreferrer');

    // 3. Increment the count in the React state so the UI updates immediately
    setMaterials(prev => 
      prev.map(m => m.id === id ? { ...m, download_count: (m.download_count || 0) + 1 } : m)
    );
  } catch (err) {
    if (err.response?.status === 401) {
      alert("Your session expired! Redirecting to login...");
      window.location.href = '/login';
    } else {
      // Fallback: If the database update fails, still try to open the file for the user
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  }
};

  const handleRateSubmit = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/materials/rate`, {
        material_id: selectedMaterialId, rating: userRating, comment: userComment
      }, { headers: getHeaders()});
      setShowRateModal(false);
      fetchMaterials();
    } 
    catch (err) {
      if (err.response?.status === 401) {
        alert("Your session expired! Redirecting to login...");
        window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || "Failed to submit rating.");
      }
    }
  };

  const handleReport = async (id) => {
    const confirmReport = window.confirm("Report this material for Admin review?");
    if (!confirmReport) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/materials/report`, 
        { material_id: id }, 
        { headers:getHeaders() }
      );
      alert("Material reported. Thank you for keeping StudyShare safe.");
    } catch (err) {
      alert("Failed to submit report.");
    }
  };
  const handleViewReviews = async (materialId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/${materialId}/reviews`);
      setReviews(res.data);
      setShowReviewsModal(true);
    } catch (err) {
      console.error("Review Fetch Error:", err);
      alert("Could not load reviews.");
    }
  };

  return (
    <main style={{ backgroundColor: '#fcfaf9', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        
        {/* HEADER SECTION - Mobile Responsive */}
        <header style={{ 
          padding: '20px 0 10px',
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          backgroundColor: '#fcfaf9',
          borderBottom: '1px solid #f0edea' // separator for better UX
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '15px',
            marginBottom: '25px' 
          }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: '700', color: '#3e2723', fontFamily: 'serif', margin: 0 }}>
              Explore Study Materials
            </h1>
            
            {/* TOGGLE SWITCH */}
            <div style={{ display: 'flex', background: '#f0edea', padding: '4px', borderRadius: '30px' }}>
              <button 
                onClick={() => setViewMode('explore')}
                style={{ padding: '8px 14px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s', backgroundColor: viewMode === 'explore' ? '#6d4c41' : 'transparent', color: viewMode === 'explore' ? 'white' : '#6d4c41', fontSize: '13px' }}
              >
                All Materials
              </button>
              {user?.role === 'student' && (
                <button 
                  onClick={() => setViewMode('my-uploads')}
                  style={{ padding: '8px 13px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.2s', backgroundColor: viewMode === 'my-uploads' ? '#6d4c41' : 'transparent', color: viewMode === 'my-uploads' ? 'white' : '#6d4c41', fontSize: '14px' }}
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
              style={{ flex: '1 1 100%', border: '1px solid #ddd', padding: '12px', fontSize: '16px', outline: 'none', borderRadius: '10px' }} 
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
              style={{ flex: '1 1 150px', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: 'white' }} 
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
          <div style={{ textAlign: 'center', marginTop: '40px' }}> 🔍Searching Library...</div>
        ) : (
          <>
            {materials.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', 
                gap: '20px', 
                marginTop: '20px' 
              }}>
              {materials.map((m) => (
                    <div key={m.id} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f0edeb', display: 'flex', flexDirection: 'column', minHeight: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                      
                      {/* CLEANED TOP ACTION BAR */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#2196f3', background: '#e3f2fd', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {m.category}
                        </span>
                        {viewMode === 'my-uploads' && (
                            <span style={{ 
                              fontSize: '10px', 
                              fontWeight: '700', 
                              padding: '4px 10px', 
                              borderRadius: '6px', 
                              textTransform: 'uppercase',
                              backgroundColor: m.status === 'approved' ? '#e8f5e9' : m.status === 'rejected' ? '#ffebee' : '#fff3e0',
                              color: m.status === 'approved' ? '#2e7d32' : m.status === 'rejected' ? '#c62828' : '#ef6c00',
                              marginLeft: 'auto',
                              marginRight: '10px'
                            }}>
                              {m.status || 'Under Observation'}
                            </span>
                          )}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button onClick={() => handleReport(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0a4a2', padding: 0 }}>🚩</button>
                          <button onClick={() => handleBookmarkToggle(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={m.isBookmarked ? "#e74c3c" : "none"} stroke={m.isBookmarked ? "#e74c3c" : "#b0a4a2"} strokeWidth="2.5">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* REST OF CARD CONTENT */}
                      <div style={{ flexGrow: 1 }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#2d1b18', marginBottom: '6px' }}>{m.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                          <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>⭐ {m.avg_rating > 0 ? m.avg_rating.toFixed(1) : 'No ratings yet'}</span>
                          <span style={{ color: '#b0a4a2' }}>• By {m.author || 'Anonymous'}</span>
                        </div>
                        <p style={{ color: '#5c4d4a', fontSize: '0.95rem', lineHeight: '1.6', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical' }}>
                          {m.description}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid #f5f2f0', paddingTop: '15px', marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#b0a4a2' }}>📥 {m.download_count || 0} downloads</span>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            {m.userHasRated > 0 ? (
                              <span style={{ fontSize: '0.8rem', color: '#8d7b77', fontStyle: 'italic', padding: '8px' }}>Rated ✓</span>
                            ) : (
                              <button onClick={() => { setSelectedMaterialId(m.id); setShowRateModal(true); }} style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', color: '#5d4037', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',minHeight:'40px' }}>Rate</button>
                            )}
                            <button onClick={() => handleDownload(m.id, m.file_url)} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#5d4037', color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', minHeight: '40px' }}>Download</button>
                          </div>
                        </div>
                        <button onClick={() => handleViewReviews(m.id)} style={{ background: 'none', border: 'none', color: '#8d7b77', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', padding: '8px 0' }}>
                          💬 View {m.review_count || 0} Reviews
                        </button>
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
                <h2 style={{ color: '#6d4c41' }}>📚 No materials found</h2>
                <ul style={{ color: '#7a6a67', marginTop: '10px' }}>
                  <li>Change category</li>
                  <li>Try different keywords</li>
                  <li>Upload your own notes</li>
                </ul>
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
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle()}>
      <h2 style={{ fontSize: '1.8rem', color: '#3e2723', marginBottom: '8px', fontFamily: 'serif' }}>Rate Resource</h2>
      <p style={{ color: '#8d7b77', marginBottom: '24px', fontSize: '0.9rem' }}>How helpful was this material?</p>
      
      {/* RATING SELECTOR WITH UP/DOWN BUTTONS */}
      <div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '15px', // FIX 4: Reduced gap from 24px to 15px
  background: '#fcfaf9', 
  padding: '20px', 
  borderRadius: '15px', 
  marginBottom: '20px', 
  border: '1px solid #eee' 
}}>
 <button 
  onClick={() => setUserRating(prev => Math.max(1, prev - 1))}
  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // Reset if finger slides off
  style={circleBtnStyle}
>
  −
</button>

  
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: '90px', 
    textAlign: 'center' 
  }}>
    <span style={{ fontSize: '2.8rem', fontWeight: '800', color: '#5d4037', lineHeight: '1' }}>
      {userRating}
    </span>
    <div style={{ color: '#f1c40f', fontSize: '1.1rem', marginTop: '4px' }}>
      {'⭐'.repeat(userRating)}
    </div>
  </div>

 <button 
  onClick={() => setUserRating(prev => Math.min(5, prev + 1))}
  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  style={{...circleBtnStyle, background: '#5d4037', color: 'white'}}
>
  +
</button>
</div>

      <textarea 
        placeholder="Comment..." 
        value={userComment} 
        onChange={(e) => setUserComment(e.target.value)} 
        style={{ 
          width: '100%', padding: '15px', height: '100px', borderRadius: '15px', 
          border: '1px solid #e0dcd9', marginBottom: '25px', outline: 'none', 
          fontFamily: 'inherit', fontSize: '16px' 
        }} 
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={handleRateSubmit} 
          style={{ 
            flex: 2, padding: '14px', borderRadius: '15px', border: 'none', 
            background: '#5d4037', color: 'white', fontWeight: 'bold', 
            fontSize: '16px', cursor: 'pointer' 
          }}
        >
          Submit
        </button>
        <button 
          onClick={() => setShowRateModal(false)} 
          style={{ 
            flex: 1, padding: '14px', borderRadius: '15px', border: 'none', 
            background: '#f0edea', color: '#5d4037', fontWeight: '600', 
            fontSize: '16px', cursor: 'pointer' 
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {showReviewsModal && (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#2d1b18', fontFamily: 'serif' }}>Community Reviews</h2>
        <button onClick={() => setShowReviewsModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {reviews.length > 0 ? (
          reviews.map((rev, i) => (
            <div key={i} style={{ padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <b style={{ color: '#5d4037' }}>{rev.username}</b>
                <span style={{ color: '#f1c40f' }}>⭐ {rev.rating}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>{rev.comment || "No comment left."}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>No reviews yet.</p>
        )}
      </div>
    </div>
  </div>
)}
    </main>
  );
};
const modalOverlayStyle = {
  position: 'fixed', 
  inset: 0, 
  backgroundColor: 'rgba(0,0,0,0.6)', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  zIndex: 2000, 
  padding: '15px' 
};

// UPDATE: Added box-sizing and max-height for mobile stability
const modalContentStyle = () => ({
  background: 'white', 
  padding: '25px', 
  borderRadius: '24px', 
  width: '100%', 
  maxWidth: '450px', 
  boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
  boxSizing: 'border-box',
  maxHeight: '90vh', // Ensures it never goes off-screen
  overflowY: 'auto'  // Adds scrollbar if content is long
});

const circleBtnStyle = {
  width: '45px', 
  height: '45px', 
  borderRadius: '50%', 
  border: 'none', 
  background: '#e0dcd9', 
  color: '#3e2723', 
  cursor: 'pointer', 
  fontSize: '22px', 
  fontWeight: 'bold', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  transition: '0.2s transform ease', 
  flexShrink: 0, 
};
export default Browse;
