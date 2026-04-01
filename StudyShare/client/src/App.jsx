import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Your user-facing study portal
import AdminDashboard from './pages/AdminDashboard'; // Your new SaaS dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL: localhost:5173/ */}
        <Route path="/" element={<Home />} />
        
        {/* URL: localhost:5173/admin */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;