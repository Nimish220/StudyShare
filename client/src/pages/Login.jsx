import React, { useState } from 'react';
import { useNavigate,useLocation, Link } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      // 1. SAVE THE REAL TOKEN
      sessionStorage.setItem('token', response.data.token);

      // 2. USE THE ROLE FROM DATABASE (not the selectedRole state)
      const dbRole = response.data.user.role; 
      const userData = {
        username: response.data.user.username || email.split('@')[0],
        email: email,
        role: dbRole // Always trust the DB role
      };
      sessionStorage.setItem('studyshare_user', JSON.stringify(userData));
      const destination = location.state?.from?.pathname;
      
      if (destination === '/browse') {
      navigate('/browse');
      } 
      // 2. If they were going to /upload but they are an Admin, force them to the Dashboard
      else if (destination === '/upload' && (dbRole === 'admin' || dbRole === 'superadmin')) {
              navigate(dbRole === 'superadmin' ? '/superadmin' : '/admin');
      }
      // 3. If it's a regular student going to /upload, let them go
      else if (destination === '/upload' && dbRole === 'student') {
              navigate('/upload');
      }
      else {
        // 3. ROLE-BASED NAVIGATION
        if (dbRole === 'superadmin') {
          navigate('/superadmin');
        } else if (dbRole === 'admin') {
          navigate('/admin'); // Or '/admin-dashboard' depending on your route name
        } else {
          navigate('/dashboard');
        }
      }
      // 4. Refresh to update the Navbar/Auth state
     setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your StudyShare account</p>
        </div>

        <div className="role-toggle">
          <button 
            type="button"
            className={selectedRole === 'student' ? 'active' : ''} 
            onClick={() => setSelectedRole('student')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="role-label">Student</span>
          </button>
          <button 
            type="button"
            className={selectedRole === 'admin' ? 'active' : ''} 
            onClick={() => setSelectedRole('admin')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="role-label">Admin</span>
          </button>
          <button 
            type="button"
            className={selectedRole === 'superadmin' ? 'active' : ''} 
            onClick={() => setSelectedRole('superadmin')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/></svg>
            <span className="role-label">Super Admin</span>
          </button>
        </div>

        <form id="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="you@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <a href="#">Forgot Password?</a>
            </div>
            {/* Added container for relative positioning of the eye icon */}
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-control" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }} // Add space for the icon
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" id="submit-btn" className="btn btn-primary btn-lg btn-full">
            Sign in as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </button>
        </form>

        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;