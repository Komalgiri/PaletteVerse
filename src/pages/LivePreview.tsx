import React, { useState, useEffect, useRef } from 'react';
import { Play, SkipForward, SkipBack, User, Lock, Mail, Bell, Shield, Settings, Palette, Download, Image, Check, Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PALETTES } from '../data/palettes';
import { PageTransition } from '../components/layout/PageTransition';
import { ExportModal } from '../components/ExportModal';
import html2canvas from 'html2canvas';
import './LivePreview.css';

export const LivePreview: React.FC = () => {
  const location = useLocation();
  const [activePalette, setActivePalette] = useState(PALETTES[0]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState('All');
  const [gradientCopied, setGradientCopied] = useState<number | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.customPalette) {
        // We received a custom generated palette from the Creator page
        setActivePalette(location.state.customPalette);
      } else if (location.state.selectedPaletteId) {
        // We received an ID from the Explore grid
        const found = PALETTES?.find(p => p.id === location.state.selectedPaletteId);
        if (found) {
          setActivePalette(found);
        }
      }
    }
  }, [location.state]);

  // Fallback loading state if PALETTES isn't ready
  if (!activePalette || !activePalette.colors) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Palette...</div>;
  }

  // color[0]: Darkest
  // color[1]: Dark/Mid
  // color[2]: Mid/Accent
  // color[3]: Light/Surface
  // color[4]: Lightest/Background

  const theme = {
    bg: activePalette.colors[4],
    text: activePalette.colors[0],
    primary: activePalette.colors[2],
    secondary: activePalette.colors[1],
    surface: activePalette.colors[3],
  };

  // Luminance & Contrast Calculation
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
  };

  const contrastPairs = [
    { fg: activePalette.colors[0], bg: activePalette.colors[4], name: 'Darkest on Lightest' },
    { fg: activePalette.colors[1], bg: activePalette.colors[4], name: 'Dark on Lightest' },
    { fg: activePalette.colors[4], bg: activePalette.colors[0], name: 'Lightest on Darkest' },
    { fg: activePalette.colors[4], bg: activePalette.colors[2], name: 'Lightest on Primary' },
    { fg: activePalette.colors[0], bg: activePalette.colors[2], name: 'Darkest on Primary' },
    { fg: activePalette.colors[0], bg: activePalette.colors[3], name: 'Darkest on Surface' }
  ];

  const colorBlindnessTypes = [
    { id: 'normal', name: 'Normal Vision' },
    { id: 'protanopia', name: 'Protanopia (Red-blind)' },
    { id: 'deuteranopia', name: 'Deuteranopia (Green-blind)' },
    { id: 'tritanopia', name: 'Tritanopia (Blue-blind)' },
    { id: 'achromatopsia', name: 'Achromatopsia (Monochromacy)' }
  ];

  // Load shared palette from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('p');
    if (encoded) {
      try {
        const data = JSON.parse(atob(encoded));
        setActivePalette({
          id: 'shared',
          name: data.t || 'Shared Palette',
          colors: data.c,
          colorNames: data.n,
          headingFont: data.h,
          bodyFont: data.b,
          tags: ['Custom']
        });
      } catch (e) { /* ignore bad data */ }
    }
  }, []);

  // Download as PNG
  const handleDownloadPNG = async () => {
    if (!pillsRef.current) return;
    const canvas = await html2canvas(pillsRef.current, { scale: 3, backgroundColor: null });
    const link = document.createElement('a');
    link.download = `${activePalette.name.replace(/\s/g, '-').toLowerCase()}-palette.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Generate gradients
  const gradients = [
    { name: 'Full Sweep', css: `linear-gradient(135deg, ${activePalette.colors.join(', ')})` },
    { name: 'Soft Duo', css: `linear-gradient(135deg, ${activePalette.colors[3]}, ${activePalette.colors[4]})` },
    { name: 'Bold Accent', css: `linear-gradient(135deg, ${activePalette.colors[0]}, ${activePalette.colors[2]})` },
    { name: 'Warm Fade', css: `linear-gradient(135deg, ${activePalette.colors[1]}, ${activePalette.colors[3]})` },
    { name: 'Radial Glow', css: `radial-gradient(circle, ${activePalette.colors[2]}, ${activePalette.colors[0]})` },
    { name: 'Diagonal Pop', css: `linear-gradient(45deg, ${activePalette.colors[0]}, ${activePalette.colors[2]}, ${activePalette.colors[4]})` },
  ];

  const handleCopyGradient = (index: number, css: string) => {
    navigator.clipboard.writeText(`background: ${css};`);
    setGradientCopied(index);
    setTimeout(() => setGradientCopied(null), 2000);
  };

  return (
    <PageTransition className="live-preview-page split-view-page">
      {/* SVG Filters for Color Blindness */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="protanopia">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="deuteranopia">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="tritanopia">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="achromatopsia">
          <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
        </filter>
      </svg>

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="back-link">
            <Palette size={20} />
            <span>Back to Home</span>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <h2 className="heading-lg" style={{ margin: 0 }}>Palette Explorer</h2>
            <button className="icon-btn" onClick={() => setShowExportModal(true)} title="Export Brandkit">
              <Download size={20} />
            </button>
          </div>
          <p className="text-secondary" style={{ marginTop: '0.5rem' }}>Filter by category to find your vibe.</p>
        </div>

        <div className="sidebar-categories">
          {['All', 'Aesthetic', 'Dark', 'Warm', 'Cool', 'Pastel', 'Earth', 'Vibrant'].map(cat => (
            <button
              key={cat}
              className={`sidebar-cat-btn ${sidebarFilter === cat ? 'active' : ''}`}
              onClick={() => setSidebarFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sidebar-palettes">
          {PALETTES
            .filter(p => sidebarFilter === 'All' || p.tags.includes(sidebarFilter))
            .map(p => (
            <div key={p.name} className={`sidebar-palette-item ${activePalette.name === p.name ? 'active' : ''}`} onClick={() => setActivePalette(p)}>
              <span className="sidebar-palette-name">{p.name}</span>
              <div className="sidebar-swatches">
                {p.colors.map((c, i) => (
                  <div key={i} className="swatch" style={{ backgroundColor: c }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="main-preview" style={{ 
        backgroundColor: `${theme.surface}30`,
        fontFamily: activePalette.bodyFont ? `"${activePalette.bodyFont}", sans-serif` : 'inherit'
      }}>
        {(activePalette.headingFont || activePalette.bodyFont) && (
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=${(activePalette.headingFont || 'Inter').replace(/ /g, '+')}:wght@400;600;700&family=${(activePalette.bodyFont || 'Inter').replace(/ /g, '+')}:wght@400;600;700&display=swap');
            .main-preview h1, .main-preview h2, .main-preview h3, .main-preview h4, .main-preview h5, .main-preview h6 {
              font-family: "${activePalette.headingFont || 'Inter'}", sans-serif !important;
            }
          `}</style>
        )}

        {/* FLOATING PALETTE PILLS — TOP RIGHT */}
        <div className="floating-pills-widget">
          <div ref={pillsRef}>
            <div className="floating-pills-label">{activePalette.name}</div>
            {[...activePalette.colors].reverse().map((color, index) => {
              const allNames = activePalette.colorNames
                ? [...activePalette.colorNames].reverse()
                : ['Background', 'Surface', 'Primary', 'Dark', 'Darkest'];
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              const textColor = lum > 0.5 ? '#2c1a0e' : '#f5f0e8';
              return (
                <div
                  key={index}
                  className="floating-pill"
                  style={{ backgroundColor: color, color: textColor }}
                >
                  <span className="floating-pill-name" style={{ fontFamily: `"${activePalette.headingFont || 'Playfair Display'}", serif` }}>
                    {allNames[index]}
                  </span>
                  <span className="floating-pill-hex">{color.replace('#', '').toUpperCase()}</span>
                </div>
              );
            })}
          </div>
          <div className="floating-pills-actions">
            <button onClick={handleDownloadPNG} title="Download as PNG">
              <Image size={14} /> PNG
            </button>
            <button onClick={() => setShowExportModal(true)} title="Export code">
              <Download size={14} /> Code
            </button>
          </div>
        </div>

        {/* SECTION 1: DEVICES */}
        <section className="preview-section">
          <div className="section-title">
            <h3 style={{ color: activePalette.colors[0] }}>Multi-Device Overview</h3>
            <p style={{ color: activePalette.colors[1] }}>How your palette maps to macro layouts.</p>
          </div>
          
          <div className="devices-container">
            {/* Mobile Device */}
            <div className="device-frame mobile-frame">
              <div className="device-notch"></div>
              <div className="device-screen" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0] }}>
                <div className="scrolling-content mobile-scroll">
                  <header className="mobile-header" style={{ backgroundColor: activePalette.colors[3] }}>
                    <div className="mobile-menu" style={{ color: activePalette.colors[1] }}>☰</div>
                    <div className="mobile-title" style={{ color: activePalette.colors[0] }}>App</div>
                  </header>
                  
                  {/* Section 1: Hero */}
                  <div style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: activePalette.colors[4] }}>
                    <h2 style={{ color: activePalette.colors[0], fontSize: '1.8rem', margin: '1rem 0' }}>Build faster.</h2>
                    <button style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: activePalette.colors[2], color: activePalette.colors[4], fontWeight: 'bold' }}>Start Free Trial</button>
                  </div>

                  {/* Section 2: Categories */}
                  <div style={{ padding: '2rem 1.5rem', backgroundColor: activePalette.colors[3] }}>
                    <h3 style={{ color: activePalette.colors[0], textAlign: 'center', marginBottom: '1.5rem' }}>Categories</h3>
                    <div style={{ display: 'flex', overflowX: 'hidden', gap: '1rem', justifyContent: 'center' }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: activePalette.colors[1], display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePalette.colors[4] }}>❖</div>
                          <span style={{ color: activePalette.colors[0], fontSize: '0.8rem' }}>Item {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Star Treat */}
                  <div style={{ padding: '2rem 1.5rem', backgroundColor: activePalette.colors[4] }}>
                    <div style={{ height: '150px', backgroundColor: activePalette.colors[2], borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                    <h3 style={{ color: activePalette.colors[0], marginBottom: '0.5rem' }}>Star Product</h3>
                    <p style={{ color: activePalette.colors[1], fontSize: '0.9rem', marginBottom: '1rem' }}>Our best selling item this week.</p>
                    <span style={{ color: activePalette.colors[2], fontWeight: 'bold', fontSize: '1.2rem' }}>$29.00</span>
                  </div>

                  {/* Section 4: Products Grid */}
                  <div style={{ padding: '2rem 1.5rem', backgroundColor: activePalette.colors[3] }}>
                    <h3 style={{ color: activePalette.colors[0], marginBottom: '1.5rem', textAlign: 'center' }}>Featured</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ backgroundColor: activePalette.colors[4], padding: '1rem', borderRadius: '12px', textAlign: 'center', border: `1px solid ${activePalette.colors[2]}` }}>
                        <div style={{ height: '80px', backgroundColor: activePalette.colors[1], borderRadius: '8px', marginBottom: '0.5rem' }}></div>
                        <span style={{ color: activePalette.colors[2], fontWeight: 'bold', fontSize: '0.9rem' }}>$15.00</span>
                      </div>
                      <div style={{ backgroundColor: activePalette.colors[4], padding: '1rem', borderRadius: '12px', textAlign: 'center', border: `1px solid ${activePalette.colors[2]}` }}>
                        <div style={{ height: '80px', backgroundColor: activePalette.colors[0], borderRadius: '8px', marginBottom: '0.5rem' }}></div>
                        <span style={{ color: activePalette.colors[2], fontWeight: 'bold', fontSize: '0.9rem' }}>$25.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Reviews */}
                  <div style={{ padding: '2rem 1.5rem 6rem', backgroundColor: activePalette.colors[4] }}>
                    <h3 style={{ color: activePalette.colors[0], textAlign: 'center', marginBottom: '1.5rem' }}>Reviews</h3>
                    <div style={{ padding: '1rem', backgroundColor: activePalette.colors[3], borderRadius: '12px', marginBottom: '1rem' }}>
                      <h5 style={{ color: activePalette.colors[0], marginBottom: '0.25rem' }}>Emma D.</h5>
                      <p style={{ color: activePalette.colors[1], fontSize: '0.85rem' }}>"Changed the way I work!"</p>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: activePalette.colors[3], borderRadius: '12px' }}>
                      <h5 style={{ color: activePalette.colors[0], marginBottom: '0.25rem' }}>Michael L.</h5>
                      <p style={{ color: activePalette.colors[1], fontSize: '0.85rem' }}>"Incredible value."</p>
                    </div>
                  </div>
                </div>
                <nav className="mobile-nav" style={{ backgroundColor: activePalette.colors[0], color: activePalette.colors[3], position: 'absolute', bottom: 0, width: '100%', zIndex: 10 }}>
                  <div style={{ color: activePalette.colors[2] }}>⌂</div>
                  <div>🔍</div>
                  <div>👤</div>
                </nav>
              </div>
            </div>

            {/* Desktop Device */}
            <div className="device-frame desktop-frame">
              <div className="device-camera"></div>
              <div className="device-screen" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0] }}>
                <nav className="desktop-nav" style={{ backgroundColor: activePalette.colors[3], position: 'sticky', top: 0, zIndex: 10 }}>
                  <div className="desktop-logo" style={{ color: activePalette.colors[0] }}>BrandSpace</div>
                  <div className="desktop-links" style={{ color: activePalette.colors[1] }}>
                    <span>Products</span>
                    <span>Solutions</span>
                    <button style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4] }}>Login</button>
                  </div>
                </nav>
                <div className="scrolling-content desktop-scroll">
                  {/* Section 1: Hero */}
                  <div className="desktop-hero" style={{ backgroundColor: activePalette.colors[4] }}>
                    <h2 style={{ color: activePalette.colors[0] }}>Build the future, faster.</h2>
                    <p style={{ color: activePalette.colors[1] }}>Everything you need to launch and scale your next big idea.</p>
                    <button className="desktop-cta" style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4] }}>Start Free Trial</button>
                  </div>

                  {/* Section 2: Categories */}
                  <div className="desktop-categories" style={{ backgroundColor: activePalette.colors[3], padding: '3rem 2rem', textAlign: 'center' }}>
                    <h3 style={{ color: activePalette.colors[0], marginBottom: '2rem', fontSize: '1.8rem' }}>Explore Categories</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: activePalette.colors[1], display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePalette.colors[4], fontSize: '1.5rem' }}>❖</div>
                          <span style={{ color: activePalette.colors[0], fontSize: '1rem', fontWeight: 600 }}>Category {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Star Feature */}
                  <div className="desktop-star-feature" style={{ backgroundColor: activePalette.colors[4], padding: '5rem 4rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: activePalette.colors[0], fontSize: '2.5rem', marginBottom: '1rem' }}>Our Star Product</h3>
                      <p style={{ color: activePalette.colors[1], marginBottom: '2rem', lineHeight: 1.6, fontSize: '1.1rem' }}>Experience pure delight with our best-selling feature. It's crafted with care and designed to elevate your workflow seamlessly.</p>
                      <span style={{ color: activePalette.colors[2], fontSize: '1.5rem', fontWeight: 'bold' }}>$29.00 / mo</span>
                    </div>
                    <div style={{ flex: 1, height: '280px', backgroundColor: activePalette.colors[2], borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '40px', right: '40px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: activePalette.colors[3], opacity: 0.5 }}></div>
                    </div>
                  </div>

                  {/* Section 4: Grid Features / Products */}
                  <div className="desktop-grid-section" style={{ backgroundColor: activePalette.colors[3], padding: '5rem 2rem' }}>
                    <h3 style={{ color: activePalette.colors[0], textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Featured Offerings</h3>
                    <div className="desktop-features" style={{ padding: 0 }}>
                      <div className="feature-card" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0], border: `1px solid ${activePalette.colors[2]}` }}>
                        <div style={{ height: '140px', backgroundColor: activePalette.colors[1], borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                        <h4 style={{ color: activePalette.colors[0], marginBottom: '0.5rem', fontSize: '1.2rem' }}>Analytics Pro</h4>
                        <span style={{ color: activePalette.colors[2], fontWeight: 600, fontSize: '1.1rem' }}>$15.00</span>
                      </div>
                      <div className="feature-card" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0], border: `1px solid ${activePalette.colors[2]}` }}>
                        <div style={{ height: '140px', backgroundColor: activePalette.colors[2], borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                        <h4 style={{ color: activePalette.colors[0], marginBottom: '0.5rem', fontSize: '1.2rem' }}>Security Plus</h4>
                        <span style={{ color: activePalette.colors[2], fontWeight: 600, fontSize: '1.1rem' }}>$25.00</span>
                      </div>
                      <div className="feature-card" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0], border: `1px solid ${activePalette.colors[2]}` }}>
                        <div style={{ height: '140px', backgroundColor: activePalette.colors[0], borderRadius: '12px', marginBottom: '1.5rem' }}></div>
                        <h4 style={{ color: activePalette.colors[0], marginBottom: '0.5rem', fontSize: '1.2rem' }}>Speed Boost</h4>
                        <span style={{ color: activePalette.colors[2], fontWeight: 600, fontSize: '1.1rem' }}>$10.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Reviews */}
                  <div className="desktop-reviews" style={{ backgroundColor: activePalette.colors[4], padding: '5rem 4rem 8rem' }}>
                    <h3 style={{ color: activePalette.colors[0], textAlign: 'center', marginBottom: '4rem', fontSize: '2rem' }}>Sweet Reviews</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                      <div style={{ padding: '2rem', backgroundColor: activePalette.colors[3], borderRadius: '16px' }}>
                        <h5 style={{ color: activePalette.colors[0], marginBottom: '1rem', fontSize: '1.2rem' }}>Emma Davis</h5>
                        <p style={{ color: activePalette.colors[1], fontSize: '1rem', lineHeight: 1.6 }}>"Absolutely changed the way I work. The intuitive design and speed are unmatched."</p>
                      </div>
                      <div style={{ padding: '2rem', backgroundColor: activePalette.colors[3], borderRadius: '16px' }}>
                        <h5 style={{ color: activePalette.colors[0], marginBottom: '1rem', fontSize: '1.2rem' }}>Michael Lee</h5>
                        <p style={{ color: activePalette.colors[1], fontSize: '1rem', lineHeight: 1.6 }}>"Incredible value for the price. I recommend this to all my colleagues."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="desktop-base"></div>
            </div>
          </div>
        </section>

        {/* SECTION 2: COMPONENTS */}
        <section className="preview-section">
          <div className="section-title">
            <h3 style={{ color: activePalette.colors[0] }}>Component Showcase</h3>
            <p style={{ color: activePalette.colors[1] }}>How your palette maps to micro details and inputs.</p>
          </div>

          <div className="design-system-showcase">
            {/* Sub-section 1: Basic Elements */}
            <div className="showcase-subsection">
              <h4 style={{ color: activePalette.colors[0], marginBottom: '1.5rem', borderBottom: `1px solid ${activePalette.colors[3]}`, paddingBottom: '0.5rem' }}>1. Basic Elements</h4>
              
              <div className="showcase-group">
                <div className="showcase-group-title" style={{ color: activePalette.colors[1] }}>Buttons</div>
                <div className="showcase-row">
                  <button style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4], border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>Primary</button>
                  <button style={{ backgroundColor: activePalette.colors[3], color: activePalette.colors[0], border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>Secondary</button>
                  <button style={{ backgroundColor: 'transparent', color: activePalette.colors[2], border: `2px solid ${activePalette.colors[2]}`, padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>Outline</button>
                  <button style={{ backgroundColor: 'transparent', color: activePalette.colors[1], border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}>Ghost</button>
                </div>
              </div>

              <div className="showcase-group">
                <div className="showcase-group-title" style={{ color: activePalette.colors[1] }}>Badges</div>
                <div className="showcase-row">
                  {activePalette.colors.map((c, i) => (
                    <span key={i} style={{ backgroundColor: c, color: getLuminance(...hexToRgb(c)) > 0.5 ? '#000' : '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                      Badge {i+1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-section 2: Form Elements */}
            <div className="showcase-subsection">
              <h4 style={{ color: activePalette.colors[0], marginBottom: '1.5rem', borderBottom: `1px solid ${activePalette.colors[3]}`, paddingBottom: '0.5rem' }}>2. Form Elements</h4>
              
              <div className="showcase-row" style={{ alignItems: 'flex-start' }}>
                <div className="showcase-group" style={{ flex: 1 }}>
                  <div className="showcase-group-title" style={{ color: activePalette.colors[1] }}>Text Inputs</div>
                  <input type="text" placeholder="Inactive input..." style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem 1rem', borderRadius: '8px', border: `1px solid ${activePalette.colors[3]}`, backgroundColor: activePalette.colors[4], color: activePalette.colors[0] }} />
                  <input type="text" defaultValue="Active input text" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: `2px solid ${activePalette.colors[2]}`, backgroundColor: activePalette.colors[4], color: activePalette.colors[0], outline: 'none' }} />
                </div>
                
                <div className="showcase-group" style={{ flex: 1 }}>
                  <div className="showcase-group-title" style={{ color: activePalette.colors[1] }}>Controls</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: activePalette.colors[0], cursor: 'pointer', fontWeight: 500 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: activePalette.colors[2], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} color={activePalette.colors[4]} />
                      </div>
                      Checked Checkbox
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: activePalette.colors[0], cursor: 'pointer', fontWeight: 500 }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${activePalette.colors[3]}`, backgroundColor: 'transparent' }}></div>
                      Unchecked Checkbox
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: activePalette.colors[0], cursor: 'pointer', marginTop: '0.5rem', fontWeight: 500 }}>
                      <div style={{ width: '40px', height: '24px', borderRadius: '12px', backgroundColor: activePalette.colors[2], position: 'relative' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: activePalette.colors[4], position: 'absolute', top: '3px', right: '3px' }}></div>
                      </div>
                      Toggle Switch (On)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-section 3: Surfaces & Cards */}
            <div className="showcase-subsection">
              <h4 style={{ color: activePalette.colors[0], marginBottom: '1.5rem', borderBottom: `1px solid ${activePalette.colors[3]}`, paddingBottom: '0.5rem' }}>3. Surfaces & Cards</h4>
              
              <div className="showcase-row" style={{ alignItems: 'stretch' }}>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[4], padding: '1.5rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: `1px solid ${activePalette.colors[3]}` }}>
                  <h5 style={{ color: activePalette.colors[0], marginBottom: '0.5rem', fontSize: '1.1rem' }}>Elevated Card</h5>
                  <p style={{ color: activePalette.colors[1], fontSize: '0.9rem', lineHeight: 1.5 }}>This surface uses subtle shadows and borders to stand out from the background.</p>
                </div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[3], padding: '1.5rem', borderRadius: '12px' }}>
                  <h5 style={{ color: activePalette.colors[0], marginBottom: '0.5rem', fontSize: '1.1rem' }}>Flat Surface</h5>
                  <p style={{ color: activePalette.colors[1], fontSize: '0.9rem', lineHeight: 1.5 }}>This surface uses a solid contrast color to differentiate itself without elevation.</p>
                </div>
              </div>
              
              <div className="showcase-group" style={{ marginTop: '2rem' }}>
                <div className="showcase-group-title" style={{ color: activePalette.colors[1] }}>Alerts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: `${activePalette.colors[2]}20`, borderLeft: `4px solid ${activePalette.colors[2]}` }}>
                    <Shield size={20} color={activePalette.colors[2]} />
                    <span style={{ color: activePalette.colors[0], fontWeight: 500 }}>Primary Alert: Your settings have been saved successfully.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '8px', backgroundColor: `${activePalette.colors[0]}10`, borderLeft: `4px solid ${activePalette.colors[0]}` }}>
                    <Bell size={20} color={activePalette.colors[0]} />
                    <span style={{ color: activePalette.colors[0], fontWeight: 500 }}>Neutral Alert: You have 3 new notifications waiting to be read.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-section 4: Complex Layouts */}
            <div className="showcase-subsection">
              <h4 style={{ color: activePalette.colors[0], marginBottom: '1.5rem', borderBottom: `1px solid ${activePalette.colors[3]}`, paddingBottom: '0.5rem' }}>4. Complex Layouts</h4>
              <div className="component-grid">
            {/* Component 1: Login Form */}
            <div className="showcase-card login-form" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0], borderColor: activePalette.colors[3] }}>
              <div className="card-header" style={{ borderBottomColor: activePalette.colors[3] }}>
                <h3>Welcome Back</h3>
                <p style={{ color: activePalette.colors[1], fontSize: '0.9rem' }}>Please enter your details to sign in.</p>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper" style={{ borderColor: activePalette.colors[2], backgroundColor: activePalette.colors[3] }}>
                  <Mail size={18} color={activePalette.colors[1]} />
                  <input type="text" placeholder="you@example.com" style={{ color: activePalette.colors[0] }} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 'auto' }}>
                <label>Password</label>
                <div className="input-wrapper" style={{ borderColor: activePalette.colors[3], backgroundColor: activePalette.colors[3] }}>
                  <Lock size={18} color={activePalette.colors[1]} />
                  <input type="password" placeholder="••••••••" style={{ color: activePalette.colors[0] }} />
                </div>
              </div>
              <button className="btn-full" style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4], marginTop: '1.5rem' }}>
                Sign In
              </button>
            </div>

            {/* Component 2: Music Player */}
            <div className="showcase-card music-player" style={{ backgroundColor: activePalette.colors[0], color: activePalette.colors[4], justifyContent: 'space-between' }}>
              <div className="album-art" style={{ backgroundColor: activePalette.colors[1], marginTop: '1rem' }}>
                <div className="vinyl-groove" style={{ borderColor: activePalette.colors[0] }}></div>
              </div>
              <div className="track-info" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: activePalette.colors[3] }}>Midnight Vibes</h4>
                <p style={{ color: activePalette.colors[2] }}>Lo-Fi Beats</p>
              </div>
              <div className="progress-bar-container" style={{ marginBottom: '1.5rem' }}>
                <div className="progress-bar-bg" style={{ backgroundColor: activePalette.colors[1] }}>
                  <div className="progress-bar-fill" style={{ backgroundColor: activePalette.colors[2], width: '60%' }}></div>
                </div>
                <div className="time-info" style={{ color: activePalette.colors[3] }}>
                  <span>1:24</span>
                  <span>3:42</span>
                </div>
              </div>
              <div className="player-controls" style={{ color: activePalette.colors[4], marginBottom: '1rem' }}>
                <SkipBack size={24} />
                <div className="play-btn" style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[0] }}>
                  <Play size={24} fill="currentColor" />
                </div>
                <SkipForward size={24} />
              </div>
            </div>

            {/* Component 3: Pricing Card */}
            <div className="showcase-card pricing-card" style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0], borderColor: activePalette.colors[1] }}>
              <div className="popular-badge" style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4] }}>Most Popular</div>
              <h3 style={{ color: activePalette.colors[1] }}>Pro Plan</h3>
              <div className="price" style={{ color: activePalette.colors[0] }}>
                <span className="currency">$</span>
                <span className="amount">29</span>
                <span className="period">/mo</span>
              </div>
              <ul className="features-list" style={{ marginBottom: 'auto' }}>
                <li><span style={{ color: activePalette.colors[2] }}>✓</span> Unlimited Projects</li>
                <li><span style={{ color: activePalette.colors[2] }}>✓</span> Priority Support</li>
                <li style={{ color: activePalette.colors[1] }}><span style={{ color: activePalette.colors[2] }}>✓</span> Advanced Analytics</li>
                <li style={{ color: activePalette.colors[3] }}><span>✗</span> Custom Domain</li>
              </ul>
              <button className="btn-full" style={{ backgroundColor: activePalette.colors[1], color: activePalette.colors[4] }}>
                Upgrade Now
              </button>
            </div>

            {/* Component 4: Settings Menu */}
            <div className="showcase-card settings-menu" style={{ backgroundColor: activePalette.colors[3], color: activePalette.colors[0], borderColor: activePalette.colors[2] }}>
              <div className="menu-header" style={{ borderBottomColor: activePalette.colors[2] }}>
                <User size={40} color={activePalette.colors[4]} style={{ backgroundColor: activePalette.colors[1], padding: '8px', borderRadius: '50%' }} />
                <div>
                  <h4 style={{ color: activePalette.colors[0] }}>Jane Doe</h4>
                  <p style={{ color: activePalette.colors[1], fontSize: '0.85rem' }}>Pro Member</p>
                </div>
              </div>
              <div className="menu-items" style={{ backgroundColor: activePalette.colors[4], flex: 1 }}>
                <div className="menu-item" style={{ borderBottomColor: activePalette.colors[3] }}>
                  <div className="item-left">
                    <Bell size={18} color={activePalette.colors[1]} />
                    <span>Notifications</span>
                  </div>
                  <div className="toggle active" style={{ backgroundColor: activePalette.colors[2] }}>
                    <div className="toggle-knob" style={{ backgroundColor: activePalette.colors[4] }}></div>
                  </div>
                </div>
                <div className="menu-item" style={{ borderBottomColor: activePalette.colors[3] }}>
                  <div className="item-left">
                    <Shield size={18} color={activePalette.colors[1]} />
                    <span>Privacy</span>
                  </div>
                  <span className="item-value" style={{ color: activePalette.colors[2] }}>Public</span>
                </div>
                <div className="menu-item">
                  <div className="item-left">
                    <Settings size={18} color={activePalette.colors[1]} />
                    <span>Preferences</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Component 5: Chat Bubbles */}
            <div className="showcase-card chat-container" style={{ backgroundColor: activePalette.colors[4], borderColor: activePalette.colors[3] }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
                <div className="chat-bubble received" style={{ backgroundColor: activePalette.colors[3], color: activePalette.colors[0] }}>
                  Hey! Notice how every single color from the 5-color palette is being used now?
                </div>
                <div className="chat-bubble sent" style={{ backgroundColor: activePalette.colors[2], color: activePalette.colors[4] }}>
                  Yes! It looks so much more dynamic and cohesive.
                </div>
              </div>
              <div className="chat-input-area" style={{ backgroundColor: activePalette.colors[3], borderTopColor: activePalette.colors[2] }}>
                <input type="text" placeholder="Type a message..." style={{ backgroundColor: activePalette.colors[4], color: activePalette.colors[0] }} />
                <button className="send-btn" style={{ backgroundColor: activePalette.colors[1], color: activePalette.colors[4] }}>Send</button>
              </div>
            </div>

            {/* Component 6: Analytics Dashboard Widget */}
            <div className="showcase-card stats-widget" style={{ backgroundColor: activePalette.colors[4], borderColor: activePalette.colors[3], padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ color: activePalette.colors[0], fontSize: '1.2rem' }}>Total Revenue</h3>
                <span style={{ color: activePalette.colors[2], fontWeight: 600 }}>+24%</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: activePalette.colors[1], marginBottom: '2rem' }}>$45,231</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '120px', marginTop: 'auto' }}>
                {/* Mock Chart Bars */}
                <div style={{ flex: 1, backgroundColor: activePalette.colors[3], height: '40%', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[3], height: '60%', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[2], height: '80%', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[3], height: '50%', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[1], height: '100%', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ flex: 1, backgroundColor: activePalette.colors[3], height: '70%', borderRadius: '4px 4px 0 0' }}></div>
              </div>
            </div>

            {/* Component 7: Task List */}
            <div className="showcase-card task-list" style={{ backgroundColor: activePalette.colors[0], borderColor: activePalette.colors[1] }}>
              <div className="card-header" style={{ borderBottom: `1px solid ${activePalette.colors[1]}`, padding: '2rem' }}>
                <h3 style={{ color: activePalette.colors[4] }}>Daily Tasks</h3>
                <p style={{ color: activePalette.colors[3], fontSize: '0.9rem' }}>3 of 5 completed today.</p>
              </div>
              <div style={{ padding: '0 2rem' }}>
                {[
                  { text: 'Review design mockups', done: true },
                  { text: 'Update color palette logic', done: true },
                  { text: 'Push to production', done: false },
                  { text: 'Write release notes', done: false }
                ].map((task, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 0', borderBottom: `1px solid ${activePalette.colors[1]}` }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${activePalette.colors[2]}`, backgroundColor: task.done ? activePalette.colors[2] : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {task.done && <span style={{ color: activePalette.colors[4], fontSize: '12px' }}>✓</span>}
                    </div>
                    <span style={{ color: task.done ? activePalette.colors[3] : activePalette.colors[4], textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
                  </div>
                ))}
              </div>
              <button style={{ margin: 'auto 2rem 2rem', padding: '1rem', backgroundColor: activePalette.colors[2], color: activePalette.colors[4], border: 'none', borderRadius: '8px', fontWeight: 600 }}>Add New Task</button>
            </div>

            {/* Component 8: Profile Card */}
            <div className="showcase-card profile-card" style={{ backgroundColor: activePalette.colors[4], borderColor: activePalette.colors[1], alignItems: 'center', textAlign: 'center' }}>
              <div style={{ height: '120px', width: '100%', backgroundColor: activePalette.colors[2] }}></div>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: activePalette.colors[3], border: `4px solid ${activePalette.colors[4]}`, marginTop: '-45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={40} color={activePalette.colors[1]} />
              </div>
              <h3 style={{ color: activePalette.colors[0], marginTop: '1rem' }}>Alex Developer</h3>
              <p style={{ color: activePalette.colors[1], marginBottom: '2rem' }}>Frontend Engineer</p>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: 'auto' }}>
                <div>
                  <div style={{ color: activePalette.colors[0], fontWeight: 700, fontSize: '1.2rem' }}>142</div>
                  <div style={{ color: activePalette.colors[1], fontSize: '0.85rem' }}>Posts</div>
                </div>
                <div>
                  <div style={{ color: activePalette.colors[0], fontWeight: 700, fontSize: '1.2rem' }}>8.5k</div>
                  <div style={{ color: activePalette.colors[1], fontSize: '0.85rem' }}>Followers</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', width: '100%', padding: '2rem' }}>
                <button style={{ flex: 1, padding: '0.8rem', backgroundColor: activePalette.colors[2], color: activePalette.colors[4], border: 'none', borderRadius: '8px', fontWeight: 600 }}>Follow</button>
                <button style={{ flex: 1, padding: '0.8rem', backgroundColor: 'transparent', color: activePalette.colors[2], border: `2px solid ${activePalette.colors[2]}`, borderRadius: '8px', fontWeight: 600 }}>Message</button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* SECTION 3: GRADIENT GENERATOR */}
        <section className="preview-section">
          <div className="section-title">
            <h3 style={{ color: activePalette.colors[0] }}>Gradient Generator</h3>
            <p style={{ color: activePalette.colors[1] }}>Auto-generated gradients from your palette. Click to copy CSS.</p>
          </div>

          <div className="gradient-grid">
            {gradients.map((g, i) => (
              <div
                key={i}
                className="gradient-card"
                onClick={() => handleCopyGradient(i, g.css)}
              >
                <div className="gradient-preview" style={{ background: g.css }}></div>
                <div className="gradient-info">
                  <span className="gradient-name">{g.name}</span>
                  <span className="gradient-copy">
                    {gradientCopied === i ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy CSS</>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: COLOR CONTRAST CHECKER */}
        <section className="preview-section">
          <div className="section-title">
            <h3 style={{ color: activePalette.colors[0] }}>Color Contrast Checker</h3>
            <p style={{ color: activePalette.colors[1] }}>Check WCAG accessibility for text readability.</p>
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(255,255,255,0.4)', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: activePalette.colors[0],
              lineHeight: 1.6,
              maxWidth: '800px',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <strong>How to read this:</strong> A higher ratio number means the text is easier to read against the background.<br/>
              • <strong>AAA:</strong> Excellent! Super easy to read for everyone.<br/>
              • <strong>AA:</strong> Good enough for most normal text.<br/>
              • <strong>AA Large:</strong> Only good for big, bold text like titles or headers.<br/>
              If no badges appear, it means you shouldn't use this color combination for text—it's too hard to read!
            </div>
          </div>

          <div className="contrast-grid">
            {contrastPairs.map((pair, i) => {
              const ratio = getContrastRatio(pair.fg, pair.bg);
              const aaa = ratio >= 7;
              const aa = ratio >= 4.5;
              const aaLarge = ratio >= 3;
              
              return (
                <div key={i} className="contrast-card" style={{ backgroundColor: pair.bg }}>
                  <div className="contrast-preview" style={{ color: pair.fg }}>
                    <div className="contrast-name">{pair.name}</div>
                    <div className="contrast-ratio">{ratio.toFixed(2)}:1</div>
                  </div>
                  <div className="contrast-badges" style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {aaa && <span className="contrast-badge pass" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> AAA</span>}
                    {aa && !aaa && <span className="contrast-badge pass" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> AA</span>}
                    {aaLarge && !aa && <span className="contrast-badge pass" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> AA Large</span>}
                    {!aaLarge && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: pair.fg, opacity: 0.6 }}>Not Recommended</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: COLOR BLINDNESS SIMULATOR */}
        <section className="preview-section" style={{ paddingBottom: '6rem' }}>
          <div className="section-title">
            <h3 style={{ color: activePalette.colors[0] }}>Color Blindness Simulator</h3>
            <p style={{ color: activePalette.colors[1] }}>See how your palette appears to users with different types of color blindness.</p>
          </div>

          <div className="blindness-grid">
            {colorBlindnessTypes.map((type) => (
              <div key={type.id} className="blindness-row">
                <div className="blindness-label">{type.name}</div>
                <div className="blindness-swatches" style={type.id !== 'normal' ? { filter: `url(#${type.id})` } : {}}>
                  {activePalette.colors.map((c, idx) => (
                    <div key={idx} className="blindness-swatch" style={{ backgroundColor: c }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      {showExportModal && (
        <ExportModal palette={activePalette} onClose={() => setShowExportModal(false)} />
      )}
    </PageTransition>
  );
};
