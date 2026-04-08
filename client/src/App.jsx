import React from 'react';
import axios from 'axios';
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
import SuperAdmin from './pages/SuperAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// This kills the zombie token if the backend says it's expired (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear(); // Wipe everything
      window.location.href = '/login'; // Force redirect
    }
    return Promise.reject(error);
  }
);
function App() {
  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/superadmin" element={<ProtectedRoute><SuperAdmin /></ProtectedRoute>} />
          <Route path="/browse" element={ <ProtectedRoute> <Browse /></ProtectedRoute> } />
          <Route path="/upload" element={ <ProtectedRoute> <Upload /> </ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;