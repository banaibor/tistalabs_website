import { Link, useParams } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import IdeaCanvas from '../components/IdeaCanvas';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import SectionDivider from '../components/SectionDivider';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/pages/ServiceDetail.css';
import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const ServiceDetail = () => {
  const { id } = useParams();
  const service = servicesData.find(s => s.id === id);

  // Refs for animated elements
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Refs for chips, metrics, usecase cards
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const usecaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP context for chips
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Animate heading and description
    if (headingRef.current && descRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 }
      );
    }
    // Animate chips
    let ctx: gsap.Context | undefined;
    if (chipsContainerRef.current) {
      ctx = gsap.context(() => {
        gsap.fromTo(
          '.chip',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
        );
      }, chipsContainerRef);
    }
    // Animate metrics
    metricRefs.current.forEach((metric, i) => {
      if (metric) {
        gsap.fromTo(
          metric,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, delay: i * 0.07, ease: 'power2.out' }
        );
      }
    });
    // Animate usecase cards
    usecaseRefs.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: i * 0.09, ease: 'power2.out' }
        );
      }
    });
    // Cleanup on unmount
    return () => {
      if (headingRef.current) gsap.set(headingRef.current, { clearProps: 'all' });
      if (descRef.current) gsap.set(descRef.current, { clearProps: 'all' });
      chipRefs.current.forEach(chip => chip && gsap.set(chip, { clearProps: 'all' }));
      metricRefs.current.forEach(metric => metric && gsap.set(metric, { clearProps: 'all' }));
      usecaseRefs.current.forEach(card => card && gsap.set(card, { clearProps: 'all' }));
      ctx && ctx.revert();
    };
  }, [service?.id, service?.stack]);

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
          <h1 ref={headingRef}>
            {Icon && <Icon className="service-icon" aria-hidden />}
            {service.title}
          </h1>
          <p className="service-headline">{service.headline}</p>
          <p className="service-description" ref={descRef}>{service.description}</p>
        </div>
      </header>
      <ErrorBoundary>
        <section className="service-content">
          <div className="service-container">
            <SectionDivider />
            {service.useCases && service.useCases.length > 0 && (
              <div className="usecases">
                <h2>Real-world use cases</h2>
                <div className="usecase-grid">
                  {service.useCases.map((u, idx) => (
                    <div
                      className="usecase-card"
                      key={u.title + '-' + idx}
                      ref={el => { usecaseRefs.current[idx] = el; }}
                    >
                      {u.image && <img src={u.image} alt={u.title} />}
                      <div className="uc-body">
                        <h3>{u.title}</h3>
                        <p>{u.description}</p>
                        {u.metrics && (
                          <div className="uc-metrics">
                            {u.metrics.map((m, i) => (
                              <div className="metric" key={m.label + '-' + i} ref={el => { metricRefs.current[i] = el; }}>
                                <CountUp className="value" value={m.value} />
                                <span className="label">{m.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(service.stack || service.metrics) && (
              <div className="stack-metrics">
                {service.stack && (
                  <div className="stack">
                    <h2>Stack</h2>
                    <div className="stack-chips" ref={chipsContainerRef}>
                      {service.stack.map((s, i) => (
                        <span className="chip" key={s + '-' + i}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {service.metrics && (
                  <div className="metrics">
                    <h2>Impact</h2>
                    <div className="metric-cards">
                      {service.metrics.map((m, i) => (
                        <Reveal className="metric-card" key={m.label + '-' + i} delay={i * 90}>
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
      </ErrorBoundary>
    </main>
  );
};

export default ServiceDetail;
