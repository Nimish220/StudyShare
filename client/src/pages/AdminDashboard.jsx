import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const palette = {
  bg: '#FCFAF9',
  white: '#FFFFFF',
  accent: '#5D4037',
  textMain: '#2C1B18',
  textSub: '#7A6A67',
  border: '#E8E2E0',
  pending: '#E67E22',
  success: '#27AE60',
  danger: '#C0392B'
};

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('tab-pending');
  const [currentMaterials, setCurrentMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalMaterials: 0, totalUsers: 0, totalDownloads: 0, pendingReviews: 0 });
  const [approvedMaterials, setApprovedMaterials] = useState([]);
  const [reportedMaterials, setReportedMaterials] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const token = sessionStorage.getItem('token');
  const adminData = JSON.parse(sessionStorage.getItem('studyshare_user'));
  const headers = { Authorization: `Bearer ${token}` };
  const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, usersRes, approvedRes, logsRes,reportedRes] = await Promise.all([
        axios.get(`${API_BASE}/stats`, { headers }),
        axios.get(`${API_BASE}/pending`, { headers }),
        axios.get(`${API_BASE}/users`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/materials/explore`, { headers }),
        axios.get(`${API_BASE}/logs`, { headers }),
        axios.get(`${API_BASE}/reported-materials`, { headers })
      ]);
      setStats(statsRes.data);
      setCurrentMaterials(pendingRes.data);
      setUsers(usersRes.data);
      setApprovedMaterials(approvedRes.data);
      setSystemLogs(logsRes.data);
      setReportedMaterials(reportedRes.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'content') setActiveTab('tab-content');
    else if (tabParam === 'users') setActiveTab('tab-users');
    else if (tabParam === 'history') setActiveTab('tab-history'); // Added history tab state check
    else if (tabParam === 'flagged') setActiveTab('tab-flagged');
    else setActiveTab('tab-pending');
  }, [location]);

  useEffect(() => { fetchDashboardData(); }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_BASE}/approve/${id}`, {}, { headers });
      fetchDashboardData();
    } catch (err) { alert("Error approving material"); }
  };

  const handleRemove = async (id) => {
    if (window.confirm("Remove this content permanently?")) {
      try {
        await axios.delete(`${API_BASE}/material/${id}`, { headers });
        fetchDashboardData();
      } catch (err) { alert("Error removing material"); }
    }
  };
  const handleManageReport = async (id, action) => {
    const confirmMsg = action === 'reject' ? "Reject this material and remove it from Browse?" : "Dismiss all reports and keep this material?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.post(`${API_BASE}/handle-report`, { material_id: id, action }, { headers });
      fetchDashboardData();
    } catch (err) { alert("Error handling report"); }
  };

  const MobileCard = ({ title, subtitle, info, actionLabel, onAction, actionColor, onView, hideAction = false,secondaryActionLabel, onSecondaryAction, secondaryColor }) => (
    <div style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: `1px solid ${palette.border}` }}>
      <div style={{ fontWeight: 'bold', fontSize: '1rem', color: palette.textMain }}>{title}</div>
      <div style={{ fontSize: '0.85rem', color: palette.textSub }}>{subtitle}</div>
      <div style={{ fontSize: '0.85rem', marginTop: '5px', fontWeight: '600' }}>{info}</div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
        {onView && <button onClick={onView} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${palette.accent}`, color: palette.accent, background: 'none', cursor: 'pointer' }}>View</button>}
        {!hideAction && <button onClick={onAction} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: actionColor, color: 'white', cursor: 'pointer' }}>{actionLabel}</button>}
        {onSecondaryAction && <button onClick={onSecondaryAction} style={{ flex: '1 1 100%', padding: '8px', borderRadius: '6px', border: 'none', background: secondaryColor || palette.success, color: 'white', cursor: 'pointer' }}>{secondaryActionLabel}</button>}
      </div>
    </div>
  );

  const isMobile = width < 768;

  return (
    <div style={{ backgroundColor: palette.bg, minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        
              <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', color: palette.textMain, fontFamily: 'serif', margin: 0 }}>Admin Dashboard</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                    <p style={{ color: palette.textSub, margin: 0 }}>
                      Hello, <strong>{adminData?.username || "Admin"}</strong>
                    </p>
                    {/* Role Badge for visual clarity */}
                    <span style={{ 
                      fontSize: '10px', 
                      padding: '2px 8px', 
                      backgroundColor: adminData?.role === 'superadmin' ? '#8e44ad' : palette.accent, 
                      color: 'white', 
                      borderRadius: '10px', 
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px'
                    }}>
                      {adminData?.role || 'Admin'}
                    </span>
                  </div>
                </div>
              </header>
        {/* STATS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {[
            { label: 'Materials', val: stats.totalMaterials, color: palette.accent },
            { label: 'Users', val: stats.totalUsers, color: palette.accent },
            { label: 'Downloads', val: stats.totalDownloads, color: palette.accent },
            { label: 'Pending', val: stats.pendingReviews, color: palette.pending },
            { label: 'Flagged Content', val: reportedMaterials.length, color: palette.danger }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '15px', border: `1px solid ${palette.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.8rem', color: palette.textSub, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
          {['pending','flagged', 'content', 'users', 'history'].map((t) => (
            <button 
              key={t}
              onClick={() => setActiveTab(`tab-${t}`)}
              style={{ 
                padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === `tab-${t}` ? (t === 'flagged' ? palette.danger : palette.accent) : palette.white,
                color: activeTab === `tab-${t}` ? 'white' : palette.textSub,
                fontWeight: '600'
              }}
            >
              {t === 'flagged' ? `🚩 Flagged (${reportedMaterials.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '15px', border: `1px solid ${palette.border}`, padding: '20px' }}>
          {loading ? <p style={{textAlign: 'center'}}>Loading data...</p> : (
            <>
              {!isMobile ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: `2px solid ${palette.bg}` }}>
                      <th style={{ padding: '12px' }}>Details</th>
                      <th>{activeTab === 'tab-users' ? 'Role' : activeTab === 'tab-history' ? 'Time' : 'Author'}</th>
                      <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'tab-pending' && currentMaterials.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${palette.bg}` }}>
                        <td style={{ padding: '12px' }}><strong>{m.title}</strong><br/><small>{m.category}</small></td>
                        <td>{m.author}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)} style={{ marginRight: '10px', color: palette.accent, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                          <button onClick={() => handleApprove(m.id)} style={{ color: palette.success, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Approve</button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'tab-flagged' && reportedMaterials.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${palette.bg}` }}>
                        <td style={{ padding: '12px' }}>
                            <strong style={{color: palette.danger}}>{m.title}</strong><br/>
                            <small>🚩 {m.report_count} Reports | {m.category}</small>
                        </td>
                        <td>{m.author || m.uploader_name}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)} style={{ marginRight: '10px', color: palette.accent, background: 'none', border: 'none', cursor: 'pointer' }}>Check</button>
                          <button onClick={() => handleManageReport(m.id, 'dismiss')} style={{ marginRight: '10px', color: palette.success, background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
                          <button onClick={() => handleManageReport(m.id, 'reject')} style={{ color: palette.danger, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'tab-content' && approvedMaterials.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${palette.bg}` }}>
                        <td style={{ padding: '12px' }}><strong>{m.title}</strong><br/><small>{m.category}</small></td>
                        <td>{m.author}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)} style={{ marginRight: '10px', color: palette.accent, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
                          <button onClick={() => handleRemove(m.id)} style={{ color: palette.danger, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                        </td>
                      </tr>
                    ))}
                    {activeTab === 'tab-users' && users.filter(u => u.role === 'student').map(u => (
                      <tr key={u.id} style={{ borderBottom: `1px solid ${palette.bg}` }}>
                        <td style={{ padding: '12px' }}><strong>{u.username}</strong><br/><small>{u.email}</small></td>
                        <td>{u.role.toUpperCase()}</td>
                        <td style={{ textAlign: 'right', color: palette.textSub, fontSize: '0.85rem' }}>Managed by SuperAdmin</td>
                      </tr>
                    ))}
                    {activeTab === 'tab-history' && systemLogs.map(log => (
                      <tr key={log.id} style={{ borderBottom: `1px solid ${palette.bg}` }}>
                        <td style={{ padding: '12px' }}><strong>{log.action_text}</strong></td>
                        <td>{new Date(log.created_at).toLocaleTimeString()}</td>
                        <td style={{ textAlign: 'right', color: palette.textSub }}>{new Date(log.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  {activeTab === 'tab-pending' && currentMaterials.map(m => (
                    <MobileCard key={m.id} title={m.title} subtitle={m.author} info={m.category} actionLabel="Approve" onAction={() => handleApprove(m.id)} actionColor={palette.success} onView={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)}/>
                  ))}
                  {activeTab === 'tab-flagged' && reportedMaterials.map(m => (
                    <MobileCard key={m.id} title={`🚩 ${m.title}`} subtitle={`Uploader: ${m.author || m.uploader_name || 'System'}`} info={`${m.report_count} Reports`} actionLabel="Remove" onAction={() => handleManageReport(m.id, 'reject')} actionColor={palette.danger} secondaryActionLabel="Dismiss" onSecondaryAction={() => handleManageReport(m.id, 'dismiss')}
                        secondaryColor={palette.success} onView={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)}/>
                  ))}
                  {activeTab === 'tab-content' && approvedMaterials.map(m => (
                    <MobileCard key={m.id} title={m.title} subtitle={m.author} info={`${m.download_count} Downloads`} actionLabel="Remove" onAction={() => handleRemove(m.id)} actionColor={palette.danger} onView={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)}/>
                  ))}
                  {activeTab === 'tab-users' && users.filter(u => u.role === 'student').map(u => (
                    <MobileCard key={u.id} title={u.username} subtitle={u.email} info={`Role: ${u.role.toUpperCase()}`} actionLabel="Managed by Super" onAction={() => {}} actionColor={palette.border} hideAction={true}/>
                  ))}
                  {activeTab === 'tab-history' && systemLogs.map(log => (
                    <div key={log.id} style={{ background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: `1px solid ${palette.border}` }}>
                      <div style={{ fontWeight: 'bold', color: palette.textMain }}>{log.action_text}</div>
                      <div style={{ fontSize: '0.85rem', color: palette.textSub, marginTop: '5px' }}>
                        Admin ID: {log.admin_id} • {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;