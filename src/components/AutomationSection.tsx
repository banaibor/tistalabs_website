import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/AutomationSection.css';

gsap.registerPlugin(ScrollTrigger);

const AutomationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = document.querySelectorAll('.automation-item');
    
    items.forEach((item, index) => {
      gsap.fromTo(item, 
        {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
        },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          x: 0,
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

  const automationTechnologies = [
    {
      name: "VBA Automation",
      description: "Excel and Office automation with custom macros",
      benefit: "90% time savings",
      applications: ["Data processing", "Report generation", "Multi-application workflows"]
    },
    {
      name: "Python Scripting",
      description: "Comprehensive automation using Selenium and Pandas",
      benefit: "100% accuracy",
      applications: ["Web interaction", "Data analysis", "API integrations"]
    },
    {
      name: "PowerShell Scripts",
      description: "Windows system automation and administration",
      benefit: "Native OS integration",
      applications: ["User management", "Server monitoring", "Office 365 admin"]
    },
    {
      name: "JavaScript/Node.js",
      description: "Server-side automation and enterprise backends",
      benefit: "High-concurrency",
      applications: ["API integrations", "Real-time processing", "Event-driven architecture"]
    }
  ];

  const businessApplications = [
    {
      industry: "Financial Services",
      solutions: ["Automated report generation", "Invoice processing", "Risk assessment calculations"],
      impact: "3-6 month payback"
    },
    {
      industry: "Healthcare Operations",
      solutions: ["Patient record digitization", "Medical billing automation", "Clinical trial data"],
      impact: "95% error elimination"
    },
    {
      industry: "Manufacturing",
      solutions: ["Production scheduling", "Quality control", "Supplier communication"],
      impact: "60% faster processing"
    },
    {
      industry: "Human Resources",
      solutions: ["Employee onboarding", "Payroll processing", "Recruitment screening"],
      impact: "80% manual reduction"
    }
  ];

  return (
    <section className="automation-section" id="automation" ref={sectionRef}>
      <div className="automation-container">
        <div className="automation-header">
          <span className="automation-tag">SOFTWARE AUTOMATION</span>
          <h2>TRANSFORM MANUAL TASKS INTO<br />AUTOMATED WORKFLOWS</h2>
          <div className="automation-stats">
            <div className="stat">
              <span className="stat-number">80%</span>
              <span className="stat-label">Manual Processing Time Reduction</span>
            </div>
            <div className="stat">
              <span className="stat-number">500-800%</span>
              <span className="stat-label">Return on Investment</span>
            </div>
          </div>
        </div>

        <div className="technologies-section">
          <h3>CORE TECHNOLOGIES</h3>
          <div className="technologies-grid">
            {automationTechnologies.map((tech, index) => (
              <div key={index} className="automation-item technology-card">
                <div className="tech-header">
                  <h4>{tech.name}</h4>
                  <span className="tech-benefit">{tech.benefit}</span>
                </div>
                <p className="tech-description">{tech.description}</p>
                <ul className="tech-applications">
                  {tech.applications.map((app, idx) => (
                    <li key={idx}>{app}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="business-applications">
          <h3>BUSINESS APPLICATIONS</h3>
          <div className="applications-grid">
            {businessApplications.map((application, index) => (
              <div key={index} className="automation-item application-card">
                <div className="application-header">
                  <h4>{application.industry}</h4>
                  <span className="application-impact">{application.impact}</span>
                </div>
                <ul className="application-solutions">
                  {application.solutions.map((solution, idx) => (
                    <li key={idx}>{solution}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="automation-approach">
          <div className="approach-content">
            <div className="approach-text">
              <h3>IMPLEMENTATION APPROACH</h3>
              <div className="approach-steps">
                <div className="step">
                  <span className="step-number">01</span>
                  <div className="step-content">
                    <h5>Rapid Development</h5>
                    <p>Proof-of-concept delivery within 1-2 weeks with measurable efficiency improvements</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">02</span>
                  <div className="step-content">
                    <h5>Seamless Integration</h5>
                    <p>Minimal disruption deployment with comprehensive testing and rollback procedures</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">03</span>
                  <div className="step-content">
                    <h5>Complete Support</h5>
                    <p>Full documentation, training, and 24/7 technical support for sustainable adoption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="automation-cta">
          <h3>Ready to eliminate manual tasks and boost productivity?</h3>
          <p>Contact our automation specialists for a complimentary evaluation and discover immediate efficiency gains.</p>
          <button className="automation-cta-button">Start Automation Assessment →</button>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;