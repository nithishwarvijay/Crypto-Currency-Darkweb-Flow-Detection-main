import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AnimatedCursor from 'react-animated-cursor';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });

      if (response.data.success) {
        onLogin(response.data.token);
        history.push('/balance');
      } else {
        setError(response.data.message || 'Invalid credentials!');
      }
    } catch (error) {
      setError('Server error! Please try again.');
    }
  };

  return (
    <>
      <AnimatedCursor
        innerSize={12}
        outerSize={8}
        color="0, 255, 0"
        outerAlpha={0.3}
        innerScale={0.7}
        outerScale={5}
        trailingSpeed={8}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="password"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link'
        ]}
        hasBlendMode={true}
        innerStyle={{
          backgroundColor: 'rgb(0, 255, 0)',
          boxShadow: '0 0 10px 2px rgba(0, 255, 0, 0.7)'
        }}
        outerStyle={{
          border: '2px solid rgb(0, 255, 0)',
          boxShadow: '0 0 15px 3px rgba(0, 255, 0, 0.4)'
        }}
      />
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Welcome Back</h1>
          
          {error && <p className="error-message">{error}</p>}
          
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

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          <div className="signup-link">
            Don't have an account?
            <a href="#signup">Sign up</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;