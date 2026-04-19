import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const allCategories = [
  'Computer Science', 'Mathematics', 'Chemistry', 'Physics', 'Biology', 
  'History', 'Economics', 'Literature', 'Business', 'Environmental', 
  'DSA', 'DBMS', 'OS', 'CN'
];

const palette = {
  bg: '#FCFAF9',
  white: '#FFFFFF',
  accent: '#5D4037',
  accentLight: '#F5F2F0',
  textMain: '#2C1B18',
  textSub: '#7A6A67',
  border: '#E8E2E0'
};

const Home = () => {
  const [popularMaterials, setPopularMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        // We call the explore API but limit it to the top 8
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/explore`, {
          params: { limit: 8, sortBy: 'download_count' } 
        });
        setPopularMaterials(res.data.slice(0, 8));
      } catch (err) {
        console.error("Error fetching popular materials:", err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchPopular();
  }, []);

  // DOWNLOAD/VIEW HANDLER
 const handleView = async (id, fileUrl) => {
  const userString = sessionStorage.getItem('studyshare_user');
  const user = userString ? JSON.parse(userString) : null;
  const token = sessionStorage.getItem('token');
  if (!user) {
    alert("Please Log In to view or download materials!");
    window.location.href = '/login'; // Or use useNavigate()
    return;
  }

  try {
    // This will now only work if the user has a valid JWT token
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/materials/download/${id}`,{}, {
        headers: { Authorization: `Bearer ${token}` }
    });
   window.open(fileUrl, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error("View failed:", err);
  }
};

  return (
    <main style={{ backgroundColor: palette.bg, minHeight: '100vh' }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* HERO SECTION */}
      <section style={{ padding: '40px 20px', borderBottom: `1px solid ${palette.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '800', color: palette.textMain, fontFamily: 'serif', lineHeight: '1.1', marginBottom: '15px' }}>
            Share Knowledge, <br /><span style={{ color: palette.accent }}>Empower Learning</span>
          </h1>
          <p style={{ color: palette.textSub, fontSize: '1rem', maxWidth: '650px', margin: '0 auto 30px', lineHeight: '1.5' }}>
            Upload, discover, and download study materials for free. A community-driven platform built for students worldwide.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/browse" style={{ padding: '14px 28px', backgroundColor: palette.accent, color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Browse Library</Link>
            <Link to="/upload" style={{ padding: '14px 28px', backgroundColor: 'white', color: palette.accent, border: `1px solid ${palette.accent}`, borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Upload Notes</Link>
          </div>
        </div>
      </section>

      {/* POPULAR RESOURCES - REAL DATA SECTION */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.8rem', fontFamily: 'serif', color: palette.textMain, margin: 0 }}>Popular Resources</h2>
            <Link to="/browse" style={{ color: palette.accent, fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>View All Library →</Link>
          </div>
          
          {loading ? (
            /* IMPROVED LOADING VIEW: 4 Placeholder boxes to prevent layout jump */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: '200px', background: '#eee', borderRadius: '12px', animate: 'pulse 1.5s infinite ease-in-out' }}></div>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '20px',
              animation: 'fadeIn 0.5s ease-in' 
            }}>
              {popularMaterials.map((m) => (
                <div 
                  key={m.id} 
                  onClick={() => handleView(m.id, m.file_url)}
                  style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${palette.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#2196f3', background: '#e3f2fd', padding: '4px 10px', borderRadius: '4px' }}>{m.category}</span>
                    <span style={{ color: '#f1c40f', fontWeight: 'bold', fontSize: '0.9rem' }}>⭐ {parseFloat(m.avg_rating || 0).toFixed(1)}</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: palette.textMain, marginBottom: '6px' }}>{m.title}</h3>
                  <p style={{ color: palette.textSub, fontSize: '0.8rem', marginBottom: '15px' }}>by {m.author || 'Anonymous'}</p>
                  <div style={{ paddingTop: '12px', borderTop: `1px solid ${palette.border}`, color: palette.textSub, fontSize: '0.8rem' }}>
                    📥 {m.download_count || 0} Downloads
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXPLORE BY SUBJECT */}
      <section style={{ padding: '60px 20px', backgroundColor: palette.accentLight }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '2.2rem', 
            fontFamily: 'serif', 
            color: palette.textMain, 
            marginBottom: '30px',
            fontWeight: 'bold' 
          }}>
            Explore by Subject
          </h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '12px' 
          }}>
            {allCategories.map((c) => (
              <Link 
                key={c} 
                to={`/browse?category=${encodeURIComponent(c)}`} 
                style={{ 
                  padding: '12px 24px', 
                  background: 'white', 
                  color: palette.textMain, 
                  borderRadius: '30px', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  border: `1px solid ${palette.border}`, 
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.accent;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = palette.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ 
          maxWidth: '950px', 
          margin: '0 auto', 
          background: palette.accent, 
          padding: '60px 40px', 
          borderRadius: '32px', 
          textAlign: 'center', 
          color: 'white',
          boxShadow: '0 20px 40px rgba(93, 64, 55, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
            marginBottom: '15px', 
            fontFamily: 'serif',
            fontWeight: 'bold' 
          }}>
            Ready to contribute?
          </h2>
          <p style={{ 
            opacity: '0.9', 
            fontSize: '1.1rem', 
            marginBottom: '35px', 
            maxWidth: '500px', 
            margin: '0 auto 35px',
            lineHeight: '1.6' 
          }}>
            Join 8,000+ students. Share your notes and help the community ace their exams.
          </p>
          <Link 
            to="/signup" 
            style={{ 
              padding: '18px 45px', 
              backgroundColor: 'white', 
              color: palette.accent, 
              borderRadius: '12px', 
              fontWeight: '800', 
              textDecoration: 'none', 
              display: 'inline-block',
              fontSize: '1.1rem',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;