import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const aboutContent = document.querySelector('.about-content');
    
    // Set initial visibility
    gsap.set(aboutContent, { opacity: 1 });
    
    gsap.fromTo('.about-content', 
      {
        opacity: 0,
        y: 50,
      },
      {
        scrollTrigger: {
          trigger: '.about-content',
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
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-container">
        <div className="about-content">
          <h2>About Tista Labs</h2>
          <div className="about-text">
            <p>
              Based in <strong>Shillong, Meghalaya, India</strong>, we're a technology company 
              with a global vision. We empower businesses worldwide with innovative digital 
              solutions that drive growth and transformation.
            </p>
            <p>
              Our expertise spans <strong>web development, mobile applications, artificial 
              intelligence, automation, and cybersecurity</strong>. We serve clients across 
              diverse industries, delivering cutting-edge solutions that help businesses stay 
              ahead in the digital age.
            </p>
            <p>
              Whether you're a startup looking to build your first product or an enterprise 
              seeking to modernize your technology stack, we bring the expertise, creativity, 
              and dedication needed to turn your vision into reality.
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">7+</div>
              <div className="stat-label">Years Experience</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Specialists</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
