import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/signup', { username, password });

      if (response.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => {
          history.push('/login');
        }, 1500);
      } else {
        setError(response.data.message || 'Signup failed!');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Signup failed!');
      } else {
        setError('Server error! Please try again.');
      }
    }
  };

  return (
    <>

      <div className="signup-container">
        <div className="signup-box">
          <h1 className="signup-title">Create Account</h1>
          
          {error && <p className="error-message" style={{ color: '#ff4444', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          {success && <p className="success-message" style={{ color: '#00c851', textAlign: 'center', marginBottom: '10px' }}>{success}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          <div className="login-link">
            Already have an account?
            <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;