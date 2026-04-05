import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Upload from './pages/Upload';
import ExplorePage from './pages/ExplorePage';
import SuperAdmin from './pages/SuperAdmin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;