import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../logo.jpg';
import "./logo.css";

const BaseLayout = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const close = () => setMenuOpen(false);

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
              <li className="nav-item">
                <Link className={isActive("/balance")} to="/balance" onClick={close}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className={isActive("/analytics")} to="/analytics" onClick={close}>Analytics</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {props.children}
    </>
  );
};

export default BaseLayout;
