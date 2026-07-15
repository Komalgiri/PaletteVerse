import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Dices, Lock, Unlock, Download, Upload, X } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportModal } from '../components/ExportModal';
import type { Palette } from '../data/palettes';
import './Creator.css';

export const Creator: React.FC = () => {
  const navigate = useNavigate();
  
  const [colors, setColors] = useState([
    '#0b1622', '#082531', '#547677', '#80b8b5', '#cbd3d2'
  ]);
  const [colorNames, setColorNames] = useState([
    'Darkest', 'Dark', 'Primary', 'Surface', 'Background'
  ]);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  
  const [headingFont, setHeadingFont] = useState('Outfit');
  const [bodyFont, setBodyFont] = useState('Inter');
  const fontOptions = ['Inter', 'Outfit', 'Playfair Display', 'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Poppins'];

  // Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleRandomize = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const baseSat = Math.floor(Math.random() * 40) + 50;
    
    const newPalette = [
      hslToHex(baseHue, baseSat, 15),
      hslToHex((baseHue + 10) % 360, baseSat, 35),
      hslToHex((baseHue + 20) % 360, baseSat, 55),
      hslToHex((baseHue + 30) % 360, baseSat - 10, 75),
      hslToHex((baseHue + 40) % 360, baseSat - 20, 92)
    ];

    setColors(prev => prev.map((color, i) => locked[i] ? color : newPalette[i]));
  };

  const handleColorChange = (index: number, newColor: string) => {
    setColors(prev => {
      const newColors = [...prev];
      newColors[index] = newColor;
      return newColors;
    });
  };

  const handleColorNameChange = (index: number, newName: string) => {
    setColorNames(prev => {
      const newNames = [...prev];
      newNames[index] = newName;
      return newNames;
    });
  };

  const toggleLock = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocked(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const handleTestInSandbox = () => {
    navigate('/live-preview', { 
      state: { 
        customPalette: {
          id: 'custom',
          name: 'Custom Creation',
          colors: colors,
          colorNames: colorNames,
          headingFont: headingFont,
          bodyFont: bodyFont,
          tags: ['Custom']
        }
      } 
    });
  };

  const handleImport = () => {
    // Extract hex codes from text
    const hexRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g;
    const matches = importText.match(hexRegex);
    
    if (matches && matches.length > 0) {
      const newColors = [...colors];
      for (let i = 0; i < Math.min(5, matches.length); i++) {
        newColors[i] = matches[i].toLowerCase();
      }
      setColors(newColors);
      setShowImportModal(false);
      setImportText('');
    } else {
      alert("No valid hex colors found in the input.");
    }
  };

  const currentPalette: Palette = {
    id: 'custom',
    name: 'Custom Creation',
    colors,
    colorNames,
    headingFont,
    bodyFont,
    tags: ['Custom']
  };

  return (
    <PageTransition className="creator-page">
      <div className="creator-header">
        <div>
          <h1 className="heading-lg">Brandkit Studio</h1>
          <p className="text-secondary">Customize colors and fonts to build your perfect aesthetic.</p>
        </div>
        <div className="creator-actions">
          <button className="btn-secondary btn-lg hover-lift" onClick={() => setShowImportModal(true)}>
            <Upload size={20} /> Import
          </button>
          <button className="btn-secondary btn-lg hover-lift" onClick={() => setShowExportModal(true)}>
            <Download size={20} /> Export
          </button>
          <button className="btn-secondary btn-lg hover-lift" onClick={handleRandomize}>
            <Dices size={20} /> Randomize
          </button>
          <button className="btn-primary btn-lg hover-lift" onClick={handleTestInSandbox}>
            <Play size={20} /> Sandbox
          </button>
        </div>
      </div>

      <div className="typography-bar glass-panel">
        <div className="font-selector">
          <label>Heading Font</label>
          <select value={headingFont} onChange={e => setHeadingFont(e.target.value)}>
            {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="font-selector">
          <label>Body Font</label>
          <select value={bodyFont} onChange={e => setBodyFont(e.target.value)}>
            {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="creator-workspace">
        {colors.map((color, i) => (
          <motion.div 
            key={i}
            className="color-pillar"
            style={{ backgroundColor: color }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            onClick={() => inputRefs[i].current?.click()}
          >
            <input 
              type="color" 
              ref={inputRefs[i]} 
              value={color} 
              onChange={(e) => handleColorChange(i, e.target.value)}
              className="hidden-color-input"
            />
            
            <div className="pillar-content">
              <input 
                type="text" 
                className="color-name-input"
                value={colorNames[i]}
                onChange={e => handleColorNameChange(i, e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder="Name"
              />
              <span className="color-hex">{color.toUpperCase()}</span>
              <button 
                className={`lock-btn ${locked[i] ? 'is-locked' : ''}`}
                onClick={(e) => toggleLock(i, e)}
              >
                {locked[i] ? <Lock size={24} /> : <Unlock size={24} />}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      {showExportModal && (
        <ExportModal palette={currentPalette} onClose={() => setShowExportModal(false)} />
      )}
      
      <AnimatePresence>
        {showImportModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowImportModal(false)}>
            <motion.div className="modal-content glass-panel" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Import Theme</h3>
                <button className="icon-btn" onClick={() => setShowImportModal(false)}><X size={24} /></button>
              </div>
              <p className="modal-desc text-secondary">Paste a list of hex codes or JSON containing colors. We'll extract the first 5 colors.</p>
              <textarea 
                className="import-textarea"
                placeholder="e.g. #000000, #FFFFFF, etc."
                value={importText}
                onChange={e => setImportText(e.target.value)}
              />
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowImportModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleImport}>Import Colors</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
