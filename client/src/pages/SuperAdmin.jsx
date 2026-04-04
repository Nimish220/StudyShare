import React, { useState, useEffect } from 'react';
import { dummyUsers } from '../constants';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('tab-overview');
  const [user, setUser] = useState({ name: 'Anonymous' });

  useEffect(() => {
    const savedUser = localStorage.getItem('studyshare_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <main>
      <div className="container dashboard-page">
        <h1>Super Admin Dashboard</h1>
        <p className="subtitle">Full control panel — Welcome, <span id="sa-name">{user.name}</span></p>

        {/* 1. Stat Cards Section */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div className="value">8,200</div>
            <div className="label">Total Users</div>
            <div className="change">+85 this week</div>
          </div>
          <div className="stat-card">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div className="value">12</div>
            <div className="label">Active Admins</div>
            <div className="change">+2 this month</div>
          </div>
          <div className="stat-card">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <div className="value">12,400</div>
            <div className="label">Total Materials</div>
            <div className="change">+120 this week</div>
          </div>
          <div className="stat-card">
            <div className="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></div>
            <div className="value">95,000</div>
            <div className="label">Total Downloads</div>
            <div className="change">+2,300 this week</div>
          </div>
        </div>

        {/* 2. Tabs Navigation */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'tab-overview' ? 'active' : ''}`} onClick={() => setActiveTab('tab-overview')}>Overview</button>
          <button className={`tab ${activeTab === 'tab-manage-users' ? 'active' : ''}`} onClick={() => setActiveTab('tab-manage-users')}>Manage Users</button>
          <button className={`tab ${activeTab === 'tab-analytics' ? 'active' : ''}`} onClick={() => setActiveTab('tab-analytics')}>Analytics</button>
        </div>

        {/* 3. Tab Content: Overview */}
        {activeTab === 'tab-overview' && (
          <div className="tab-content active">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="quick-actions-card">
                <h2>Quick Actions</h2>
                <div className="quick-actions-buttons">
                  <button className="btn btn-primary" onClick={() => setActiveTab('tab-manage-users')}>Add Admin</button>
                  <button className="btn btn-outline" onClick={() => setActiveTab('tab-manage-users')}>Manage Users</button>
                  <button className="btn btn-outline" onClick={() => setActiveTab('tab-analytics')}>View Analytics</button>
                </div>
              </div>
              <div className="overview-card">
                <h2>Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="activity-item"><div className="activity-dot"></div><span className="activity-text">User123 uploaded 'Organic Chemistry Notes'</span><span className="activity-time">1h ago</span></div>
                  <div className="activity-item"><div className="activity-dot"></div><span className="activity-text">Anonymous approved 3 pending materials</span><span className="activity-time">2h ago</span></div>
                  <div className="activity-item"><div className="activity-dot"></div><span className="activity-text">XYZ registered a new account</span><span className="activity-time">3h ago</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Tab Content: Manage Users */}
        {activeTab === 'tab-manage-users' && (
          <div className="tab-content active">
            <div className="table-card">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Uploads</th><th>Downloads</th><th>Joined</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {dummyUsers.map((u, i) => (
                      <tr key={i}>
                        <td>{u.name}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                        <td>{u.uploads}</td>
                        <td>{u.downloads}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{u.joined}</td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn btn-sm btn-outline">Edit</button>
                            <button className="btn btn-sm btn-destructive">Deactivate</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. Tab Content: Analytics */}
        {activeTab === 'tab-analytics' && (
          <div className="tab-content active">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="overview-card">
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Monthly Uploads</h3>
                <div className="bar-chart">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div className="bar-row" key={month}>
                      <span className="bar-label">{month}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(i + 4) * 15}%` }}></div>
                      </div>
                      <span className="bar-value">{120 + (i * 30)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="overview-card">
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Monthly Downloads</h3>
                <div className="bar-chart">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div className="bar-row" key={month}>
                      <span className="bar-label">{month}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(i + 5) * 12}%` }}></div>
                      </div>
                      <span className="bar-value">{(3400 + (i * 800)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SuperAdmin;