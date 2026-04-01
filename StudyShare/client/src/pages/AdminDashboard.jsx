import React from 'react';
import { 
  LayoutDashboard, Users, BarChart3, Settings, 
  Bell, Search, LogOut, TrendingUp, UserPlus, 
  Activity, ArrowUpRight 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const data = [
  { name: 'Mon', visits: 400 }, { name: 'Tue', visits: 700 },
  { name: 'Wed', visits: 500 }, { name: 'Thu', visits: 900 },
  { name: 'Fri', visits: 800 }, { name: 'Sat', visits: 1100 },
];

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0f172a] text-white hidden lg:flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">StudyShare</h1>
              <span className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Admin Portal</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Users size={20}/>} label="User Directory" />
          <NavItem icon={<BarChart3 size={20}/>} label="Performance" />
          <NavItem icon={<Settings size={20}/>} label="System Settings" />
        </nav>

        <div className="p-6">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-2">Logged in as</p>
            <p className="text-sm font-bold">Ronak Malpani</p>
            <button className="mt-3 flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={14}/> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 transition-all">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Quick search (Ctrl + K)" 
              className="w-80 pl-11 pr-4 py-2.5 bg-slate-100/50 border-transparent border focus:border-blue-500/20 focus:bg-white rounded-xl text-sm outline-none transition-all" 
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center text-white font-bold">RM</div>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="p-10 max-w-[1600px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview</h2>
              <p className="text-slate-500 mt-1">Real-time platform metrics and user activity.</p>
            </div>
            <button className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2">
              <ArrowUpRight size={16}/> Export Data
            </button>
          </div>
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <StatCard 
              title="Revenue" 
              value="₹45,231" 
              trend="+12.5%" 
              icon={<TrendingUp className="text-emerald-500" />} 
              color="emerald"
            />
            <StatCard 
              title="New Students" 
              value="1,284" 
              trend="+8.2%" 
              icon={<UserPlus className="text-blue-500" />} 
              color="blue"
            />
            <StatCard 
              title="Server Uptime" 
              value="99.9%" 
              trend="Stable" 
              icon={<Activity className="text-amber-500" />} 
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ENHANCED CHART */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Traffic Insights</h3>
                <select className="text-xs font-bold bg-slate-50 border-none rounded-lg p-2 outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12}} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#3b82f6" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-6">Live Users</h3>
              <div className="space-y-6">
                <UserItem name="Aryan Kulkarni" email="aryan.k@mitwpu.edu" status="Active" />
                <UserItem name="Sneha Patil" email="sneha.p@mitwpu.edu" status="Pending" />
                <UserItem name="Rahul Mehta" email="r.mehta@mitwpu.edu" status="Active" />
                <UserItem name="Priya Singh" email="priya.s@mitwpu.edu" status="Inactive" />
              </div>
              <button className="w-full mt-8 py-3 rounded-xl bg-slate-50 text-slate-500 text-sm font-bold hover:bg-slate-100 transition-all">
                View All Users
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- ENHANCED UI COMPONENTS ---

const NavItem = ({ icon, label, active }) => (
  <div className={`
    flex items-center gap-3.5 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group
    ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `}>
    <span className={`${active ? 'text-white' : 'group-hover:text-blue-400'} transition-colors`}>{icon}</span>
    <span className="text-sm font-bold tracking-wide">{label}</span>
  </div>
);

const StatCard = ({ title, value, trend, icon, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black text-slate-800 mt-1">{value}</h2>
    </div>
  );
};

const UserItem = ({ name, email, status }) => {
  const statusStyles = {
    Active: 'bg-emerald-100 text-emerald-600',
    Pending: 'bg-amber-100 text-amber-600',
    Inactive: 'bg-slate-100 text-slate-500'
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{name}</p>
          <p className="text-[11px] text-slate-400 font-medium">{email}</p>
        </div>
      </div>
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter ${statusStyles[status]}`}>
        {status}
      </span>
    </div>
  );
};

export default AdminDashboard;