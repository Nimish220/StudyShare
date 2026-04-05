import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  // 1. State for file and metadata
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Computer Science',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 2. Automated Storage Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file!");

    // Requirement: Use FormData for multipart uploads (File + Metadata)
    data.append('materialFile', file); 
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);

    try {
      const token = localStorage.getItem('token'); 

      await axios.post('http://localhost:5001/api/materials/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Requirement: Secure Authentication
        }
      });

      alert("Upload Successful! Awaiting Admin Approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Upload Failed");
    }
  };

  return (
    <main>
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: '40rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Upload Material</h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          Share your notes, books, or study materials with the community.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Upload Zone */}
          <div 
            className="upload-zone" 
            id="upload-zone" 
            onClick={() => document.getElementById('file-input').click()}
            style={{ cursor: 'pointer' }}
          >
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <p>{file ? `File Selected: ${file.name}` : "Drag & drop your file here"}</p>
            <p className="sub">or click to browse · PDF, DOCX, PPT, Images (max 50MB)</p>
            <button type="button" className="btn btn-outline" style={{ marginTop: '1rem' }}>Choose File</button>
            <input 
              type="file" 
              id="file-input" 
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg" 
              hidden 
            />
          </div>

          {/* Form Fields */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="title">Title</label>
            <input 
              type="text" id="title" className="form-control" 
              placeholder="e.g. Calculus III Complete Notes" 
              value={formData.title} onChange={handleChange} required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" className="form-control" rows="4" 
              placeholder="Brief description of the material..."
              value={formData.description} onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" className="form-control" value={formData.category} onChange={handleChange} required>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input 
                type="text" id="tags" className="form-control" 
                placeholder="e.g. calculus, notes" 
                value={formData.tags} onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Material
          </button>
        </form>
      </div>
    </main>
  );
};

export default Upload;