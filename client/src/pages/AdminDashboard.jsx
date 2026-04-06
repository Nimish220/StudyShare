import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('tab-pending');
  const [currentMaterials, setCurrentMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalDownloads: 0,
    pendingReviews: 0
  });

  const token = localStorage.getItem('token');
  const adminData = JSON.parse(localStorage.getItem('studyshare_user'));
  const headers = { Authorization: `Bearer ${token}` };
  const API_BASE = 'http://localhost:5001/api/admin';
  const [approvedMaterials, setApprovedMaterials] = useState([]);
  // Fetch all dashboard data
  const fetchDashboardData = async () => {
  try {
    const [statsRes, pendingRes, usersRes, approvedRes] = await Promise.all([
      axios.get(`${API_BASE}/stats`, { headers }),
      axios.get(`${API_BASE}/pending`, { headers }),
      axios.get(`${API_BASE}/users`, { headers }),
      // You need to create this admin route to see ALL approved content
      axios.get('http://localhost:5001/api/materials/explore', { headers }) 
    ]);

    setStats(statsRes.data);
    setCurrentMaterials(pendingRes.data); // This stays for Pending tab
    setUsers(usersRes.data);
    setApprovedMaterials(approvedRes.data); // New state for Manage Content tab
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
  }
};
  useEffect(() => {
    // 4. Create an effect to switch tabs when the URL changes
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'content') {
      setActiveTab('tab-content');
    } else if (tabParam === 'pending') {
      setActiveTab('tab-pending');
    }else {
    setActiveTab('tab-pending');
  }
  }, [location]);
  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE}/approve/${id}`, {}, { headers });
      fetchDashboardData(); // Refresh list and stats
    } catch (err) {
      alert("Error approving material");
    }
  };

  const handleView = (fileUrl) => {
    window.open(`http://localhost:5001/${fileUrl}`, '_blank');
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this content?")) {
      try {
        // Ensure this URL matches: http://localhost:5001/api/admin/material/:id
        await axios.delete(`${API_BASE}/material/${id}`, { headers });
        
        alert("Material removed successfully!");
        fetchDashboardData(); // Refresh the list
      } catch (err) {
        console.error("Delete Error:", err.response?.data || err.message);
        alert("Error removing material: " + (err.response?.data?.error || "Server Error"));
      }
    }
  };

  return (
    <div className="page-wrapper">
      <main>
        <div className="container dashboard-page">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">
            Welcome, <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>
              {adminData?.username || "Admin"}
            </span>. Manage content and users. 
          </p>

          {/* Dynamic Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="value">{stats.totalMaterials}</div>
              <div className="label">Total Materials </div>
            </div>
            <div className="stat-card">
              <div className="value">{stats.totalUsers}</div>
              <div className="label">Total Users </div>
            </div>
            <div className="stat-card">
              <div className="value">{stats.totalDownloads}</div>
              <div className="label">Total Downloads </div>
            </div>
            <div className="stat-card">
              <div className="value" style={{ color: 'orange' }}>{stats.pendingReviews}</div>
              <div className="label">Pending Reviews </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs">
            <button className={`tab ${activeTab === 'tab-pending' ? 'active' : ''}`} onClick={() => setActiveTab('tab-pending')}>
              Pending Approvals
            </button>
            <button className={`tab ${activeTab === 'tab-content' ? 'active' : ''}`} onClick={() => setActiveTab('tab-content')}>
              Manage Content
            </button>
            <button className={`tab ${activeTab === 'tab-users' ? 'active' : ''}`} onClick={() => setActiveTab('tab-users')}>
              Users
            </button>
          </div>

          <div className="table-card">
            <div className="table-wrapper">
              
              {/* 1. PENDING APPROVALS TABLE */}
              {activeTab === 'tab-pending' && (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMaterials.length > 0 ? currentMaterials.map((m) => (
                      <tr key={m.id}>
                        <td><strong>{m.title}</strong></td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.author}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.category}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-icon btn-ghost" style={{ color: 'var(--primary)' }} onClick={() => handleView(m.file_url)}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button className="btn btn-icon btn-ghost" style={{ color: 'green' }} onClick={() => handleApprove(m.id)}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan="4">No pending materials.</td></tr>}
                  </tbody>
                </table>
              )}

              {/* 2. MANAGE CONTENT TABLE (Approved Materials) */}
              {activeTab === 'tab-content' && (
                  <table>
                    <thead>
                      <tr><th>Title</th><th>Author</th><th>Downloads</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                    </thead>
                    <tbody>
                      {approvedMaterials.map((m) => ( // Use approvedMaterials here
                        <tr key={m.id}>
                          <td>{m.title}</td>
                          <td>{m.author}</td>
                          <td>{m.download_count}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn btn-sm btn-destructive" onClick={() => handleRemove(m.id)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              

              {/* 3. USERS MANAGEMENT TABLE */}
              {activeTab === 'tab-users' && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td style={{textTransform: 'capitalize'}}>{u.role}</td>
                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;