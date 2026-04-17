import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState([]);
  const [stats, setStats] = useState({ uploads: 0, bookmarks: 0, avgRating: 0, downloads: 0 });
  const user = JSON.parse(sessionStorage.getItem('studyshare_user')) || {};
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const bookmarkRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/bookmarks`, { headers });
        setBookmarkedMaterials(bookmarkRes.data);

        const uploadRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/materials/my-uploads`, { headers });
        const uploads = uploadRes.data;

        const totalDownloads = uploads.reduce((acc, curr) => acc + (curr.download_count || 0), 0);
        const totalRating = uploads.reduce((acc, curr) => acc + parseFloat(curr.avg_rating || 0), 0);
        
        const ratedMaterials = uploads.filter(m => parseFloat(m.avg_rating) > 0);
        const avgRating = ratedMaterials.length > 0 ? (totalRating / ratedMaterials.length).toFixed(1) : 0;

        setStats({
          uploads: uploads.length,
          bookmarks: bookmarkRes.data.length,
          downloads: totalDownloads,
          avgRating: avgRating
        });
        
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  return (
    <main style={{ backgroundColor: '#fcfaf9', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <header style={{ padding: '40px 0 20px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', color: '#3e2723', fontFamily: 'serif' }}>
            User Dashboard
          </h1>
          <p style={{ color: '#6d4c41', fontSize: '1.1rem' }}>
            Welcome back, <span style={{ fontWeight: '700' }}>{user.username || 'Student'}</span>
          </p>
        </header>

        {/* Stats Grid - Number and Label in Single Line */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px',
          marginBottom: '40px' 
        }}>
          {[
            { label: 'Uploads', value: stats.uploads, color: '#6d4c41' },
            { label: 'Total Views', value: stats.downloads, color: '#6d4c41' },
            { label: 'Bookmarks', value: stats.bookmarks, color: '#6d4c41' },
            { label: 'Avg Rating', value: stats.avgRating > 0 ? `⭐ ${stats.avgRating}` : 'New', color: '#f1c40f' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              background: 'white', 
              padding: '20px 25px', 
              borderRadius: '20px', 
              display: 'flex',          // Flex makes them sit in a row
              alignItems: 'center',      // Vertical center
              justifyContent: 'center',  // Horizontal center
              gap: '15px',               // Spacing between number and text
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)', 
              border: '1px solid #f0edeb' 
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.9rem', color: '#b0a4a2', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* --- ACTION TOGGLE SWITCH --- */}
        <div style={{ 
          display: 'inline-flex', 
          background: '#f0edea', 
          padding: '4px', 
          borderRadius: '30px', 
          marginBottom: '50px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Link to="/upload" style={{ 
            padding: '10px 22px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '14px', 
            backgroundColor: '#6d4c41', 
            color: 'white',
            transition: '0.2s'
          }}>
            Upload New
          </Link>
          
          <Link to="/browse" style={{ 
            padding: '10px 22px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '14px', 
            backgroundColor: 'transparent', 
            color: '#6d4c41',
            transition: '0.2s'
          }}>
            Browse Notes
          </Link>

          <Link to="/browse" state={{ view: 'my-uploads' }} style={{ 
            padding: '10px 22px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            fontWeight: '600', 
            fontSize: '14px', 
            backgroundColor: 'transparent', 
            color: '#6d4c41',
            transition: '0.2s'
          }}>
            My Uploads
          </Link>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: '#2d1b18', marginBottom: '20px' }}>Your Bookmarked Materials</h2>
        
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '25px' 
          }}>
            {bookmarkedMaterials.length > 0 ? (
              bookmarkedMaterials.map((m) => {
                // Calculate rating display logic here
                const ratingValue = parseFloat(m.avg_rating);
                const displayStars = ratingValue > 0 ? `⭐ ${ratingValue.toFixed(1)}` : '⭐ New';

                return (
                  <div key={m.id} style={{ background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f0edeb', display: 'flex', flexDirection: 'column', height: '220px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: '#2196f3', background: '#e3f2fd', padding: '5px 12px', borderRadius: '8px', textTransform: 'uppercase' }}>{m.category}</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d1b18', marginBottom: '5px' }}>{m.title}</h3>
                      <p style={{ color: '#b0a4a2', fontSize: '0.9rem' }}>by {m.author}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #f5f2f0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: '#b0a4a2' }}>📥 {m.download_count || 0} views</span>
                      <span style={{ fontWeight: 'bold', color: '#f1c40f' }}>
                        {displayStars}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', border: '2px dashed #ddd' }}>
                <p style={{ color: '#7a6a67' }}>No bookmarks yet. Start exploring to save your favorite notes!</p>
              </div>
            )}
          </div>
      </div>
    </main>
  );
};

export default Dashboard;