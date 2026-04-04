import React, { useState } from 'react';
import { materials, dummyUsers } from '../constants';
const AdminDashboard = () => {
  // State to manage tab switching
  const [activeTab, setActiveTab] = useState('tab-pending');
  const [currentMaterials, setCurrentMaterials] = useState(materials);
  return (
    <div className="page-wrapper">
      <main>
        <div className="container dashboard-page">
          <h1>Admin Dashboard</h1>
          <p className="subtitle">
            Welcome, <span id="admin-name">Anonymous</span>. Manage content and users.
          </p>

          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="value">12,400</div>
              <div className="label">Total Materials</div>
            </div>

            <div className="stat-card">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="value">8,200</div>
              <div className="label">Total Users</div>
            </div>

            <div className="stat-card">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="value">95,000</div>
              <div className="label">Total Downloads</div>
            </div>

            <div className="stat-card">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="value">23</div>
              <div className="label">Pending Reviews</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'tab-pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-pending')}
            >
              Pending Approvals
            </button>
            <button 
              className={`tab ${activeTab === 'tab-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-content')}
            >
              Manage Content
            </button>
            <button 
              className={`tab ${activeTab === 'tab-users' ? 'active' : ''}`}
              onClick={() => setActiveTab('tab-users')}
            >
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
                  <tbody id="pending-tbody">
                    {currentMaterials.slice(0, 5).map((m) => (
                      <tr key={m.id}>
                        <td><strong>{m.title}</strong></td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.author}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.category}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-icon btn-ghost" style={{ color: 'var(--primary)' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button 
                              className="btn btn-icon btn-ghost" 
                              style={{ color: 'green' }}
                              onClick={() => setCurrentMaterials(currentMaterials.filter(item => item.id !== m.id))}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

          {activeTab === 'tab-content' && (
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Downloads</th>
                      <th>Rating</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="content-tbody">
                    {currentMaterials.map((m) => (
                      <tr key={m.id}>
                        <td>{m.title}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.author}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.downloads}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{m.rating}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-sm btn-outline">Edit</button>
                            <button 
                              className="btn btn-sm btn-destructive"
                              onClick={() => setCurrentMaterials(currentMaterials.filter(item => item.id !== m.id))}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

          {activeTab === 'tab-users' && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Uploads</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody id="users-tbody">
                    {dummyUsers.map((u, index) => (
                      <tr key={index}>
                        <td>{u.name}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{u.uploads}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{u.joined}</td>
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