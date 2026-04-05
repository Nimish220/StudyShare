import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, ShieldCheck, FileText, Download, Activity, 
  RefreshCw, Settings, UserPlus, BarChart3, Clock, 
  CheckCircle2, UploadCloud, ShieldAlert, Trash2 
} from 'lucide-react';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('tab-overview');
  const [adminUser, setAdminUser] = useState({ username: 'Super Admin' });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, activeAdmins: 0, totalMaterials: 0, totalDownloads: 0, recentActivity: []
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const theme = {
    primary: '#5d4037', secondary: '#8d6e63', accent: '#d7ccc8', bg: '#ffffff', card: '#fcfaf9', text: '#3e2723'
  };

  const fetchSuperDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/super/stats', { headers }),
        axios.get('http://localhost:5001/api/super/users', { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Session Sync Error: Your role may have changed. Please log out and back in.");
      }
      console.error("Fetch Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('studyshare_user');
    if (savedUser) setAdminUser(JSON.parse(savedUser));
    fetchSuperDashboardData();
  }, []);

  const handleToggleAdmin = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (window.confirm(`Update role to ${newRole.toUpperCase()}?`)) {
      try {
        await axios.patch(`http://localhost:5001/api/super/role/${userId}`, { role: newRole }, { headers });
        fetchSuperDashboardData(); 
      } catch (err) { alert("Error updating role"); }
    }
  };

  return (
    <main style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: 'serif' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: theme.primary }}>Super Admin Dashboard</h1>
            <p style={{ color: theme.secondary, fontSize: '1rem', fontFamily: 'sans-serif' }}>System Authority — Welcome, <b>{adminUser.username}</b></p>
          </div>
          <button 
            onClick={fetchSuperDashboardData} 
            style={{ padding: '12px 24px', borderRadius: '8px', border: `1.5px solid ${theme.primary}`, background: theme.white, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: theme.primary, fontWeight: 'bold' }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Refresh Metrics'}
          </button>
        </header>

        {/* STATS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          <StatBox icon={<Users />} label="Total Users" value={stats.totalUsers} percent={80} theme={theme} />
          <StatBox icon={<ShieldCheck />} label="Active Admins" value={stats.activeAdmins} percent={35} theme={theme} />
          <StatBox icon={<FileText />} label="Materials" value={stats.totalMaterials} percent={60} theme={theme} />
          <StatBox icon={<Download />} label="Downloads" value={stats.totalDownloads} percent={90} theme={theme} />
        </div>

        {/* TAB NAVIGATION */}
        <div style={{ display: 'flex', gap: '40px', borderBottom: `1px solid ${theme.accent}`, marginBottom: '30px' }}>
          <TabNav label="Overview" active={activeTab === 'tab-overview'} onClick={() => setActiveTab('tab-overview')} theme={theme} />
          <TabNav label="Manage Users" active={activeTab === 'tab-manage-users'} onClick={() => setActiveTab('tab-manage-users')} theme={theme} />
          <TabNav label="Analytics" active={activeTab === 'tab-analytics'} onClick={() => setActiveTab('tab-analytics')} theme={theme} />
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'tab-overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
            
            {/* System Controls */}
            <div style={{ background: theme.card, padding: '30px', borderRadius: '15px', border: `1px solid ${theme.accent}` }}>
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={20}/> System Controls</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <ControlBtn label="Add Admin" icon={<UserPlus size={18}/>} theme={theme} onClick={() => setActiveTab('tab-manage-users')} primary />
                <ControlBtn label="Manage Users" icon={<Users size={18}/>} theme={theme} onClick={() => setActiveTab('tab-manage-users')} />
                <ControlBtn label="View Analytics" icon={<BarChart3 size={18}/>} theme={theme} onClick={() => setActiveTab('tab-analytics')} />
                <ControlBtn label="Run Maintenance" icon={<Activity size={18}/>} theme={theme} onClick={() => axios.post('http://localhost:5001/api/super/maintenance', {}, {headers}).then(fetchSuperDashboardData)} />
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: theme.white, padding: '30px', borderRadius: '15px', border: `1px solid ${theme.accent}` }}>
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20}/> Recent Activity</h3>
              <div style={{ borderLeft: `2px solid ${theme.accent}`, marginLeft: '10px', paddingLeft: '20px' }}>
                {stats.recentActivity?.length > 0 ? stats.recentActivity.map((act, i) => (
                  <div key={i} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-31px', top: '2px', background: theme.bg, padding: '2px' }}>
                         {act.log_text.toLowerCase().includes('uploaded') ? (
                            <UploadCloud size={16} color={theme.primary}/> 
                         ) : act.log_text.toLowerCase().includes('approved') ? (
                            <CheckCircle2 size={16} color={theme.primary}/>
                         ) : act.log_text.toLowerCase().includes('removed') ? (
                            <Trash2 size={16} color={theme.primary}/>
                         ) : (
                            <ShieldAlert size={16} color={theme.primary}/>
                         )}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: theme.primary }}>{act.log_text}</div>
                    <div style={{ fontSize: '0.8rem', color: theme.secondary, fontFamily: 'sans-serif' }}>{act.time_ago} • Verified System Action</div>
                  </div>
                )) : <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No system events logged recently.</div>}
              </div>
            </div>
          </div>
        )}

        {/* USER LIST CONTENT */}
        {activeTab === 'tab-manage-users' && (
          <div style={{ background: theme.white, borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.accent}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: theme.white, borderBottom: `2.5px solid ${theme.primary}` }}>
                <tr>
                  <th style={{ padding: '20px', textAlign: 'left', color: theme.primary, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Identify</th>
                  <th style={{ textAlign: 'left', color: theme.primary, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Clearance</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px', color: theme.primary, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${theme.accent}` }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 'bold' }}>{u.username}</div>
                      <div style={{ fontSize: '0.8rem', color: theme.secondary, fontFamily: 'sans-serif' }}>{u.email}</div>
                    </td>
                    <td>
                      <span style={{ padding: '5px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', background: u.role === 'admin' ? theme.primary : theme.accent, color: u.role === 'admin' ? theme.white : theme.primary }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <button 
                        onClick={() => handleToggleAdmin(u.id, u.role)}
                        disabled={u.role === 'superadmin'}
                        style={{ padding: '8px 16px', borderRadius: '5px', border: `1.5px solid ${theme.primary}`, background: u.role === 'admin' ? theme.primary : 'none', color: u.role === 'admin' ? theme.white : theme.primary, cursor: 'pointer', fontWeight: 'bold', opacity: u.role === 'superadmin' ? 0.3 : 1 }}
                      >
                        {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS CONTENT */}
        {activeTab === 'tab-analytics' && (
          <div style={{ background: theme.white, padding: '40px', borderRadius: '15px', border: `1px solid ${theme.accent}`, textAlign: 'center' }}>
            <BarChart3 size={48} color={theme.primary} style={{ marginBottom: '20px' }}/>
            <h2 style={{ color: theme.primary }}>System Analytics</h2>
            <p style={{ color: theme.secondary, marginBottom: '30px' }}>Graphical data representation of StudyShare growth.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: theme.card, borderRadius: '12px', border: `1px solid ${theme.accent}` }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Platform Activity Trends</h4>
                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '15px', justifyContent: 'center' }}>
                  <div style={{ width: '35px', height: '40%', background: theme.primary, borderRadius: '4px' }}></div>
                  <div style={{ width: '35px', height: '70%', background: theme.primary, borderRadius: '4px' }}></div>
                  <div style={{ width: '35px', height: '90%', background: theme.primary, borderRadius: '4px' }}></div>
                  <div style={{ width: '35px', height: '65%', background: theme.primary, borderRadius: '4px' }}></div>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '10px', color: theme.secondary }}>Quarterly Growth (%)</p>
              </div>
              
              <div style={{ padding: '20px', background: theme.card, borderRadius: '12px', border: `1px solid ${theme.accent}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0' }}>Engagement Ratio</h4>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: theme.primary, margin: '15px 0' }}>
                  {stats.totalUsers > 0 ? (stats.totalDownloads / stats.totalUsers).toFixed(1) : 0}
                </div>
                <p style={{ fontSize: '0.85rem', color: theme.secondary }}>Avg Downloads per User</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// --- GRAPHICAL COMPONENTS ---
const StatBox = ({ icon, label, value, percent, theme }) => (
  <div style={{ background: theme.card, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.accent}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
      <div style={{ color: theme.primary }}>{icon}</div>
      <div style={{ fontWeight: '900', fontSize: '1.5rem' }}>{value}</div>
    </div>
    <div style={{ fontSize: '0.8rem', color: theme.secondary, marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ width: '100%', height: '4px', background: theme.accent, borderRadius: '10px' }}>
      <div style={{ width: `${percent}%`, height: '100%', background: theme.primary, borderRadius: '10px' }} />
    </div>
  </div>
);

const TabNav = ({ label, active, onClick, theme }) => (
  <button 
    onClick={onClick}
    style={{ padding: '15px 0', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: active ? 'bold' : 'normal', color: active ? theme.primary : theme.secondary, borderBottom: active ? `3px solid ${theme.primary}` : 'none' }}
  >
    {label}
  </button>
);

const ControlBtn = ({ label, icon, theme, onClick, primary }) => (
  <button 
    onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '8px', border: `1.5px solid ${theme.primary}`, background: primary ? theme.primary : theme.white, color: primary ? theme.white : theme.primary, cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
  >
    {icon} {label}
  </button>
);

export default SuperAdmin;