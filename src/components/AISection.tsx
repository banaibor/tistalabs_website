import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/AISection.css';

gsap.registerPlugin(ScrollTrigger);

const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.ai-feature-card');
    
    cards.forEach((card, index) => {
      gsap.fromTo(card, 
        {
          opacity: 0,
          y: 50,
        },
        {
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const aiFeatures = [
    {
      title: "Model Context Protocol",
      description: "Advanced standardized communication framework",
      metrics: "99.9% uptime",
      icon: "🧠"
    },
    {
      title: "Custom AI Development",
      description: "Domain-specific AI models tailored to your industry",
      metrics: "Multi-modal capabilities",
      icon: "⚡"
    },
    {
      title: "RAG Systems",
      description: "Enterprise knowledge systems delivering 3.7x ROI improvement",
      metrics: "Real-time retrieval",
      icon: "🔍"
    },
    {
      title: "Edge AI Computing",
      description: "Ultra-low latency processing with sub-millisecond response",
      metrics: "Local inference",
      icon: "🚀"
    },
    {
      title: "Agentic AI Workflows",
      description: "Autonomous multi-agent systems orchestrating business processes",
      metrics: "Self-improving",
      icon: "🤖"
    },
    {
      title: "Enterprise Solutions",
      description: "Industry-specific AI solutions for Finance, Healthcare, Manufacturing",
      metrics: "220,000+ organizations",
      icon: "🏢"
    }
  ];

  const industries = [
    { name: "Financial Services", highlight: "89% manual effort reduction" },
    { name: "Healthcare & Life Sciences", highlight: "Evidence-based recommendations" },
    { name: "Manufacturing & Supply Chain", highlight: "30% downtime reduction" },
    { name: "Retail & E-commerce", highlight: "25% revenue increase" }
  ];

  return (
    <section className="ai-section" id="ai-solutions" ref={sectionRef}>
      <div className="ai-container">
        <div className="ai-header">
          <span className="ai-tag">ARTIFICIAL INTELLIGENCE</span>
          <h2>NEXT-GENERATION AI SOLUTIONS</h2>
          <p className="ai-subtitle">
            Transform your business with cutting-edge artificial intelligence and machine learning technologies
          </p>
        </div>

        <div className="ai-hero">
          <div className="ai-hero-content">
            <h3>PROVEN RESULTS</h3>
            <div className="ai-metrics">
              <div className="metric">
                <span className="metric-number">3.7x</span>
                <span className="metric-label">Average ROI</span>
              </div>
              <div className="metric">
                <span className="metric-number">74%</span>
                <span className="metric-label">Enterprise Success Rate</span>
              </div>
              <div className="metric">
                <span className="metric-number">39%</span>
                <span className="metric-label">Productivity Improvement</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ai-features-grid">
          {aiFeatures.map((feature, index) => (
            <div key={index} className="ai-feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
              <span className="feature-metric">{feature.metrics}</span>
            </div>
          ))}
        </div>

        <div className="ai-industries">
          <h3>INDUSTRY SOLUTIONS</h3>
          <div className="industries-grid">
            {industries.map((industry, index) => (
              <div key={index} className="industry-item">
                <h4>{industry.name}</h4>
                <span className="industry-highlight">{industry.highlight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-cta">
          <div className="cta-content">
            <h3>Ready to accelerate your business with intelligent automation?</h3>
            <p>Contact our AI solutions experts for a complimentary consultation and discover how comprehensive AI delivers measurable value.</p>
            <button className="ai-cta-button">Start AI Transformation →</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;