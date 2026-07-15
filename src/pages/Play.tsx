import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { Circle } from 'lucide-react';
import './Play.css';

const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const generateThemeColor = (theme: 'vibrant' | 'dark' | 'soft' | 'light', specificHue?: number) => {
  const h = specificHue !== undefined ? specificHue : Math.floor(Math.random() * 360);
  let s, l;
  
  // 15% chance to generate a neutral/greyscale tone appropriate for the theme
  const isNeutral = Math.random() < 0.15;

  switch (theme) {
    case 'dark':
      s = isNeutral ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 40) + 40; 
      l = isNeutral ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 20) + 15; 
      break;
    case 'soft':
      // Pastels: good saturation, medium-high lightness
      s = isNeutral ? Math.floor(Math.random() * 15) + 10 : Math.floor(Math.random() * 30) + 50; // 50-80%
      l = Math.floor(Math.random() * 15) + 65; // 65-80%
      break;
    case 'light':
      // Barely there tints: very low saturation, extremely high lightness
      s = isNeutral ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 20) + 10; // 10-30%
      l = isNeutral ? Math.floor(Math.random() * 3) + 96 : Math.floor(Math.random() * 6) + 90; // 90-95%
      break;
    case 'vibrant':
    default:
      s = isNeutral ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 40) + 60; 
      l = isNeutral ? Math.floor(Math.random() * 20) + 40 : Math.floor(Math.random() * 40) + 40; 
      break;
  }
  return hslToHex(h, s, l);
};

const generateRandomColor = () => generateThemeColor('vibrant');

export const Play: React.FC = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<'menu' | 'spin' | 'popper'>('menu');
  const [collectedColors, setCollectedColors] = useState<string[]>([]);

  // Bubble state for Popper
  const [bubbles, setBubbles] = useState<{ id: number; color: string; left: number; speed: number }[]>([]);
  
  useEffect(() => {
    if (collectedColors.length === 5) {
      // Go to live preview
      const customPalette = {
        id: 'game-palette-' + Date.now(),
        name: 'My Won Palette',
        description: `Generated via ${activeGame} minigame!`,
        colors: collectedColors,
        fontPrimary: 'Inter',
        fontSecondary: 'Roboto',
        tags: ['game', 'custom']
      };
      
      // Reset after a tiny delay so user sees they got the 5th color
      setTimeout(() => {
        navigate('/live-preview', { state: { customPalette } });
        setCollectedColors([]);
        setActiveGame('menu');
      }, 800);
    }
  }, [collectedColors, navigate, activeGame]);

  // SPIN GAME LOGIC
  const [wheelTheme, setWheelTheme] = useState<'vibrant' | 'dark' | 'soft' | 'light'>('vibrant');
  
  const generateSortedColors = (theme: 'vibrant' | 'dark' | 'soft' | 'light') => {
    const colors = Array(40).fill('').map(() => {
      const h = Math.floor(Math.random() * 360);
      return { hex: generateThemeColor(theme, h), h };
    });
    // Sort by hue for a beautiful, smooth gradient look
    colors.sort((a, b) => a.h - b.h);
    return colors.map(c => c.hex);
  };

  const [wheelColors, setWheelColors] = useState<string[]>(generateSortedColors('vibrant'));
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!isSpinning) {
      setWheelColors(generateSortedColors(wheelTheme));
    }
  }, [wheelTheme]);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Add 5-10 full spins plus a random offset
    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360; 
    const randomOffset = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraSpins + randomOffset;
    
    setRotation(newRotation);
    
    // Wait for the CSS transition to finish
    setTimeout(() => {
      setIsSpinning(false);
      
      const normalizedRot = newRotation % 360;
      // The pointer is at the top (0 deg). The wheel rotates clockwise.
      // So the point of the wheel at the top is (360 - normalizedRot)
      const pointerAngle = (360 - normalizedRot) % 360;
      // 40 slices -> 360/40 degrees each
      const sliceIndex = Math.floor(pointerAngle / (360 / 40));
      const pickedColor = wheelColors[sliceIndex];
      
      setCollectedColors(prev => {
        if (prev.length < 5) return [...prev, pickedColor];
        return prev;
      });
      
      // Optionally randomize the wheel for the next spin using current theme
      setTimeout(() => setWheelColors(generateSortedColors(wheelTheme)), 500);
      
    }, 3000); // match transition duration
  };

  // POPPER GAME LOGIC
  useEffect(() => {
    if (activeGame === 'popper') {
      const interval = setInterval(() => {
        setBubbles(prev => {
          // Keep max 12 bubbles
          if (prev.length > 12) return prev.slice(1);
          return [...prev, {
            id: Date.now(),
            color: generateRandomColor(),
            left: Math.random() * 80 + 10, // 10% to 90%
            speed: Math.random() * 4 + 4 // 4s to 8s (slower for easier clicking)
          }];
        });
      }, 900); // slightly slower spawn rate
      return () => clearInterval(interval);
    }
  }, [activeGame]);

  const handlePop = (color: string, id: number) => {
    setCollectedColors(prev => {
      if (prev.length < 5) return [...prev, color];
      return prev;
    });
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <PageTransition>
      <div className="play-container">
        
        {/* GAME SELECTION MENU */}
        {activeGame === 'menu' && (
          <div className="game-menu">
            <h1 className="heading-lg" style={{ textAlign: 'center', marginBottom: '1rem' }}>Play & <span className="text-gradient">Discover</span></h1>
            <p className="subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>Build your 5-color palette by playing a mini-game!</p>
            
            <div className="game-cards">
              <div className="game-card" onClick={() => { setActiveGame('spin'); setCollectedColors([]); setRotation(0); }}>
                <div className="game-icon-wrapper" style={{ background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' }}>
                  <Circle color="white" size={32} />
                </div>
                <h3>Color Roulette</h3>
                <p>Spin the wheel of fate! Let chance decide your palette. Spin 5 times to win.</p>
                <button className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>Play Spin</button>
              </div>

              <div className="game-card" onClick={() => { setActiveGame('popper'); setCollectedColors([]); setBubbles([]); }}>
                <div className="game-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
                  <Circle color="white" size={32} />
                </div>
                <h3>Color Popper</h3>
                <p>Colorful bubbles float up! Catch and pop 5 bubbles you love before they float away.</p>
                <button className="btn-primary" style={{ marginTop: 'auto', width: '100%' }}>Play Popper</button>
              </div>
            </div>
          </div>
        )}

        {/* SPIN GAME */}
        {activeGame === 'spin' && (
          <div className="spin-game">
            <button className="back-btn" onClick={() => setActiveGame('menu')}>← Exit Game</button>
            <div className="game-header">
              <h2>Color Roulette</h2>
              <div className="progress-bar">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="progress-dot" style={{ backgroundColor: collectedColors[i] || 'var(--border-color)' }}></div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button onClick={() => setWheelTheme('vibrant')} className="back-btn" style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '20px', background: wheelTheme === 'vibrant' ? 'var(--accent-primary)' : 'transparent', color: wheelTheme === 'vibrant' ? 'white' : 'var(--text-secondary)' }}>Vibrant</button>
              <button onClick={() => setWheelTheme('dark')} className="back-btn" style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '20px', background: wheelTheme === 'dark' ? 'var(--accent-primary)' : 'transparent', color: wheelTheme === 'dark' ? 'white' : 'var(--text-secondary)' }}>Dark</button>
              <button onClick={() => setWheelTheme('soft')} className="back-btn" style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '20px', background: wheelTheme === 'soft' ? 'var(--accent-primary)' : 'transparent', color: wheelTheme === 'soft' ? 'white' : 'var(--text-secondary)' }}>Soft</button>
              <button onClick={() => setWheelTheme('light')} className="back-btn" style={{ margin: 0, padding: '0.5rem 1rem', borderRadius: '20px', background: wheelTheme === 'light' ? 'var(--accent-primary)' : 'transparent', color: wheelTheme === 'light' ? 'white' : 'var(--text-secondary)' }}>Light</button>
            </div>

            <div className="spin-wheel-container">
              <div className="spin-pointer"></div>
              <div 
                className="spin-wheel"
                style={{
                  background: `conic-gradient(
                    ${wheelColors.map((c, i) => `${c} ${i * (360/40)}deg ${i * (360/40) + 7.5}deg, var(--bg-primary) ${i * (360/40) + 7.7}deg ${(i+1) * (360/40)}deg`).join(', ')}
                  )`,
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                }}
              ></div>
            </div>

            <div className="spin-actions">
              <button className="btn-primary btn-lg hover-lift" onClick={handleSpin} disabled={isSpinning} style={{ padding: '1rem 3rem', fontSize: '1.2rem', opacity: isSpinning ? 0.7 : 1 }}>
                {isSpinning ? 'Spinning...' : 'SPIN!'}
              </button>
            </div>
          </div>
        )}

        {/* POPPER GAME */}
        {activeGame === 'popper' && (
          <div className="popper-game">
            <button className="back-btn" style={{ position: 'relative', zIndex: 10 }} onClick={() => setActiveGame('menu')}>← Exit Game</button>
            <div className="game-header" style={{ position: 'relative', zIndex: 10 }}>
              <h2>Color Popper</h2>
              <div className="progress-bar">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="progress-dot" style={{ backgroundColor: collectedColors[i] || 'var(--border-color)' }}></div>
                ))}
              </div>
            </div>

            <div className="bubble-container">
              {bubbles.map(bubble => (
                <div 
                  key={bubble.id} 
                  className="bubble"
                  style={{ 
                    left: `${bubble.left}%`, 
                    animationDuration: `${bubble.speed}s`,
                    backgroundColor: bubble.color 
                  }}
                  onClick={() => handlePop(bubble.color, bubble.id)}
                >
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};
