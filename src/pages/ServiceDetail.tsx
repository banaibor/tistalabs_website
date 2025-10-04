import { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { servicesData } from '../data/servicesData';
import IdeaCanvas from '../components/IdeaCanvas';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import SectionDivider from '../components/SectionDivider';
import '../styles/pages/ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const location = useLocation() as any;
  const service = servicesData.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Clear any existing transforms from previous pages
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      gsap.set(appContent, { clearProps: 'all' });
    }
    gsap.set(document.body, { clearProps: 'perspective' });
    
    // Immediately ensure all text elements are properly displayed
    const textHost = document.querySelector('.service-page') as HTMLElement | null;
    if (textHost) {
      const textNodes = Array.from(textHost.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,small,strong,em,.chip,.metric .value,.metric .label,.uc-body,.feature-list li')) as HTMLElement[];
      textNodes.forEach((el) => {
        gsap.set(el, { clearProps: 'all' });
      });
    }
    
    // Reverse-pop from warp origin (photo center) to feel like emerging from the portal
    const origin = location?.state?.warpOrigin as { x: number; y: number } | undefined;
    const keepOverlay = !!location?.state?.keepOverlay;
    const keepGhost = !!location?.state?.keepGhost;
    
    if (origin && appContent) {
      // Apply perspective to body but transform to app-content (which doesn't contain navbar)
      gsap.set(document.body, { perspective: 1200 });
      const dx = origin.x / window.innerWidth - 0.5;
      const dy = origin.y / window.innerHeight - 0.5;
      // Start from deep inside the portal (matching the vacuum effect)
      gsap.set(appContent, { 
        transformOrigin: `${origin.x}px ${origin.y}px`, 
        scale: 0.05, 
        rotationX: dy * 15, 
        rotationY: -dx * 15, 
        rotationZ: (dx - dy) * 20, 
        z: -400, 
        filter: 'blur(5px) saturate(1.15) brightness(0.85)' 
      });
      // Explosive expansion from the portal
      gsap.to(appContent, { 
        scale: 1, 
        rotationX: 0, 
        rotationY: 0, 
        rotationZ: 0, 
        z: 0, 
        filter: 'none', 
        duration: 0.8, 
        ease: 'power3.out',
        onComplete: () => {
          // Clear all transforms and perspective after animation
          gsap.set(document.body, { clearProps: 'perspective' });
          gsap.set(appContent, { clearProps: 'all' });
        }
      });

      // Find the ghost photo and ensure it stays visible during text animation
      const ghost = document.querySelector('.warp-ghost') as HTMLElement | null;
      if (ghost && keepGhost) {
        // Keep ghost visible and pulsing as the portal
        gsap.set(ghost, {
          zIndex: 99999,
          opacity: 1,
          visibility: 'visible'
        });
        
        // Add portal glow effect during text emergence
        gsap.to(ghost, {
          boxShadow: '0 0 120px rgba(34,211,238,1), 0 0 180px rgba(167,139,250,0.8), inset 0 0 60px rgba(34,211,238,0.5)',
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      // Animate service text emerging from the photo portal
      const textHost = document.querySelector('.service-page') as HTMLElement | null;
      if (textHost) {
        // Wait for DOM to be ready before querying text elements
        setTimeout(() => {
          const textNodes = Array.from(textHost.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,small,strong,em,.chip,.metric .value,.metric .label,.uc-body,.feature-list li')) as HTMLElement[];
          textNodes.forEach((el, i) => {
            // First, ensure elements are properly reset
            gsap.set(el, { clearProps: 'all' });
            
            // Calculate displacement from portal center
            const rect = el.getBoundingClientRect();
            const elCenterX = rect.left + rect.width / 2;
            const elCenterY = rect.top + rect.height / 2;
            const dx = origin.x - elCenterX;
            const dy = origin.y - elCenterY;
            
            // Set initial state (coming from portal)
            gsap.set(el, {
              x: dx,
              y: dy,
              scale: 0.15,
              rotation: (Math.random() * 20 - 10),
              opacity: 0,
              filter: 'blur(3px)',
              transformOrigin: 'center center'
            });
            
            // Animate to final position with proper cleanup
            gsap.to(el, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.7 + Math.random() * 0.3,
              ease: 'power2.out',
              delay: 0.1 + (i % 12) * 0.025,
              onComplete: () => {
                // Clear all transforms after animation completes
                gsap.set(el, { clearProps: 'all' });
              }
            });
          });
        }, 100); // Increased delay to ensure DOM is ready
      }

      // Handle overlay and ghost cleanup after text animation completes
      if (keepOverlay) {
        const overlay = document.querySelector('.warp-overlay') as HTMLElement | null;
        if (overlay) {
          // Fade out overlay after text animation, but keep ghost visible longer
          gsap.to(overlay, { 
            opacity: 0, 
            duration: 0.4, 
            delay: 1.2, 
            onComplete: () => {
              // Remove overlay but preserve ghost for a bit longer if needed
              if (ghost && keepGhost) {
                // Gradually fade ghost after text is fully emerged
                gsap.to(ghost, {
                  opacity: 0,
                  scale: 0.8,
                  duration: 0.6,
                  delay: 0.3,
                  ease: 'power2.out',
                  onComplete: () => overlay.remove()
                });
              } else {
                overlay.remove();
              }
            }
          });
        }
      }
    } else {
      // If no warp origin, ensure all text elements are properly displayed
      const textHost = document.querySelector('.service-page') as HTMLElement | null;
      if (textHost) {
        setTimeout(() => {
          const textNodes = Array.from(textHost.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,small,strong,em,.chip,.metric .value,.metric .label,.uc-body,.feature-list li')) as HTMLElement[];
          textNodes.forEach((el) => {
            gsap.set(el, { clearProps: 'all' });
          });
        }, 50);
      }
    }
    
    // Cleanup function to ensure transforms are cleared
    return () => {
      if (appContent) {
        gsap.set(appContent, { clearProps: 'all' });
      }
      gsap.set(document.body, { clearProps: 'perspective' });
      
      // Also cleanup any text transforms
      const textHost = document.querySelector('.service-page') as HTMLElement | null;
      if (textHost) {
        const textNodes = Array.from(textHost.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,small,strong,em,.chip,.metric .value,.metric .label,.uc-body,.feature-list li')) as HTMLElement[];
        textNodes.forEach((el) => {
          gsap.set(el, { clearProps: 'all' });
        });
      }
    };
  }, [id, location]);

  if (!service) {
    return (
      <main className="service-page not-found">
        <header className="service-hero">
          <div className="service-container">
            <h1>Service not found</h1>
            <p>The service you’re looking for doesn’t exist or was moved.</p>
            <Link to="/" state={{ scrollTo: 'services' }} className="back-link">Back to Services</Link>
          </div>
        </header>
      </main>
    );
  }

  const Icon = service.icon as any;

  const accentMap: Record<string, string> = {
    'web-performance': '#22d3ee',
    'data-ai': '#a78bfa',
    'cloud-native': '#34d399',
    'design-systems': '#f472b6',
  };
  const accent = (accentMap[service.id] || '#22d3ee');

  return (
    <main className={`service-page service-${service.id}`} style={{ ['--accent' as any]: accent }}>
      <header className="service-hero">
        <div className="service-container">
          <div className="crumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/" state={{ scrollTo: 'services' }}>Services</Link>
            <span>/</span>
            <span className="current">{service.title}</span>
          </div>
          <h1>
            {Icon && <Icon className="service-icon" aria-hidden />}
            {service.title}
          </h1>
          <p className="service-headline">{service.headline}</p>
          <p className="service-description">{service.description}</p>
        </div>
      </header>

      <section className="service-content">
        <div className="service-container" onMouseMove={(e) => {
          const t = e.target as HTMLElement;
          if (t && t.classList.contains('chip')) {
            const rect = t.getBoundingClientRect();
            const mx = ((e.clientX - rect.left) / rect.width) * 100;
            const my = ((e.clientY - rect.top) / rect.height) * 100;
            t.style.setProperty('--mx', `${mx}%`);
            t.style.setProperty('--my', `${my}%`);
          }
        }}>
          <SectionDivider />

          {service.useCases && service.useCases.length > 0 && (
            <div className="usecases">
              <h2>Real-world use cases</h2>
              <div className="usecase-grid">
                {service.useCases.map((u, idx) => (
                  <Reveal className="usecase-card" key={idx} delay={idx * 80}>
                    {u.image && <img src={u.image} alt={u.title} />}
                    <div className="uc-body">
                      <h3>{u.title}</h3>
                      <p>{u.description}</p>
                      {u.metrics && (
                        <div className="uc-metrics">
                          {u.metrics.map((m, i) => (
                            <div className="metric" key={i}>
                              <CountUp className="value" value={m.value} />
                              <span className="label">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}


          {(service.stack || service.metrics) && (
            <div className="stack-metrics">
              {service.stack && (
                <div className="stack">
                  <h2>Stack</h2>
                  <div className="stack-chips">
                    {service.stack.map((s, i) => (
                      <Reveal as="span" className="chip" key={i} delay={i * 40}>{s}</Reveal>
                    ))}
                  </div>
                </div>
              )}
              {service.metrics && (
                <div className="metrics">
                  <h2>Impact</h2>
                  <div className="metric-cards">
                    {service.metrics.map((m, i) => (
                      <Reveal className="metric-card" key={i} delay={i * 90}>
                        <CountUp className="value" value={m.value} />
                        <div className="label">{m.label}</div>
                        {m.hint && <small className="hint">{m.hint}</small>}
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <SectionDivider />

          <div className="idea-section">
            <h2>Sketch your vision</h2>
            <IdeaCanvas suggestions={service.ideaStarters} />
          </div>

          <SectionDivider />
          <div className="features-card">
            <h2>What’s included</h2>
            <ul className="feature-list">
              {service.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="cta-card">
            <h3>Why it matters</h3>
            <p>{service.cta}</p>
            <Link to="/" state={{ scrollTo: 'contact' }} className="cta-primary">Talk to us</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
