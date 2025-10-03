import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TISTA LABS</h3>
            <p>Building the future, one innovation at a time.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <a href="#services">Web Development</a>
              <a href="#services">Mobile Apps</a>
              <a href="#services">AI Solutions</a>
              <a href="#services">Automation</a>
            </div>
            
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#services">Our Work</a>
            </div>
            
            <div className="footer-column">
              <h4>Connect</h4>
              <a href="mailto:info@tistalabs.com">Email</a>
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tista Labs. All rights reserved.</p>
          <p>Shillong, Meghalaya, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
