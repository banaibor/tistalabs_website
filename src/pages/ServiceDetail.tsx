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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reverse-pop from warp origin (photo center) to feel like emerging from the portal
    const origin = location?.state?.warpOrigin as { x: number; y: number } | undefined;
    const root = document.getElementById('root');
    if (origin && root) {
      gsap.set(document.body, { perspective: 1200 });
      const dx = origin.x / window.innerWidth - 0.5;
      const dy = origin.y / window.innerHeight - 0.5;
      // Start from deep inside the portal (matching the vacuum effect)
      gsap.set(root, { 
        transformOrigin: `${origin.x}px ${origin.y}px`, 
        scale: 0.05, 
        rotationX: dy * 15, 
        rotationY: -dx * 15, 
        rotationZ: (dx - dy) * 20, 
        z: -400, 
        filter: 'blur(5px) saturate(1.15) brightness(0.85)' 
      });
      // Explosive expansion from the portal
      gsap.to(root, { 
        scale: 1, 
        rotationX: 0, 
        rotationY: 0, 
        rotationZ: 0, 
        z: 0, 
        filter: 'none', 
        duration: 0.8, 
        ease: 'power3.out' 
      });
    }
  }, [id]);

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
