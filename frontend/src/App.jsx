import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider, PortfolioContext } from './context/PortfolioContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Loader from './components/Loader.jsx';

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const { settings } = useContext(PortfolioContext);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return showIntro ? (
    <Loader onComplete={handleIntroComplete} bannerImage={settings?.bannerImage} />
  ) : (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
