import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroScene } from './HeroScene';
import './Hero.css';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-background">
        <HeroScene />
      </div>
      <div className="hero-content">
        <div className="badge glass-panel hover-lift">
          <Sparkles size={16} className="badge-icon" />
          <span>Discover the Perfect Palette</span>
        </div>
        <h1 className="heading-xl hero-title">
          Bring your brand to life with <span className="text-gradient">Color</span>
        </h1>
        <p className="hero-description">
          Explore and visualize color palettes through immersive 3D experiences. 
          See how colors work together in real-world digital products before you build.
        </p>
        <div className="hero-actions">
          <button 
            className="btn-primary btn-lg hover-lift"
            onClick={() => navigate('/explore')}
          >
            Explore Palettes <ArrowRight size={20} />
          </button>
          <button 
            className="btn-secondary btn-lg glass-panel hover-lift"
            onClick={() => navigate('/live-preview')}
          >
            View Live Previews
          </button>
        </div>
      </div>
    </section>
  );
};
