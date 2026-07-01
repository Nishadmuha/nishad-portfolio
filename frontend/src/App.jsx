import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { PortfolioProvider, PortfolioContext } from './context/PortfolioContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import Loader from './components/Loader.jsx';

// Import Admin components
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ProtectedRoute from './pages/admin/ProtectedRoute.jsx';

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function AppContent() {
  const isAdminPath = window.location.pathname.startsWith('/admin');
  const [showIntro, setShowIntro] = useState(!isAdminPath);
  const { settings } = useContext(PortfolioContext);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return showIntro ? (
    <Loader onComplete={handleIntroComplete} bannerImage={settings?.bannerImage} />
  ) : (
    <Router>
      <Routes>
        {/* Main Portfolio Website Layout (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Standalone Admin Views (No Navbar/Footer) */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
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
