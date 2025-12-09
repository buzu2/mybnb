import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import About from './pages/About';
import Apartments from './pages/Apartments';
import PropertyDetails from './pages/PropertyDetails';
import Admin from './pages/Admin';
import { PropertyProvider } from './contexts/PropertyContext';
import ScrollToTop from './components/ScrollToTop';

// Helper component to scroll to top on route change
const ScrollHandler = () => {
    ScrollToTop();
    return null;
};

const App: React.FC = () => {
  return (
    <PropertyProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ScrollHandler />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/apartments" element={<Apartments />} />
              <Route path="/apartments/:id" element={<PropertyDetails />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <FloatingWhatsApp />
          <Footer />
        </div>
      </Router>
    </PropertyProvider>
  );
};

export default App;
