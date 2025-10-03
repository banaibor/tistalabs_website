import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <a href="/" aria-label="Home" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <AnimatedLogo />
          </a>
        </div>
        <div className="nav-links">
          <Link to="/navigate-your-next">Navigate your Next</Link>
          <Link to="/our-work">Our Work</Link>
          <Link to="/infrastructure">Infrastructure</Link>
          <Link to="/" state={{ scrollTo: 'contact' }}>Contact Us</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
