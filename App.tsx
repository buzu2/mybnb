
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import About from './pages/About';
import Apartments from './pages/Apartments';
import PropertyDetails from './pages/PropertyDetails';
import Admin from './pages/Admin';
import { PropertyProvider, useProperties } from './contexts/PropertyContext';
import ScrollToTop from './components/ScrollToTop';

// Helper component to scroll to top on route change
const ScrollHandler = () => {
    ScrollToTop();
    return null;
};

// Component to handle script injection
const MarketingScriptInjector = () => {
  const { settings } = useProperties();

  useEffect(() => {
    // Inject Google Tag
    if (settings.googleTagId && !document.getElementById('google-analytics-script')) {
      const script = document.createElement('script');
      script.id = 'google-analytics-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleTagId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.id = 'google-analytics-inline';
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleTagId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Inject Facebook Pixel
    if (settings.facebookPixelId && !document.getElementById('facebook-pixel-script')) {
      const script = document.createElement('script');
      script.id = 'facebook-pixel-script';
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, [settings]);

  return null;
};

const AppContent: React.FC = () => {
   return (
      <Router>
        <div className="flex flex-col min-h-screen">
          <ScrollHandler />
          <MarketingScriptInjector />
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
   );
};

const App: React.FC = () => {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
};

export default App;
