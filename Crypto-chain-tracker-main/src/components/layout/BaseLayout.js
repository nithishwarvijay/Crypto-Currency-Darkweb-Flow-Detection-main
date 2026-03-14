import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from '../logo.jpg';
import "./logo.css";

const BaseLayout = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");
  const history = useHistory();
  const location = useLocation();

  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    close();
    history.push("/login");
    window.location.reload();
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <>
      <div className="navbar-container">
        <nav className="navbar">
          {/* Brand */}
          <div className="navbar-brand">
            <img className="logo-img" src={logo} alt="CryptoChain Logo" />
          </div>

          {/* Hamburger */}
          <button
            className="navbar-toggler"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Links */}
          <div className={`navbar-menu${menuOpen ? " active" : ""}`}>
            <ul className="navbar-nav">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className={isActive("/signup")} to="/signup" onClick={close}>Sign Up</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/login")} to="/login" onClick={close}>Login</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={isActive("/balance")} to="/balance" onClick={close}>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/analytics")} to="/analytics" onClick={close}>Analytics</Link>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>

      {props.children}
    </>
  );
};

export default BaseLayout;
