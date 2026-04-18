import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(sessionStorage.getItem('studyshare_user')) || {};
  const token = sessionStorage.getItem('token');

  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword) return alert("Current password is required to verify changes.");
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return alert("New passwords do not match!");
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      const updatedUser = { ...user, username: formData.username, email: formData.email };
      sessionStorage.setItem('studyshare_user', JSON.stringify(updatedUser));
      if (formData.newPassword) {
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } catch (err) {
      alert(err.response?.data?.error || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Inline Styles
  const mainStyle = {
    backgroundColor: '#fcfaf9',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',      // Horizontal Center
    justifyContent: 'flex-start',
    padding: isMobile ? '20px 15px' : '60px 20px',
    boxSizing: 'border-box'
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column'
  };

  const cardStyle = {
    background: 'white',
    padding: isMobile ? '30px 20px' : '40px',
    borderRadius: '30px',
    border: '1px solid #f0edeb',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    width: '100%',
    boxSizing: 'border-box'
  };

  const inputContainer = { marginBottom: '20px' };
  
  const labelStyle = { 
    display: 'block', 
    fontSize: '11px', 
    fontWeight: '800', 
    color: '#b0a4a2', 
    textTransform: 'uppercase', 
    marginBottom: '8px',
    letterSpacing: '0.5px'
  };

  const inputWrapper = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    background: '#fcfaf9', 
    padding: '14px 18px', 
    borderRadius: '15px', 
    border: '1px solid #f0edeb',
    width: '100%',
    boxSizing: 'border-box'
  };

  const inputField = { 
    border: 'none', 
    background: 'transparent', 
    width: '100%', 
    outline: 'none', 
    fontSize: '15px', 
    color: '#3e2723' 
  };

  const saveBtn = { 
    width: '100%', 
    marginTop: '10px', 
    padding: '16px', 
    borderRadius: '15px', 
    background: '#6d4c41', 
    color: 'white', 
    fontWeight: 'bold', 
    border: 'none', 
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'opacity 0.2s'
  };

  return (
    <main style={mainStyle}>
      {/* CSS Reset for this specific component to prevent global interference */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; width: 100%; }
        .eye-btn:hover { opacity: 0.7; }
        .save-btn:active { transform: scale(0.98); }
      `}</style>

      <div style={containerStyle}>
        <form onSubmit={handleUpdate} style={cardStyle}>
          <h2 style={{ 
            color: '#3e2723', 
            marginBottom: '30px', 
            fontFamily: 'serif', 
            textAlign: 'center',
            fontSize: isMobile ? '24px' : '32px'
          }}>
            Profile Settings
          </h2>

          <div style={inputContainer}>
            <label style={labelStyle}>Username</label>
            <div style={inputWrapper}>
              <User size={18} color="#b0a4a2" />
              <input 
                style={inputField} 
                placeholder="Enter username"
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            </div>
          </div>

          <div style={inputContainer}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapper}>
              <Mail size={18} color="#b0a4a2" />
              <input 
                style={inputField} 
                type="email" 
                placeholder="Enter email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #f0edeb' }} />

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#6d4c41', 
            fontWeight: '700', 
            fontSize: '0.9rem', 
            marginBottom: '15px' 
          }}>
            <ShieldCheck size={16} /> Password Security
          </div>

          {/* Current Password */}
          <div style={inputContainer}>
            <label style={labelStyle}>Current Password (Required)</label>
            <div style={inputWrapper}>
              <Lock size={18} color="#b0a4a2" />
              <input 
                style={inputField} 
                type={showCurrent ? "text" : "password"} 
                placeholder="********"
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} 
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowCurrent(!showCurrent)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0a4a2', padding: '5px' }}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={inputContainer}>
            <label style={labelStyle}>New Password</label>
            <div style={inputWrapper}>
              <Lock size={18} color="#b0a4a2" />
              <input 
                style={inputField} 
                type={showNew ? "text" : "password"} 
                placeholder="********"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowNew(!showNew)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0a4a2', padding: '5px' }}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={inputContainer}>
            <label style={labelStyle}>Confirm New Password</label>
            <div style={inputWrapper}>
              <Lock size={18} color="#b0a4a2" />
              <input 
                style={inputField} 
                type={showConfirm ? "text" : "password"} 
                placeholder="********"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowConfirm(!showConfirm)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0a4a2', padding: '5px' }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="save-btn"
            style={{ ...saveBtn, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Saving..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Profile;