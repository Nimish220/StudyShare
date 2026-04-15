import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    // 1. Create state to hold the data
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    // 2. This function sends the data to RENDER
    const handleSubmit = async (e) => {
        e.preventDefault(); // CRITICAL: This stops the 404/Refresh you are seeing
        
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            alert("Success! Redirecting to login...");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Create an account</h1>
                {/* 3. Attach the function to the form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={(e) => setFormData({...formData, username: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Create Account</button>
                </form>
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
};

export default Signup;