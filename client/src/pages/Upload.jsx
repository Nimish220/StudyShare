import React, { useState } from 'react';
import axios from 'axios';

const uploadCategories = [
  'Computer Science', 'Mathematics', 'Chemistry', 'Physics', 
  'Biology', 'History', 'Economics', 'Literature', 'Business', 
  'Environmental', 'DSA', 'DBMS', 'OS', 'CN'
];

const palette = {
  bg: '#FCFAF9',        // Creamier white
  card: '#FFFFFF',
  accent: '#5D4037',    // Deep Brown
  accentHover: '#3E2723',
  accentLight: '#F5F2F0', 
  textMain: '#2C1B18',
  textMuted: '#8D7B77',
  border: '#E8E2E0',
  success: '#4CAF50'    // Green for file selection
};

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Computer Science', tags: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");
    
    setIsUploading(true);
    
    const data = new FormData();
    data.append('materialFile', file); 
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('tags', formData.tags);

    try {
      const token = sessionStorage.getItem('token'); 
      await axios.post(`${import.meta.env.VITE_API_URL}/api/materials/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
      alert("Success! Your material is now pending review.");
      setFile(null);
      setFormData({ title: '', description: '', category: 'Computer Science', tags: '' });
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed. Check file size (Max 15MB).");
    }
    finally{
      setIsUploading(false);
    }
  };

  return (
    <main style={{ backgroundColor: palette.bg, minHeight: '100vh', padding: '40px 0' }}>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
      <div style={{ maxWidth: '650px', margin: '0 auto', padding: '0 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: palette.accent, fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>
            Contributor Portal
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: palette.textMain, fontFamily: 'serif', fontWeight: '800', marginTop: '10px' }}>
            Share Your Knowledge
          </h1>
          <p style={{ color: palette.textMuted, fontSize: '1.1rem', maxWidth: '450px', margin: '15px auto 0' }}>
            Help fellow students by uploading high-quality notes, research papers, or guides.
          </p>
        </header>

        <form onSubmit={handleSubmit} style={{ 
          background: palette.card, 
          padding: '40px', 
          borderRadius: '32px', 
          boxShadow: '0 25px 50px -12px rgba(45, 27, 24, 0.08)',
          border: `1px solid ${palette.border}`
        }}>
          
          {/* Enhanced Upload Zone */}
          <div 
            onClick={() => !isUploading && document.getElementById('file-input').click()}
            onDragOver={(e) => { e.preventDefault(); !isUploading && setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); !isUploading && setFile(e.dataTransfer.files[0]); }}
            style={{ 
              border: `2px dashed ${file ? palette.success : (isDragging ? palette.accent : palette.border)}`, 
              borderRadius: '20px', 
              padding: '50px 20px', 
              textAlign: 'center',
              backgroundColor: isDragging ? palette.accentLight : (file ? '#F1F8E9' : palette.accentLight),
              cursor: isUploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', background: file ? palette.success : palette.accent, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'white' 
            }}>
              {file ? (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              )}
            </div>
            <p style={{ fontWeight: '700', color: palette.textMain, fontSize: '1.1rem' }}>
              {file ? file.name : "Drag & drop file or click to browse"}
            </p>
            <p style={{ color: palette.textMuted, fontSize: '0.85rem', marginTop: '8px' }}>
              Supported: Image, PDF, DOCX, PPTX (Max 15MB)
            </p>
            <input type="file" id="file-input" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.ppt,image/*" hidden disabled={isUploading} />
          </div>

          {/* Form Content */}
          <div style={{ marginTop: '35px' }}>
            <div className="input-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', color: palette.textMain, marginBottom: '10px' }}>Document Title</label>
              <input 
                type="text" id="title" placeholder="e.g. Data Structures - Unit 4: Trees" 
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: `1px solid ${palette.border}`, fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                value={formData.title} onChange={handleChange} required disabled={isUploading}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', color: palette.textMain, marginBottom: '10px' }}>Description</label>
              <textarea 
                id="description" rows="3" placeholder="Briefly highlight key topics covered..."
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: `1px solid ${palette.border}`, fontSize: '16px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                value={formData.description} onChange={handleChange} disabled={isUploading}
              ></textarea>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 240px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', color: palette.textMain, marginBottom: '10px' }}>Subject Category</label>
                <select 
                  id="category" value={formData.category} onChange={handleChange} disabled={isUploading}
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', border: `1px solid ${palette.border}`, backgroundColor: 'white', height: '56px', fontSize: '16px', cursor: 'pointer' }}
                >
                  {uploadCategories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 240px' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', color: palette.textMain, marginBottom: '10px' }}>Search Tags</label>
                <input 
                  type="text" id="tags" placeholder="exam, midsem, formula" 
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', border: `1px solid ${palette.border}`, fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                  value={formData.tags} onChange={handleChange} disabled={isUploading}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            style={{ 
              marginTop: '40px', width: '100%', padding: '20px', 
              backgroundColor: isUploading ? palette.textMuted : palette.accent, 
              color: 'white', border: 'none', borderRadius: '18px', fontWeight: '700', 
              fontSize: '1.1rem', cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
              boxShadow: '0 10px 20px -5px rgba(93, 64, 55, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}
          >
            {isUploading ? (
              <>
                <div style={{ 
                  width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', 
                  borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' 
                }} />
                Uploading...
              </>
            ) : "Submit for Approval"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Upload;