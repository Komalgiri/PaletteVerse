
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Home } from './pages/Home'
import { LivePreview } from './pages/LivePreview'
import { Explore } from './pages/Explore'
import { Creator } from './pages/Creator'

import { Play } from './pages/Play'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<Creator />} />
        <Route path="/play" element={<Play />} />
        <Route path="/live-preview" element={<LivePreview />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
