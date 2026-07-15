import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="PaletteVerse Logo" className="logo-icon" style={{ width: 32, height: 32, objectFit: 'contain' }} />
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
