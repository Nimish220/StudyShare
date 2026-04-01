import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Bell, Search, LogOut } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', visits: 400 }, { name: 'Tue', visits: 700 },
  { name: 'Wed', visits: 500 }, { name: 'Thu', visits: 900 },
  { name: 'Fri', visits: 800 }, { name: 'Sat', visits: 1100 },
];

const AdminDashboard = () => {
  // State to manage active sidebar item and notification toggle
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleNotificationClick = () => {
    alert("You have 3 new file upload requests to approve.");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("Logged out");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfaf9] font-sans text-[#3d2b1f]">
      
      {/* SIDEBAR - Deep Brown Theme */}
      <aside className="w-64 bg-[#3d2b1f] text-white hidden md:flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 text-2xl font-bold border-b border-[#5c4033] tracking-tight">
          <span className="text-[#d2b48c]">Study</span>Share 
          <span className="text-white/50 text-xs block font-normal mt-1 uppercase tracking-widest">Management</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
          />
          <NavItem 
            icon={<Users size={20}/>} 
            label="Users" 
            active={activeTab === 'Users'} 
            onClick={() => setActiveTab('Users')}
          />
          <NavItem 
            icon={<BarChart3 size={20}/>} 
            label="Analytics" 
            active={activeTab === 'Analytics'} 
            onClick={() => setActiveTab('Analytics')}
          />
          <NavItem 
            icon={<Settings size={20}/>} 
            label="Settings" 
            active={activeTab === 'Settings'} 
            onClick={() => setActiveTab('Settings')}
          />
        </nav>

        <div className="p-4 border-t border-[#5c4033]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-white/70 hover:text-white hover:bg-red-900/30 rounded-xl transition-all duration-300"
          >
            <LogOut size={18}/> <span className="text-sm font-semibold">Logout System</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64">
        
        {/* HEADER - Glassmorphism style */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#eaddd3] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-72 group">
            <Search className="absolute left-3 top-2.5 text-[#8b5e3c]" size={16} />
            <input 
              type="text" 
              placeholder="Search materials..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f5ebe0] border-transparent focus:border-[#8b5e3c] border rounded-xl text-sm outline-none transition-all" 
            />
          </div>

          <div className="flex items-center gap-5">
            {/* Clickable Notification */}
            <button 
              onClick={handleNotificationClick}
              className="p-2 text-[#8b5e3c] hover:bg-[#f5ebe0] rounded-full relative transition-colors group"
            >
              <Bell size={22} className="group-active:scale-90 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#a67c52] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-[#eaddd3]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#3d2b1f]">Ronak Malpani</p>
                <p className="text-[10px] text-[#8b5e3c] font-medium">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-[#8b5e3c] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#8b5e3c]/20">
                RM
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-[#3d2b1f] tracking-tight">Dashboard Overview</h1>
              <p className="text-[#8b5e3c] text-sm">Welcome back, manager. Here is the latest activity.</p>
            </div>
            <button className="bg-[#8b5e3c] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#8b5e3c]/20 hover:bg-[#704c31] transition-all">
              Generate Report
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <StatCard title="Total Revenue" value="₹45,231" trend="+12.5%" />
            <StatCard title="New Registrations" value="154" trend="+5.2%" />
            <StatCard title="Active Materials" value="1,042" trend="+18%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CHART */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#eaddd3] shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#8b5e3c] rounded-full"></div>
                Monthly Traffic Analysis
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5e3c" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8b5e3c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5ebe0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8b5e3c', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#8b5e3c', fontSize: 12}} />
                    <Tooltip 
                       contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                    />
                    <Area type="monotone" dataKey="visits" stroke="#8b5e3c" strokeWidth={3} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT USERS */}
            <div className="bg-white p-8 rounded-3xl border border-[#eaddd3] shadow-sm">
              <h3 className="font-bold text-lg mb-6">Pending Approvals</h3>
              <div className="space-y-5">
                <UserItem name="Aryan K." status="Active" time="2 mins ago" />
                <UserItem name="Sneha P." status="Pending" time="15 mins ago" />
                <UserItem name="Rahul M." status="Active" time="1 hour ago" />
                <UserItem name="Priya S." status="Inactive" time="3 hours ago" />
              </div>
              <button className="w-full mt-6 py-3 rounded-xl bg-[#f5ebe0] text-[#8b5e3c] text-sm font-bold hover:bg-[#eaddd3] transition-all">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all duration-300 group
    ${active 
      ? 'bg-[#8b5e3c] text-white shadow-xl shadow-black/20 translate-x-1' 
      : 'text-white/60 hover:text-white hover:bg-white/10'}`}
  >
    <div className={`${active ? 'text-white' : 'text-[#8b5e3c] group-hover:text-white'} transition-colors`}>
      {icon}
    </div>
    <span className="text-sm font-bold tracking-wide">{label}</span>
  </div>
);

const StatCard = ({ title, value, trend }) => (
  <div className="bg-white p-8 rounded-3xl border border-[#eaddd3] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <p className="text-[#8b5e3c] text-xs font-black uppercase tracking-widest">{title}</p>
    <div className="flex items-end justify-between mt-3">
      <h2 className="text-3xl font-black text-[#3d2b1f]">{value}</h2>
      <span className="bg-[#f5ebe0] text-[#8b5e3c] px-2.5 py-1 rounded-lg text-[10px] font-black">
        {trend}
      </span>
    </div>
  </div>
);

const UserItem = ({ name, status, time }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-[#f5ebe0] text-[#8b5e3c] rounded-xl flex items-center justify-center font-bold group-hover:bg-[#8b5e3c] group-hover:text-white transition-all">
        {name[0]}
      </div>
      <div>
        <p className="text-sm font-bold text-[#3d2b1f]">{name}</p>
        <p className="text-[10px] text-[#8b5e3c] font-medium">{time}</p>
      </div>
    </div>
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm
      ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-[#eaddd3] text-[#8b5e3c]'}`}>
      {status}
    </span>
  </div>
);

export default AdminDashboard;