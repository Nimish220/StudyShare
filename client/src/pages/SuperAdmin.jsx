import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, ShieldCheck, FileText, Download, Activity, 
  RefreshCw, Settings, BarChart3, Clock, 
  CheckCircle2, UploadCloud, ShieldAlert, Trash2, ChevronRight,
  ChevronLeft, Filter, Search, X, UserPlus, ShieldPlus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
const SuperAdmin = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('tab-overview');
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({ username: 'Super Admin' });
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, activeAdmins: 0, totalMaterials: 0, totalDownloads: 0,flaggedCount: 0, recentActivity: []
  });
  
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'student' });
  const [reportedMaterials, setReportedMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlightAction, setHighlightAction] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const pollTimer = useRef(null);

  const theme = {
    primary: '#5d4037', secondary: '#8d6e63', accent: '#d7ccc8', 
    bg: '#ffffff', card: '#fcfaf9', text: '#3e2723', white: '#ffffff', danger: '#d32f2f', success: '#2e7d32'
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'manage-users') setActiveTab('tab-manage-users');
    else if (tabParam === 'moderation') setActiveTab('tab-moderation');
    else if (tabParam === 'analytics') setActiveTab('tab-analytics');
    else setActiveTab('tab-overview');
  }, [location]);

  const fetchSuperDashboardData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [statsRes, usersRes,reportedRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/super/stats`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/super/users`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/reported-materials`, { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setReportedMaterials(reportedRes.data);
    } catch (err) { console.error("Fetch Error:", err); }
    finally { setTimeout(() => setLoading(false), 600); }
  }, []);

  // --- FILTER & PAGINATION LOGIC ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('studyshare_user');
    if (savedUser) setAdminUser(JSON.parse(savedUser));
    fetchSuperDashboardData();
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(fetchSuperDashboardData, 30000);
    return () => clearInterval(pollTimer.current);
  }, [fetchSuperDashboardData]);

  // --- ACTIONS ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/super/create-user`, newUser, { headers: { Authorization: `Bearer ${token}` } });
      setShowCreateModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'student' });
      fetchSuperDashboardData();
    } catch (err) { alert("Creation failed: " + err.response?.data?.message); }
  };

  const handleUpdateRole = async (userId, newRole) => {
    const token = sessionStorage.getItem('token');
    if (window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/super/role/${userId}`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
        fetchSuperDashboardData();
      } catch (err) { alert("Role update failed"); }
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = sessionStorage.getItem('token');
    if (window.confirm("CRITICAL: Delete this user permanently?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/super/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchSuperDashboardData();
      } catch (err) { alert("Delete failed"); }
    }
  };
    // 1. Add this handler function
  const handleModeration = async (id, action) => {
    const token = sessionStorage.getItem('token');
    const confirmMsg = action === 'reject' ? "Reject and remove this content?" : "Dismiss all reports?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/handle-report`, 
        { material_id: id, action }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSuperDashboardData(); // Refresh everything
    } catch (err) { alert("Moderation failed"); }
  };

  return (
    <main style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: 'serif', paddingBottom: '50px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, color: theme.primary }}>System Control</h1>
            <p style={{ color: theme.secondary, fontFamily: 'sans-serif', margin: '5px 0' }}>Welcome, <b>{adminUser.username || 'Super Admin'}</b></p>
          </div>
          <button onClick={fetchSuperDashboardData} disabled={loading} style={{ padding: '10px 20px', borderRadius: '30px', border: `1px solid ${theme.accent}`, background: theme.white, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: theme.primary, fontWeight: 'bold' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Syncing...' : 'Refresh Metrics'}
          </button>
        </header>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '40px' }}>
          <StatLine icon={<Users />} label="Users" value={stats.totalUsers} theme={theme} />
          <StatLine icon={<ShieldCheck />} label="Admins" value={stats.activeAdmins} theme={theme} />
          <StatLine icon={<FileText />} label="Materials" value={stats.totalMaterials} theme={theme} />
          <StatLine icon={<Download />} label="Downloads" value={stats.totalDownloads} theme={theme} />
          <StatLine icon={<ShieldAlert color={stats.flaggedCount > 0 ? theme.danger : theme.success} />} label="Flagged" value={stats.flaggedCount || 0} theme={theme} />
        </div>

        {/* TABS */}
      <div style={{ display: 'flex', gap: '25px', borderBottom: `1px solid ${theme.accent}`, marginBottom: '25px', overflowX: 'auto' }}>
        {['Overview', 'Manage Users', 'Moderation', 'Analytics'].map(tab => ( // Added 'Moderation'
          <button key={tab} onClick={() => setActiveTab(`tab-${tab.toLowerCase().replace(' ', '-')}`)}
            style={{ 
              padding: '12px 5px', border: 'none', background: 'none', cursor: 'pointer', 
              color: activeTab.includes(tab.toLowerCase().replace(' ', '-')) ? theme.primary : theme.secondary, 
              borderBottom: activeTab.includes(tab.toLowerCase().replace(' ', '-')) ? `2px solid ${theme.primary}` : 'none', 
              fontWeight: 'bold', whiteSpace: 'nowrap' 
            }}
          >{tab}</button>
        ))}
      </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'tab-overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            <div style={{ background: theme.card, padding: '25px', borderRadius: '16px', border: `1px solid ${theme.accent}` }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem' }}><Settings size={18}/> Management Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ControlBtn label="Create New User" icon={<UserPlus size={18}/>} theme={theme} onClick={() => setShowCreateModal(true)} primary />
                <ControlBtn label="Manage Users" icon={<Users size={18}/>} theme={theme} onClick={() => navigate('/superadmin?tab=manage-users')} />
              </div>
            </div>

            <div style={{ background: theme.white, padding: '25px', borderRadius: '16px', border: `1px solid ${theme.accent}`, cursor: 'pointer' }} onClick={() => setShowLogsModal(true)}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, fontSize: '1.1rem' }}><Clock size={18}/> System Logs</h3>
              <div style={{ maxHeight: '200px', overflow: 'hidden', opacity: 0.8 }}>
                {stats.recentActivity?.slice(0, 5).map((act, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: `1px solid ${theme.card}`, fontSize: '0.8rem' }}>
                    <b>{act.log_text}</b> — {act.time_ago}
                  </div>
                ))}
                <p style={{ color: theme.primary, fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>View All Logs →</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tab-moderation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert color={theme.danger} /> Material Moderation Queue
            </h3>
            {reportedMaterials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: theme.card, borderRadius: '12px' }}>
                <CheckCircle2 size={48} color={theme.success} style={{ marginBottom: '10px', margin: '0 auto' }} />
                <p>No materials currently flagged. System is clean!</p>
              </div>
            ) : (
              reportedMaterials.map(m => (
                <div key={m.id} style={{ background: theme.white, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.accent}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{m.title}</div>
                    <div style={{ color: theme.danger, fontWeight: 'bold', fontSize: '0.85rem' }}>🚩 {m.report_count} Reports</div>
                    <div style={{ fontSize: '0.8rem', color: theme.secondary }}>Uploaded by: {m.uploader_name || m.author}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${m.file_url}`)} style={btnStyle(theme.primary)}>View</button>
                    <button onClick={() => handleModeration(m.id, 'dismiss')} style={btnStyle(theme.success)}>Dismiss</button>
                    <button onClick={() => handleModeration(m.id, 'reject')} style={{ ...btnStyle(theme.danger), background: theme.danger, color: 'white' }}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {/* --- TAB 3: MANAGE USERS WRAPPER --- */}
        {activeTab === 'tab-manage-users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', background: theme.card, padding: '15px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px', background: theme.white, padding: '8px 15px', borderRadius: '8px', border: `1px solid ${theme.accent}` }}>
                <Search size={16} color={theme.secondary}/>
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} />
              </div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.accent}` }}>
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Admins</option>
                <option value="superadmin">Superadmins</option>
              </select>
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${theme.accent}` }}>
                {[10, 20, 50, 100].map(v => <option key={v} value={v}>Show {v}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentUsers.map((u) => (
                <div key={u.id} style={{ background: theme.white, padding: '15px', borderRadius: '12px', border: `1px solid ${theme.accent}`, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{u.username}</div>
                    <div style={{ fontSize: '0.75rem', color: theme.secondary }}>{u.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', background: theme.accent }}>{u.role.toUpperCase()}</span>
                    
                    {u.role === 'student' && <button onClick={() => handleUpdateRole(u.id, 'admin')} style={btnStyle(theme.primary)}>Make Admin</button>}
                    {u.role === 'admin' && (
                      <>
                        <button onClick={() => handleUpdateRole(u.id, 'student')} style={btnStyle(theme.secondary)}>Demote</button>
                        <button onClick={() => handleUpdateRole(u.id, 'superadmin')} style={btnStyle(theme.primary)}>Make Super</button>
                      </>
                    )}
                    {u.role === 'superadmin' && u.id !== adminUser.id && (
                        <button 
                          onClick={() => handleUpdateRole(u.id, 'admin')} 
                          disabled={stats.totalSuperAdmins <= 1}
                          style={stats.totalSuperAdmins <= 1 ? btnDisabledStyle : btnStyle(theme.secondary)}
                        >
                          {stats.totalSuperAdmins <= 1 ? "Min 1 Super Required" : "Revoke Super"}
                        </button>
                      )}
                    <button onClick={() => handleDeleteUser(u.id)} style={{ color: theme.danger, border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}><ChevronLeft/></button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}><ChevronRight/></button>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: ANALYTICS WRAPPER --- */}
        {activeTab === 'tab-analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                
                <div style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.accent}`, height: '350px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18}/> User Composition
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Students', value: stats.totalUsers - stats.activeAdmins },
                          { name: 'Admins', value: stats.activeAdmins },
                        ]}
                        innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                      >
                        <Cell fill={theme.accent} />
                        <Cell fill={theme.primary} />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.accent}`, height: '350px' }}>
                  <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={18}/> System Activity
                  </h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={[
                      { name: 'Materials', count: stats.totalMaterials },
                      { name: 'Downloads', count: stats.totalDownloads }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="count" fill={theme.secondary} radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
        )}
      </div>

      {/* MODAL: CREATE USER */}
      {showCreateModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div style={modalContentStyle(theme)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Create Account</h2>
              <X onClick={() => setShowCreateModal(false)} style={{ cursor: 'pointer' }}/>
            </div>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" placeholder="Username" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={inputStyle(theme)} />
              <input type="email" placeholder="Email Address" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={inputStyle(theme)} />
              <input type="password" placeholder="Temporary Password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={inputStyle(theme)} />
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={inputStyle(theme)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <button type="submit" style={{ ...btnStyle(theme.primary), padding: '15px', color: 'white', background: theme.primary }}>Confirm Creation</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SYSTEM LOGS */}
      {showLogsModal && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle(theme), maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Full Activity Audit</h2>
              <X onClick={() => setShowLogsModal(false)} style={{ cursor: 'pointer' }}/>
            </div>
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {stats.recentActivity?.map((act, i) => {
                  const isRejected = act.log_text.includes('REJECTED');
                  const isCleared = act.log_text.includes('cleared reports');
                  
                  return (
                    <div key={i} style={{ padding: '15px 0', borderBottom: `1px solid ${theme.accent}`, display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {(isRejected || isCleared) ? (
                        <ShieldAlert size={18} color={isRejected ? theme.danger : theme.success} />
                      ) : (
                        <Activity size={16} color={theme.primary} />
                      )}
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{act.log_text}</div>
                        <div style={{ fontSize: '0.8rem', color: theme.secondary }}>{act.time_ago}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </main>
  );
};

// --- STYLES & HELPERS ---
const btnStyle = (color) => ({
  padding: '6px 12px', borderRadius: '6px', border: `1px solid ${color}`, 
  background: 'none', color: color, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold'
});

const inputStyle = (theme) => ({
  padding: '12px', borderRadius: '8px', border: `1px solid ${theme.accent}`, outline: 'none'
});

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle = (theme) => ({
  background: theme.white, padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '450px'
});

const StatLine = ({ icon, label, value, theme }) => (
  <div style={{ background: theme.card, padding: '18px 20px', borderRadius: '12px', border: `1px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ color: theme.primary }}>{icon}</div>
      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: theme.secondary }}>{label}</span>
    </div>
    <span style={{ fontSize: '1.3rem', fontWeight: '900', color: theme.primary }}>{value.toLocaleString()}</span>
  </div>
);

const ControlBtn = ({ label, icon, theme, onClick, primary }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', border: `1px solid ${theme.primary}`, background: primary ? theme.primary : theme.white, color: primary ? theme.white : theme.primary, cursor: 'pointer', fontWeight: 'bold' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{icon} {label}</div>
    <ChevronRight size={16} />
  </button>
);

const btnDisabledStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #d1d1d1',
  background: '#f5f5f5',
  color: '#9e9e9e',
  cursor: 'not-allowed',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  opacity: 0.7
};
export default SuperAdmin;