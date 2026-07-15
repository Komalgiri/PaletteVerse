import React, { useState } from 'react';
import { Copy, Eye, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PALETTES } from '../../data/palettes';
import type { Palette } from '../../data/palettes';
import './DiscoverGrid.css';

export const DiscoverGrid: React.FC = () => {
  const navigate = useNavigate();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const handlePreview = (palette: Palette) => {
    // In a real app we might pass this via URL params or state management,
    // but for now we'll route and rely on a globally shared state or just the default.
    // For this mock, we'll navigate to the preview page. We can pass the palette ID in state.
    navigate('/live-preview', { state: { selectedPaletteId: palette.id } });
  };

  return (
    <section className="discover-section" id="discover-palettes">
      <div className="discover-header">
        <h2 className="heading-xl">Discover Palettes</h2>
        <p className="text-secondary">Click any color to copy its HEX code, or preview the palette on real UI components.</p>
      </div>

      <div className="palette-grid">
        {PALETTES.map(palette => (
          <div key={palette.id} className="palette-card glass-panel hover-lift">
            
            {/* The 5 Color Bars */}
            <div className="palette-bars">
              {palette.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="color-bar" 
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
            <div className="palette-card-footer">
              <h3 className="palette-title">{palette.name}</h3>
              <button 
                className="btn-preview"
                onClick={() => handlePreview(palette)}
              >
                <Eye size={16} /> Preview
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};
