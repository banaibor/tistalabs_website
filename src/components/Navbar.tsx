import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on a page that's not the homepage
  const isNotHomepage = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled || isNotHomepage ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <AnimatedLogo />
        </div>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/navigate-your-next" onClick={closeMobileMenu}>Navigate your Next</Link>
          <Link to="/our-work" onClick={closeMobileMenu}>Our Work</Link>
          <Link to="/infrastructure" onClick={closeMobileMenu}>Infrastructure</Link>
          <Link to="/" state={{ scrollTo: 'contact' }} onClick={closeMobileMenu} className="contact-btn">Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
