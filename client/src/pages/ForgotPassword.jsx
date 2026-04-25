import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

 return (
    <div className="auth-card" style={{ margin: '100px auto', maxWidth: '400px', textAlign: 'center' }}>
      <h2>Forgot Password</h2>
      <p>Enter your registered email to receive a reset link.</p>
      
      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="form-control"
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '20px' }}>
            Send Reset Link
          </button>
        </form>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#E8F5E9', borderRadius: '12px', marginTop: '20px' }}>
           <p style={{ color: '#2E7D32', fontWeight: 'bold', margin: 0 }}>Check your Gmail!</p>
           <p style={{ fontSize: '14px', color: '#4CAF50' }}>A reset link has been sent to {email}</p>
        </div>
      )}

      {message && !isSuccess && (
        <p style={{ marginTop: '15px', color: '#D32F2F' }}>{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;