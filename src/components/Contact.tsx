import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiEnvelope, HiMapPin, HiGlobeAlt } from 'react-icons/hi2';
import '../styles/components/Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const contactContent = document.querySelector('.contact-content');
    
    // Set initial visibility
    gsap.set(contactContent, { opacity: 1 });
    
    gsap.fromTo('.contact-content', 
      {
        opacity: 0,
        y: 50,
      },
      {
        scrollTrigger: {
          trigger: '.contact-content',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-container">
        <div className="contact-content">
          <h2>Let's Build Something Amazing Together</h2>
          <p className="contact-subtitle">
            Ready to transform your business with cutting-edge technology?
          </p>
          
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <HiEnvelope />
              </div>
              <h3>Email Us</h3>
              <a href="mailto:info@tistalabs.com">info@tistalabs.com</a>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">
                <HiMapPin />
              </div>
              <h3>Location</h3>
              <p>Shillong, Meghalaya<br />India</p>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon">
                <HiGlobeAlt />
              </div>
              <h3>Global Reach</h3>
              <p>Serving clients<br />worldwide</p>
            </div>
          </div>
          
          <div className="cta-section">
            <p>Get a complimentary consultation and discover how our solutions deliver measurable value.</p>
            <a href="mailto:info@tistalabs.com" className="cta-button">Get in Touch →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
