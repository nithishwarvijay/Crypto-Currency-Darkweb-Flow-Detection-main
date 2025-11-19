import React, { useState } from 'react';
import AnimatedCursor from 'react-animated-cursor';
import './Signup.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup:', { username, password });
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
      <div className="signup-container">
        <div className="signup-box">
          <h1 className="signup-title">Create Account</h1>
          
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
            <a href="#login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;