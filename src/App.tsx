import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import AISection from './components/AISection';
import AutomationSection from './components/AutomationSection';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SidebarNav from './components/SidebarNav';
import NavigateYourNext from './pages/NavigateYourNext.tsx';
import OurWork from './pages/OurWork.tsx';
import Infrastructure from './pages/Infrastructure.tsx';
import ServiceDetail from './pages/ServiceDetail.tsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import './App.css';

function ScrollOnRouteState() {
  const location = useLocation();
  useEffect(() => {
    const id = (location.state as any)?.scrollTo as string | undefined;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    const offset = navbar ? navbar.getBoundingClientRect().height + 12 : 72;
    const rect = el.getBoundingClientRect();
    const top = rect.top + (window.scrollY || 0) - offset;
    requestAnimationFrame(() => window.scrollTo({ top, behavior: 'smooth' }));
  }, [location]);
  return null;
}

function App() {
  const location = useLocation();
  
  // Clear transforms when navigating (including back button)
  useEffect(() => {
    const content = document.querySelector('.app-content');
    if (content) {
      gsap.set(content, { clearProps: 'all' });
    }
    gsap.set(document.body, { clearProps: 'perspective' });
  }, [location.pathname]);
  
  return (
    <>
      <Navbar />
      <div className="app">
        <div className="app-content">
          <ScrollOnRouteState />
          <Routes>
            <Route
              path="/"
              element={(
                <>
                  <SidebarNav />
                  <Hero />
                  <Services />
                  <AISection />
                  <AutomationSection />
                  <About />
                  <Contact />
                  <Footer />
                </>
              )}
            />
            <Route path="/navigate-your-next" element={<NavigateYourNext />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
