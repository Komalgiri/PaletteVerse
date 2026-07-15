import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import type { Palette } from '../data/palettes';
import '../pages/Creator.css';

interface ExportModalProps {
  palette: Palette | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ palette, onClose }) => {
  const [exportTab, setExportTab] = useState<'css' | 'tailwind' | 'json'>('css');
  const [copied, setCopied] = useState(false);

  // Reset tab when palette changes
  useEffect(() => {
    if (palette) setExportTab('css');
  }, [palette]);

  const getExportSnippet = () => {
    if (!palette) return '';
    const { colors, colorNames, headingFont = 'Inter', bodyFont = 'Inter' } = palette;
    const names = colorNames || ['Darkest', 'Dark', 'Primary', 'Surface', 'Background'];
    const cssNames = names.map(name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    if (exportTab === 'css') {
      return `:root {\n${colors.map((c, i) => `  --color-${cssNames[i]}: ${c};`).join('\n')}
  --font-heading: '${headingFont}', sans-serif;
  --font-body: '${bodyFont}', sans-serif;
}`;
    } else if (exportTab === 'tailwind') {
      return `module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['${headingFont}', 'sans-serif'],
        body: ['${bodyFont}', 'sans-serif'],
      },
      colors: {
        brand: {
${colors.map((c, i) => `          '${cssNames[i]}': '${c}',`).join('\n')}
        }
      }
    }
  }
}`;
    } else {
      const jsonObj: Record<string, string> = { headingFont, bodyFont };
      names.forEach((_, i) => {
        jsonObj[cssNames[i]] = colors[i];
      });
      return JSON.stringify(jsonObj, null, 2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {palette && (
        <motion.div
          key="export-modal-overlay"
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content glass-panel"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Export Brandkit — {palette.name}</h3>
              <button className="icon-btn" onClick={onClose}><X size={24} /></button>
            </div>
            <div className="modal-tabs">
              <button className={`tab-btn ${exportTab === 'css' ? 'active' : ''}`} onClick={() => setExportTab('css')}>CSS Vars</button>
              <button className={`tab-btn ${exportTab === 'tailwind' ? 'active' : ''}`} onClick={() => setExportTab('tailwind')}>Tailwind</button>
              <button className={`tab-btn ${exportTab === 'json' ? 'active' : ''}`} onClick={() => setExportTab('json')}>JSON</button>
            </div>
            <div className="code-snippet-wrapper">
              <pre className="code-snippet">
                <code>{getExportSnippet()}</code>
              </pre>
              <button className="copy-btn btn-primary" onClick={handleCopy}>
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
