import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const validateEmail = (email) => {
  if (!email.endsWith('@gmail.com')) return "Only Gmail addresses are allowed.";
  return null;
};

const validatePassword = (pass) => {
  if (pass.length < 6) return "Password must be at least 6 characters.";
  if (!/\d/.test(pass)) return "Password must contain at least one number.";
  return null;
};

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // 1. Validate Email
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    // 2. Validate Password Complexity
    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    // 3. Validate Password Match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    // Check if any errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the function here
    }

    setErrors({}); // Clear errors if validation passes
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'student'
      });
      alert("Account created! Redirecting to login...");
      navigate('/login');
    } catch (err) {
      // If email already exists, show it under email field
      setErrors({ email: err.response?.data?.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  const ErrorMsg = ({ text }) => text ? (
    <p style={{ color: '#D32F2F', fontSize: '12px', marginTop: '5px', fontWeight: '500', textAlign: 'left' }}>{text}</p>
  ) : null;

  const EyeIcon = ({ visible }) => visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );

  const toggleBtnStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7a6a67',
    display: 'flex',
    alignItems: 'center',
    padding: '8px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#FCFAF9' }}>
      <div style={{ background: 'white', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#2C1B18', fontFamily: 'serif', margin: '0 0 10px 0' }}>Create Account</h1>
          <p style={{ color: '#7A6A67', margin: 0 }}>Join StudyShare community</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>Full Name</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E8E2E0', fontSize: '16px' }}
              placeholder="Enter full name"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>Email Address</label>
            <input 
              type="email" 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '16px', border: errors.email ? '2px solid #D32F2F' : '1px solid #E8E2E0', outline: 'none' }}
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
            <ErrorMsg text={errors.email} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                style={{ width: '100%', padding: '12px 45px 12px 12px', borderRadius: '12px', fontSize: '16px', border: errors.password ? '2px solid #D32F2F' : '1px solid #E8E2E0', outline: 'none' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleBtnStyle}>
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            <ErrorMsg text={errors.password} />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                style={{ width: '100%', padding: '12px 45px 12px 12px', borderRadius: '12px', fontSize: '16px', border: errors.confirmPassword ? '2px solid #D32F2F' : '1px solid #E8E2E0', outline: 'none' }}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                required 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={toggleBtnStyle}>
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
            <ErrorMsg text={errors.confirmPassword} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#5D4037', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#7A6A67' }}>
          Already have an account? <Link to="/login" style={{ color: '#5D4037', fontWeight: 'bold', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;