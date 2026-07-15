import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"></path>
          </svg>
          <span className="logo-text">Palette<span style={{ color: 'var(--accent-primary)' }}>Verse</span></span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link hover-lift">Home</Link>
          <Link to="/explore" className="nav-link hover-lift">Explore</Link>
          <Link to="/create" className="nav-link hover-lift">Create</Link>
          <Link to="/play" className="nav-link hover-lift" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Play</Link>
        </div>
        <div className="navbar-actions">
          <button className="btn-primary hover-lift" onClick={() => navigate('/live-preview')}>
            Live Preview
          </button>
        </div>
      </div>
    </nav>
  );
};
