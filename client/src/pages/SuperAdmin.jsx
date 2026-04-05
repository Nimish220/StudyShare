import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, ShieldCheck, FileText, Download, Activity, 
  RefreshCw, Settings, Trash2, UserPlus, ShieldAlert, BarChart3 
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
    primary: '#5d4037', // Deep Brown
    secondary: '#8d6e63', // Soft Brown
    accent: '#d7ccc8', // Light Tan
    bg: '#fafafa', // Soft White
    white: '#ffffff',
    text: '#3e2723'
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
    if (window.confirm(`Update role to ${newRole}?`)) {
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
            <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold', color: theme.primary }}>Super Admin Console</h1>
            <p style={{ color: theme.secondary, fontSize: '1.1rem' }}>Welcome back, {adminUser.username}</p>
          </div>
          <button 
            onClick={fetchSuperDashboardData} 
            style={{ padding: '12px 20px', borderRadius: '50px', border: `1px solid ${theme.accent}`, background: theme.white, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: theme.primary }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Updating...' : 'Refresh Metrics'}
          </button>
        </header>

        {/* STATS SECTION WITH GRAPHS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '50px' }}>
          <StatBox icon={<Users />} label="Users" value={stats.totalUsers} percent={85} theme={theme} />
          <StatBox icon={<ShieldCheck />} label="Admins" value={stats.activeAdmins} percent={40} theme={theme} />
          <StatBox icon={<FileText />} label="Notes" value={stats.totalMaterials} percent={65} theme={theme} />
          <StatBox icon={<Download />} label="Impact" value={stats.totalDownloads} percent={95} theme={theme} />
        </div>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', gap: '40px', borderBottom: `1px solid ${theme.accent}`, marginBottom: '30px' }}>
          <TabNav label="Overview" active={activeTab === 'tab-overview'} onClick={() => setActiveTab('tab-overview')} theme={theme} />
          <TabNav label="User Directory" active={activeTab === 'tab-manage-users'} onClick={() => setActiveTab('tab-manage-users')} theme={theme} />
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'tab-overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
            {/* Action Panel */}
            <div style={{ background: theme.white, padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(93,64,55,0.05)' }}>
              <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={20}/> System Controls</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <ControlBtn label="Manage Roles" icon={<UserPlus size={18}/>} theme={theme} onClick={() => setActiveTab('tab-manage-users')} primary />
                <ControlBtn label="Run Maintenance" icon={<Activity size={18}/>} theme={theme} />
                <ControlBtn label="Clear Archive" icon={<Trash2 size={18}/>} theme={theme} />
              </div>
            </div>

            {/* Graphical Log Feed */}
            <div style={{ background: theme.white, padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(93,64,55,0.05)' }}>
              <h3 style={{ marginBottom: '25px' }}>Live Activity Stream</h3>
              <div style={{ borderLeft: `2px solid ${theme.accent}`, marginLeft: '10px', paddingLeft: '20px' }}>
                {stats.recentActivity?.length > 0 ? stats.recentActivity.map((act, i) => (
                  <div key={i} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-27px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: theme.primary, border: `3px solid ${theme.white}` }} />
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{act.log_text}</div>
                    <div style={{ fontSize: '0.8rem', color: theme.secondary }}>{act.time_ago}</div>
                  </div>
                )) : <p>No events logged.</p>}
              </div>
            </div>
          </div>
        )}

        {/* USER LIST CONTENT */}
        {activeTab === 'tab-manage-users' && (
          <div style={{ background: theme.white, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(93,64,55,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: theme.primary, color: theme.white }}>
                <tr>
                  <th style={{ padding: '20px', textAlign: 'left' }}>Identify</th>
                  <th style={{ textAlign: 'left' }}>Clearance</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${theme.accent}` }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ fontWeight: 'bold' }}>{u.username}</div>
                      <div style={{ fontSize: '0.8rem', color: theme.secondary }}>{u.email}</div>
                    </td>
                    <td>
                      <span style={{ padding: '5px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 'bold', background: u.role === 'admin' ? theme.primary : theme.accent, color: u.role === 'admin' ? theme.white : theme.primary }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <button 
                        onClick={() => handleToggleAdmin(u.id, u.role)}
                        disabled={u.role === 'superadmin'}
                        style={{ padding: '8px 15px', borderRadius: '5px', border: `1px solid ${theme.primary}`, background: 'none', color: theme.primary, cursor: 'pointer', opacity: u.role === 'superadmin' ? 0.3 : 1 }}
                      >
                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

// --- GRAPHICAL COMPONENTS ---

const StatBox = ({ icon, label, value, percent, theme }) => (
  <div style={{ background: theme.white, padding: '25px', borderRadius: '20px', border: `1px solid ${theme.accent}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ color: theme.primary }}>{icon}</div>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{value}</div>
    </div>
    <div>
      <div style={{ fontSize: '0.9rem', color: theme.secondary, marginBottom: '5px' }}>{label} Growth</div>
      {/* GRAPHICAL PROGRESS BAR */}
      <div style={{ width: '100%', height: '6px', background: theme.accent, borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: theme.primary }} />
      </div>
    </div>
  </div>
);

const TabNav = ({ label, active, onClick, theme }) => (
  <button 
    onClick={onClick}
    style={{ padding: '15px 5px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: active ? 'bold' : 'normal', color: active ? theme.primary : theme.secondary, borderBottom: active ? `3px solid ${theme.primary}` : 'none' }}
  >
    {label}
  </button>
);

const ControlBtn = ({ label, icon, theme, onClick, primary }) => (
  <button 
    onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', borderRadius: '12px', border: `1px solid ${theme.primary}`, background: primary ? theme.primary : theme.white, color: primary ? theme.white : theme.primary, cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
  >
    {icon} {label}
  </button>
);

export default SuperAdmin;