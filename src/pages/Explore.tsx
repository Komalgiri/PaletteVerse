import React, { useState } from 'react';
import { Copy, Eye, Check, SlidersHorizontal, Heart, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PALETTES } from '../data/palettes';
import type { Palette } from '../data/palettes';
import { PageTransition } from '../components/layout/PageTransition';
import { ExportModal } from '../components/ExportModal';
import './Explore.css';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [exportPalette, setExportPalette] = useState<Palette | null>(null);

  // Expanded filters
  const filters = ['All', 'Dark', 'Light', 'Warm', 'Cool', 'Neon', 'Pastel', 'Earth', 'Monochrome', 'Vibrant', 'Muted', 'Aesthetic', 'Vintage'];

  const filteredPalettes = activeFilter === 'All' 
    ? PALETTES 
    : PALETTES.filter(p => p.tags.includes(activeFilter));

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handlePreview = (palette: typeof PALETTES[0]) => {
    navigate('/live-preview', { state: { selectedPaletteId: palette.id } });
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageTransition className="explore-page split-view-page">
      {/* LEFT SIDEBAR: FILTERS */}
      <aside className="sidebar explore-sidebar">
        <div className="sidebar-header">
          <h2 className="heading-lg">Discover</h2>
          <p className="text-secondary">Find the perfect color combination for your next project.</p>
        </div>

        <div className="filter-section">
          <div className="filter-header">
            <SlidersHorizontal size={18} />
            <h3>Mood & Tone</h3>
          </div>
          <div className="filter-pills">
            {filters.map(f => (
              <button 
                key={f}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="sidebar-footer">
          <p className="text-secondary text-sm">More advanced filtering options coming soon.</p>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT: GRID */}
      <main className="main-preview explore-main">
        <div className="explore-header-bar">
          <span className="results-count">Showing {filteredPalettes.length} curated palettes</span>
          <select className="sort-dropdown">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Trending</option>
          </select>
        </div>

        <motion.div 
          className="waterfall-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredPalettes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No palettes found matching this filter.
            </div>
          ) : (
            filteredPalettes.map(palette => (
              <motion.div 
                key={palette.id} 
                className="waterfall-card"
                variants={itemVariants}
              >
              
              {/* The 5 Color Bars - Taller and more impactful */}
              <div className="waterfall-bars">
                {palette.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="waterfall-color" 
                    style={{ backgroundColor: color }}
                    onClick={() => handleCopy(color)}
                  >
                    <div className="color-hover-overlay">
                      {copiedColor === color ? <Check size={20} /> : <Copy size={20} />}
                      <span>{copiedColor === color ? 'Copied' : color}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="waterfall-footer">
                <div className="waterfall-info">
                  <h3 className="palette-title">{palette.name}</h3>
                  <div className="palette-actions-mini">
                    <button className="icon-btn" title="Like"><Heart size={16} /></button>
                    <button className="icon-btn" title="Export" onClick={() => setExportPalette(palette)}><Download size={16} /></button>
                  </div>
                </div>
                <button 
                  className="btn-preview-large"
                  onClick={() => handlePreview(palette)}
                >
                  <Eye size={16} /> Live Preview
                </button>
              </div>
              
            </motion.div>
            ))
          )}
        </motion.div>
      </main>

      <ExportModal palette={exportPalette} onClose={() => setExportPalette(null)} />
    </PageTransition>
  );
};
