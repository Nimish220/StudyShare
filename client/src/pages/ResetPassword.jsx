import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setMessage("Passwords do not match!");
        }

        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { 
                token, 
                password 
            });
            alert("Success! Password updated.");
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.error || "Invalid or expired token");
        } finally {
            setLoading(false);
        }
    };

    // Reusing your EyeIcon helper from Signup
    const EyeIcon = ({ visible }) => visible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    );

    // Reusing your toggle button styles
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
        <div style={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            backgroundColor: '#FCFAF9' 
        }}>
            <div style={{ 
                background: 'white', 
                padding: 'clamp(20px, 5vw, 40px)', 
                borderRadius: '24px', 
                width: '100%', 
                maxWidth: '450px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '1.8rem', color: '#2C1B18', fontFamily: 'serif', margin: '0 0 10px 0' }}>Reset Password</h1>
                    <p style={{ color: '#7A6A67', margin: 0 }}>Create a new secure password</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                style={{ width: '100%', padding: '12px 45px 12px 12px', borderRadius: '12px', border: '1px solid #E8E2E0', fontSize: '16px' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleBtnStyle}>
                                <EyeIcon visible={showPassword} />
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2C1B18' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                style={{ width: '100%', padding: '12px 45px 12px 12px', borderRadius: '12px', border: '1px solid #E8E2E0', fontSize: '16px' }}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={toggleBtnStyle}>
                                <EyeIcon visible={showConfirmPassword} />
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '14px', 
                            borderRadius: '12px', 
                            border: 'none', 
                            backgroundColor: '#5D4037', 
                            color: 'white', 
                            fontWeight: 'bold', 
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                {message && (
                    <p style={{ textAlign: 'center', marginTop: '15px', color: '#D32F2F', fontSize: '14px' }}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;