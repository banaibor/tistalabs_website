import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
import backgroundLoopingData from '../assets/Background looping animation.json';
import abstractAppsAnimation from '../assets/Abstract animation for apps.json';
import globalAnimationData from '../assets/Global.json';
import workingHoursData from '../assets/Working Hours Animated.json';
import '../styles/components/AISection.css';

gsap.registerPlugin(ScrollTrigger);

const AISection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgAnimationRef = useRef<HTMLDivElement>(null);

  // Refs for metric animations
  const roiAnimationRef = useRef<HTMLDivElement>(null);
  const enterpriseAnimationRef = useRef<HTMLDivElement>(null);
  const productivityAnimationRef = useRef<HTMLDivElement>(null);

  // Pre-loaded animations state
  const [preloadedAnimations, setPreloadedAnimations] = useState<{
    roi: AnimationItem | null;
    enterprise: AnimationItem | null;
    productivity: AnimationItem | null;
  }>({
    roi: null,
    enterprise: null,
    productivity: null,
  });

  // Hover timeout tracking
  const hoverTimeoutRef = useRef<number | null>(null);



  // Pre-load all animations once on component mount
  useEffect(() => {
    // Background animation
    let bgAnimation: AnimationItem | null = null;
    if (bgAnimationRef.current) {
      bgAnimation = lottie.loadAnimation({
        container: bgAnimationRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: abstractAppsAnimation,
      });
    }

    // Pre-load metric animations (hidden initially)
    const loadMetricAnimations = () => {
      const animations: any = {};
      
      if (roiAnimationRef.current) {
        // Ensure container is completely hidden before loading animation
        roiAnimationRef.current.style.opacity = '0';
        roiAnimationRef.current.style.visibility = 'hidden';
        roiAnimationRef.current.style.display = 'none';
        
        animations.roi = lottie.loadAnimation({
          container: roiAnimationRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: backgroundLoopingData,
        });
        
        // Double-ensure it's hidden after loading
        animations.roi.pause();
        animations.roi.goToAndStop(0, true);
      }

      if (enterpriseAnimationRef.current) {
        // Ensure container is completely hidden before loading animation
        enterpriseAnimationRef.current.style.opacity = '0';
        enterpriseAnimationRef.current.style.visibility = 'hidden';
        enterpriseAnimationRef.current.style.display = 'none';
        
        animations.enterprise = lottie.loadAnimation({
          container: enterpriseAnimationRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: globalAnimationData,
        });
        
        // Double-ensure it's hidden after loading
        animations.enterprise.pause();
        animations.enterprise.goToAndStop(0, true);
      }

      if (productivityAnimationRef.current) {
        // Ensure container is completely hidden before loading animation
        productivityAnimationRef.current.style.opacity = '0';
        productivityAnimationRef.current.style.visibility = 'hidden';
        productivityAnimationRef.current.style.display = 'none';
        
        animations.productivity = lottie.loadAnimation({
          container: productivityAnimationRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData: workingHoursData,
        });
        
        // Double-ensure it's hidden after loading
        animations.productivity.pause();
        animations.productivity.goToAndStop(0, true);
      }

      setPreloadedAnimations(animations);
    };

    // Load animations after a short delay to prevent blocking
    const timeout = setTimeout(loadMetricAnimations, 500);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      clearTimeout(timeout);
      if (bgAnimation) bgAnimation.destroy();
    };
  }, []);

  // Ensure animations are hidden when preloaded animations are set
  useEffect(() => {
    if (preloadedAnimations.roi && roiAnimationRef.current) {
      roiAnimationRef.current.style.display = 'none';
      roiAnimationRef.current.style.opacity = '0';
      roiAnimationRef.current.style.visibility = 'hidden';
      preloadedAnimations.roi.pause();
      preloadedAnimations.roi.goToAndStop(0, true);
    }
    
    if (preloadedAnimations.enterprise && enterpriseAnimationRef.current) {
      enterpriseAnimationRef.current.style.display = 'none';
      enterpriseAnimationRef.current.style.opacity = '0';
      enterpriseAnimationRef.current.style.visibility = 'hidden';
      preloadedAnimations.enterprise.pause();
      preloadedAnimations.enterprise.goToAndStop(0, true);
    }
    
    if (preloadedAnimations.productivity && productivityAnimationRef.current) {
      productivityAnimationRef.current.style.display = 'none';
      productivityAnimationRef.current.style.opacity = '0';
      productivityAnimationRef.current.style.visibility = 'hidden';
      preloadedAnimations.productivity.pause();
      preloadedAnimations.productivity.goToAndStop(0, true);
    }
  }, [preloadedAnimations]);

  // Optimized hover handlers using pre-loaded animations
  const handleMetricHover = useCallback((metricType: 'roi' | 'enterprise' | 'productivity') => {
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    const animation = preloadedAnimations[metricType];
    const ref = metricType === 'roi' ? roiAnimationRef : 
                metricType === 'enterprise' ? enterpriseAnimationRef : 
                productivityAnimationRef;

    if (animation && ref.current) {
      // Show and start animation
      ref.current.style.display = 'block';
      ref.current.style.visibility = 'visible';
      ref.current.style.opacity = '1';
      animation.play();
    }
  }, [preloadedAnimations]);

  const handleMetricLeave = useCallback((metricType: 'roi' | 'enterprise' | 'productivity') => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Immediately hide the animation
    const animation = preloadedAnimations[metricType];
    const ref = metricType === 'roi' ? roiAnimationRef : 
                metricType === 'enterprise' ? enterpriseAnimationRef : 
                productivityAnimationRef;

    if (animation && ref.current) {
      // Hide and pause animation immediately
      animation.pause();
      animation.goToAndStop(0, true); // Reset to first frame
      ref.current.style.opacity = '0';
      ref.current.style.visibility = 'hidden';
      ref.current.style.display = 'none';
    }
  }, [preloadedAnimations]);

  // Separate useEffect for cleanup
  useEffect(() => {
    return () => {
      // Clean up pre-loaded animations
      Object.values(preloadedAnimations).forEach(animation => {
        if (animation) {
          animation.destroy();
        }
      });

      // Clear timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [preloadedAnimations]);

  const industries = [
    { name: "Financial Services", highlight: "89% manual effort reduction" },
    { name: "Healthcare & Life Sciences", highlight: "Evidence-based recommendations" },
    { name: "Manufacturing & Supply Chain", highlight: "30% downtime reduction" },
    { name: "Retail & E-commerce", highlight: "25% revenue increase" }
  ];

  return (
    <section className="ai-section" id="ai-solutions" ref={sectionRef}>
      <div className="ai-bg-animation" ref={bgAnimationRef} />
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
              <div 
                className="metric metric-roi"
                onMouseEnter={() => handleMetricHover('roi')}
                onMouseLeave={() => handleMetricLeave('roi')}
              >
                <div className="metric-animation-bg" ref={roiAnimationRef}></div>
                <div className="metric-content">
                  <span className="metric-number">3.7x</span>
                  <span className="metric-label">Average ROI</span>
                </div>
              </div>
              <div 
                className="metric metric-enterprise"
                onMouseEnter={() => handleMetricHover('enterprise')}
                onMouseLeave={() => handleMetricLeave('enterprise')}
              >
                <div className="metric-animation-bg" ref={enterpriseAnimationRef}></div>
                <div className="metric-content">
                  <span className="metric-number">74%</span>
                  <span className="metric-label">Enterprise Success Rate</span>
                </div>
              </div>
              <div 
                className="metric metric-productivity"
                onMouseEnter={() => handleMetricHover('productivity')}
                onMouseLeave={() => handleMetricLeave('productivity')}
              >
                <div className="metric-animation-bg" ref={productivityAnimationRef}></div>
                <div className="metric-content">
                  <span className="metric-number">39%</span>
                  <span className="metric-label">Productivity Improvement</span>
                </div>
              </div>
            </div>
          </div>
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