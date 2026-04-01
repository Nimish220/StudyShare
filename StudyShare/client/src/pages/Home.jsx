import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Make sure your original CSS is pasted in App.css

function Home() {
  // --- 1. State Management (Replacing global JS variables) ---
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });
  const [isDragOver, setIsDragOver] = useState(false);

  // --- 2. Fetch Logic (Updated to use Backend Search) ---
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // We now pass the search and type to the server as 'params'
        const response = await axios.get('http://localhost:5000/api/materials', {
          params: {
            q: searchQuery,
            type: typeFilter
          }
        });
        
        setMaterials(response.data);
      } catch (err) {
        console.error("Error fetching materials:", err);
      }
    };

    fetchFiles();
  }, [searchQuery, typeFilter]); 

  // --- 3. Upload Logic (Replacing handleUpload in script.js) ---
  const handleUpload = async (file) => {
    if (!file) return;
    
    setStatusMsg({ text: `Uploading ${file.name}...`, isError: false });
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      
      if (response.data.success) {
        setStatusMsg({ text: response.data.message, isError: false });
        // Trigger a re-fetch to show the new file
        const updated = await axios.get('http://localhost:5000/api/materials');
        setMaterials(updated.data);
      }
    } catch (err) {
      setStatusMsg({ text: "Upload failed. Check server connection.", isError: true });
    }
  };

  // --- 4. Helper for Icons ---
  const getIconClass = (type) => {
    if (type === 'pdf') return 'fa-solid fa-file-pdf';
    if (type === 'docx') return 'fa-solid fa-file-word';
    if (['jpg', 'png', 'jpeg', 'webp'].includes(type)) return 'fa-solid fa-file-image';
    return 'fa-solid fa-file';
  };

  return (
    <div className="App">
      <header>
        <div className="container">
          <div className="logo">
            <i className="fa-solid fa-book-open"></i> StudyShare
          </div>
          <p className="tagline">Share knowledge, freely and openly</p>
        </div>
      </header>

      <div className="container main-content">
        
        {/* UPLOAD SECTION */}
        <section className="card">
          <h2>Upload Materials</h2>
          <p className="subtext">Share your study materials with the community. No sign-up required.</p>
          
          <div className={`upload-box ${isDragOver ? 'dragover' : ''}`} id="drop-zone">
            <h3>Upload Study Materials</h3>
            <p className="small-text">Supported formats: PDF, DOCX, JPG, PNG, WEBP • Maximum size: 40 MB</p>
            
            <div 
              className="drop-area"
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) handleUpload(files[0]);
              }}
            >
              <i className="fa-solid fa-arrow-up-from-bracket upload-icon"></i>
              <p>Drag and drop your file here, or click to browse</p>
              <p className="file-types">PDF, DOCX, or image files up to 40 MB</p>
              
              <input 
                type="file" 
                id="fileInput" 
                hidden 
                onChange={(e) => handleUpload(e.target.files[0])}
              />
              <button className="btn" onClick={() => document.getElementById('fileInput').click()}>
                Browse Files
              </button>
            </div>
            <div id="upload-status" style={{ color: statusMsg.isError ? 'red' : 'green', marginTop: '10px' }}>
              {statusMsg.text}
            </div>
          </div>
        </section>

        {/* BROWSE SECTION */}
        <section className="card">
          <h2>Browse Materials</h2>
          <p className="subtext">Download and preview study materials shared by others.</p>

          <div className="browse-box">
            <h3>Available Materials</h3>
            <p className="small-text">Search and filter to find the materials you need</p>

            <div className="search-bar">
              <div className="input-group">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                  type="text" 
                  placeholder="Search by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="image">Images</option>
              </select>
            </div>

            <div id="file-list" className="file-list">
              {materials.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-regular fa-file"></i>
                  <p>No files found</p>
                </div>
              ) : (
                materials.map((file) => (
                  <div className="file-item" key={file.id}>
                    <div className="file-info">
                      <i className={`${getIconClass(file.filetype)} file-icon`}></i>
                      <div>
                        <strong>{file.filename}</strong><br />
                        <span className="small-text">
                          {(file.filesize / 1024).toFixed(1)} KB • {new Date(file.upload_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={`http://localhost:5000/${file.filepath}`} 
                      className="download-link" 
                      download={file.filename}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="card contact-card">
          <h3><i className="fa-solid fa-circle-exclamation"></i> Contact Us / Report a Problem</h3>
          <p>Found an issue or have a question? We're here to help.</p>
          <div className="contact-row">
            <div className="email-info">
              <i className="fa-regular fa-envelope"></i> <strong>nimish.d.joshi27@gmail.com</strong>
            </div>
            <a href="mailto:nimish.d.joshi27@gmail.com" className="btn-outline">
              <i className="fa-regular fa-envelope"></i> Send Email
            </a>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; 2026. Built with love using caffeine.ai</p>
      </footer>
    </div>
  );
}

export default Home;