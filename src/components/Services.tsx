import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { servicesData } from '../data/servicesData';
import '../styles/components/Services.css';

gsap.registerPlugin(ScrollTrigger);

// Function to get random high-quality Unsplash images for each service
const getRandomServiceImage = (serviceId: string): string => {
  const imageCollections: Record<string, string[]> = {
    'web-dev': [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Web development workspace
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Code on screen
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Coding workspace
      'https://images.unsplash.com/photo-1484417894907-623942c8ee29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Web design mockup
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Developer workspace
    ],
    'mobile-dev': [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // iPhone apps
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mobile app design
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // App development
      'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Mobile coding
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Smartphone development
    ],
    'cross-cutting': [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Digital technology
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Tech solutions
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Business analytics
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Professional workspace
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Data analysis
    ],
    'ai-mcp': [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI brain
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI neural network
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI visualization
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Machine learning
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // AI technology
    ],
    'automation': [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Automation gears
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Robotic process
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Script automation
      'https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Process optimization
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Workflow automation
    ],
    'kaspersky-edr': [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Cybersecurity shield
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Security monitoring
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Data security
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Threat detection
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Security analytics
    ]
  };
  
  const images = imageCollections[serviceId] || imageCollections['web-dev'];
  return images[Math.floor(Math.random() * images.length)];
};

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [warping, setWarping] = useState(false);

  const createWarpOverlay = (src: string, fromRect: DOMRect, cx: number, cy: number, transforms?: { container: string; img: string }) => {
    const overlay = document.createElement('div');
    overlay.className = 'warp-overlay';
    overlay.style.setProperty('--cx', `${(cx / window.innerWidth) * 100}%`);
    overlay.style.setProperty('--cy', `${(cy / window.innerHeight) * 100}%`);

    // Mobile detection for performance optimization
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // Ghost photo to ensure image remains visible during vacuum
    const ghost = document.createElement('div');
    ghost.className = 'warp-ghost';
    const gimg = document.createElement('img');
    gimg.src = src;
    ghost.appendChild(gimg);
    overlay.appendChild(ghost);

    // Primary vortex ring
    const ring = document.createElement('div');
    ring.className = 'warp-ring';
    ring.style.left = `${cx}px`;
    ring.style.top = `${cy}px`;
    overlay.appendChild(ring);

    // Secondary ring for depth
    const ring2 = document.createElement('div');
    ring2.className = 'warp-ring';
    ring2.style.left = `${cx}px`;
    ring2.style.top = `${cy}px`;
    ring2.style.width = '32vmax';
    ring2.style.height = '32vmax';
    ring2.style.borderWidth = '2px';
    ring2.style.opacity = '0.6';
    overlay.appendChild(ring2);

    // Spinning swirl
    const swirl = document.createElement('div');
    swirl.className = 'warp-swirl';
    swirl.style.left = `${cx}px`;
    swirl.style.top = `${cy}px`;
    overlay.appendChild(swirl);

    // Vortex distortion layer
    const vortex = document.createElement('div');
    vortex.className = 'warp-vortex';
    vortex.style.left = `${cx}px`;
    vortex.style.top = `${cy}px`;
    overlay.appendChild(vortex);

    // Energy burst at center
    const burst = document.createElement('div');
    burst.className = 'warp-burst';
    burst.style.left = `${cx}px`;
    burst.style.top = `${cy}px`;
    overlay.appendChild(burst);

    // Distortion grid
    const grid = document.createElement('div');
    grid.className = 'warp-grid';
    overlay.appendChild(grid);

    // Create vacuum particles flying into the vortex
    // Reduce particle count on mobile for better performance
    const particleCount = isSmallMobile ? 20 : isMobile ? 30 : 40;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'warp-particle';
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 300 + Math.random() * 400;
      const px = cx + Math.cos(angle) * distance;
      const py = cy + Math.sin(angle) * distance;
      particle.style.left = `${px}px`;
      particle.style.top = `${py}px`;
      particle.style.opacity = String(0.6 + Math.random() * 0.4);
      overlay.appendChild(particle);
      particles.push(particle);
    }

    // Create page fragments that break apart and get sucked in
    // Reduce fragment count on mobile
    const fragmentCount = isSmallMobile ? 8 : isMobile ? 10 : 15;
    const fragments: HTMLDivElement[] = [];
    for (let i = 0; i < fragmentCount; i++) {
      const fragment = document.createElement('div');
      fragment.className = 'warp-fragment';
      const angle = (Math.PI * 2 * i) / fragmentCount + Math.random() * 0.5;
      const distance = 200 + Math.random() * 350;
      const fx = cx + Math.cos(angle) * distance;
      const fy = cy + Math.sin(angle) * distance;
      const size = 40 + Math.random() * 80;
      fragment.style.left = `${fx}px`;
      fragment.style.top = `${fy}px`;
      fragment.style.width = `${size}px`;
      fragment.style.height = `${size}px`;
      fragment.style.transform = `rotate(${Math.random() * 360}deg)`;
      overlay.appendChild(fragment);
      fragments.push(fragment);
    }

    // Create motion streaks spiraling into center
    // Reduce streak count on mobile
    const streakCount = isSmallMobile ? 10 : isMobile ? 15 : 20;
    const streaks: HTMLDivElement[] = [];
    for (let i = 0; i < streakCount; i++) {
      const streak = document.createElement('div');
      streak.className = 'warp-streak';
      const angle = (Math.PI * 2 * i) / streakCount;
      const distance = 250 + Math.random() * 300;
      const sx = cx + Math.cos(angle) * distance;
      const sy = cy + Math.sin(angle) * distance;
      streak.style.left = `${sx}px`;
      streak.style.top = `${sy}px`;
      streak.style.transform = `rotate(${(angle * 180 / Math.PI) + 90}deg)`;
      streak.style.opacity = String(0.4 + Math.random() * 0.4);
      overlay.appendChild(streak);
      streaks.push(streak);
    }

    document.body.appendChild(overlay);

    // Initialize positions
    gsap.set(ghost, {
      position: 'absolute',
      left: fromRect.left,
      top: fromRect.top,
      width: fromRect.width,
      height: fromRect.height,
      borderRadius: 16,
      overflow: 'hidden',
      transform: transforms?.container || 'none',
      zIndex: 10001,
      opacity: 1,
    });
    gsap.set(gimg, { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover', 
      display: 'block',
      transform: transforms?.img || 'none' 
    });

    gsap.set(ring, { scale: 0.2, opacity: 0.9 });
    gsap.set(ring2, { scale: 0.15, opacity: 0.5 });
    gsap.set(swirl, { scale: 0, opacity: 0.2, rotate: 0 });
    gsap.set(vortex, { scale: 0, opacity: 0 });
    gsap.set(burst, { scale: 0, opacity: 0.8 });
    gsap.set(overlay, { background: 'radial-gradient(0vmax 0vmax at var(--cx) var(--cy), rgba(34,211,238,0.0), rgba(0,0,0,0))' });

    return { overlay, ring, ring2, swirl, vortex, burst, particles, fragments, streaks, ghost };
  };

  const playWarp = (
    ring: HTMLDivElement, 
    overlay: HTMLDivElement, 
    photoRect: DOMRect,
    onComplete: () => void, 
    ghost?: HTMLDivElement,
    ring2?: HTMLDivElement,
    swirl?: HTMLDivElement,
    vortex?: HTMLDivElement,
    burst?: HTMLDivElement,
    particles?: HTMLDivElement[],
    fragments?: HTMLDivElement[],
    streaks?: HTMLDivElement[]
  ) => {
    const appContent = document.querySelector('.app-content') as HTMLElement;
    gsap.set(document.body, { perspective: 1200 });
    
    // Calculate center of the photo (where the vacuum leads to)
    const photoCenterX = photoRect.left + photoRect.width / 2;
    const photoCenterY = photoRect.top + photoRect.height / 2;
    
    const dx = photoCenterX / window.innerWidth - 0.5;
    const dy = photoCenterY / window.innerHeight - 0.5;
    const tl = gsap.timeline({ onComplete });
    
    // Intensify the dark vortex background centered on photo
    tl.to(overlay, { 
      background: `radial-gradient(circle at ${photoCenterX}px ${photoCenterY}px, rgba(34,211,238,0.2), rgba(0,0,0,0.95))`, 
      duration: 0.7, 
      ease: 'power2.out' 
    }, 0);

    // Make the photo EXPAND as it becomes the portal (vacuum mouth)
    if (ghost) {
      tl.to(ghost, {
        left: photoCenterX - (photoRect.width * 2),
        top: photoCenterY - (photoRect.height * 2),
        width: photoRect.width * 4,
        height: photoRect.height * 4,
        scale: 1.2,
        borderRadius: '50%',
        boxShadow: '0 0 200px rgba(34,211,238,1), 0 0 300px rgba(167,139,250,0.8), inset 0 0 100px rgba(0,0,0,0.5)',
        duration: 0.85,
        ease: 'power2.out'
      }, 0);
    }

    // Primary ring expansion from photo center
    tl.to(ring, { 
      scale: 2.8, 
      opacity: 0, 
      duration: 0.9, 
      ease: 'power3.out' 
    }, 0);

    // Secondary ring for depth
    if (ring2) {
      tl.to(ring2, { 
        scale: 3.2, 
        opacity: 0, 
        duration: 1, 
        ease: 'power3.out' 
      }, 0.1);
    }

    // Intense spinning swirl centered on photo
    if (swirl) {
      tl.to(swirl, { 
        left: photoCenterX,
        top: photoCenterY,
        scale: 2.2, 
        rotate: 720, 
        opacity: 0.6, 
        duration: 0.9, 
        ease: 'power2.inOut' 
      }, 0);
    }

    // Vortex distortion expanding from photo
    if (vortex) {
      tl.to(vortex, {
        left: photoCenterX,
        top: photoCenterY,
        scale: 1.5,
        rotate: -180,
        opacity: 0.4,
        duration: 0.85,
        ease: 'power2.out'
      }, 0);
    }

    // Energy burst at photo center
    if (burst) {
      tl.to(burst, {
        left: photoCenterX,
        top: photoCenterY,
        scale: 3,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, 0);
    }

    // Animate particles flying into the photo center
    if (particles) {
      particles.forEach((particle, i) => {
        const delay = (i / particles.length) * 0.3;
        tl.to(particle, {
          left: photoCenterX,
          top: photoCenterY,
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.in'
        }, delay);
      });
    }

    // Animate page fragments breaking apart and spiraling into photo center
    if (fragments) {
      fragments.forEach((fragment, i) => {
        const delay = (i / fragments.length) * 0.25;
        const rotation = Math.random() * 720 - 360;
        tl.to(fragment, {
          left: photoCenterX,
          top: photoCenterY,
          rotation: rotation,
          scale: 0.2,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.in'
        }, delay);
      });
    }

    // Animate motion streaks spiraling into photo center
    if (streaks) {
      streaks.forEach((streak, i) => {
        const delay = (i / streaks.length) * 0.2;
        tl.to(streak, {
          left: photoCenterX,
          top: photoCenterY,
          scale: 0,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.in'
        }, delay);
      });
    }

    // CRITICAL: Make the entire website get sucked INTO the photo's position
    tl.to(appContent, {
      transformOrigin: `${photoCenterX}px ${photoCenterY}px`,
      x: 0,
      y: 0,
      scale: 0.05,
      rotationX: dy * 15,
      rotationY: -dx * 15,
      rotationZ: (dx - dy) * 20,
      z: -400,
      filter: 'blur(5px) saturate(1.15) brightness(0.85)',
      duration: 0.8,
      ease: 'power3.in',
    }, 0.1);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, serviceId: string) => {
    if (warping) { e.preventDefault(); return; }
    e.preventDefault();
    setWarping(true);

    const card = e.currentTarget as HTMLAnchorElement;
    const preview = card.querySelector('.portfolio-image-preview') as HTMLElement | null;
    const imgEl = preview?.querySelector('img') as HTMLImageElement | null;
    const src = imgEl?.src || getRandomServiceImage(serviceId);

    // Freeze the preview image in place and visible during warp
    if (preview) {
      gsap.killTweensOf(preview);
      gsap.set(preview, { opacity: 1 });
    }

    // Compute rect and clamp origin inside the photo (whirlpool center inside image)
    const rect = (preview || card).getBoundingClientRect();
    const clickX = e.clientX; const clickY = e.clientY;
    const cx = Math.max(rect.left, Math.min(clickX, rect.right));
    const cy = Math.max(rect.top, Math.min(clickY, rect.bottom));

    // Grab current transforms so the ghost matches what user sees
    const containerTransform = preview ? getComputedStyle(preview).transform : 'none';
    const innerImg = preview?.querySelector('img') as HTMLImageElement | null;
    const imgTransform = innerImg ? getComputedStyle(innerImg).transform : 'none';

    const { overlay, ring, ring2, swirl, vortex, burst, particles, fragments, streaks, ghost } = createWarpOverlay(src, rect, cx, cy, { container: containerTransform, img: imgTransform });

    // Calculate photo center for the warp origin
    const photoCenterX = rect.left + rect.width / 2;
    const photoCenterY = rect.top + rect.height / 2;

    playWarp(
      ring as HTMLDivElement, 
      overlay, 
      rect,
      () => {
        navigate(`/services/${serviceId}`, { state: { warpOrigin: { x: photoCenterX, y: photoCenterY } } });
        // Remove overlay after a short delay to avoid flicker during route swap
        setTimeout(() => overlay.remove(), 400);
        setWarping(false);
      },
      ghost as HTMLDivElement,
      ring2 as HTMLDivElement,
      swirl as HTMLDivElement,
      vortex as HTMLDivElement,
      burst as HTMLDivElement,
      particles as HTMLDivElement[],
      fragments as HTMLDivElement[],
      streaks as HTMLDivElement[]
    );
  };

  // Function to generate random position and rotation
  const generateRandomTransform = (currentElement: HTMLElement) => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const currentIndex = Array.from(portfolioItems).indexOf(currentElement);
    
    // Calculate grid position (assuming 2-column layout)
    const isLeftColumn = currentIndex % 2 === 0;
    
    // Always position on the opposite side to avoid covering own section
    const side = isLeftColumn ? 'right' : 'left';
    
    // Get current element's position to avoid its area
    const rect = currentElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate safe zones (avoid current section's vertical area)
    const currentTopPercent = (rect.top / viewportHeight) * 100;
    const currentBottomPercent = (rect.bottom / viewportHeight) * 100;
    
    // Choose a safe vertical position that doesn't overlap with current section
    let topPosition: number;

    if (currentTopPercent > 60) {
      // Current section is in bottom area, place image in top area
      topPosition = Math.random() * 40 + 10; // 10-50%
    } else if (currentBottomPercent < 40) {
      // Current section is in top area, place image in bottom area
      topPosition = Math.random() * 40 + 50; // 50-90%
    } else {
      // Current section is in middle, choose top or bottom randomly
      topPosition = Math.random() > 0.5 
        ? Math.random() * 25 + 10  // Top: 10-35%
        : Math.random() * 25 + 65; // Bottom: 65-90%
    }
    
    const rotation = side === 'left' 
      ? Math.random() * 30 + 10  // 10° to 40° for left side
      : -(Math.random() * 30 + 10); // -10° to -40° for right side
    
    return {
      side,
      top: `${Math.max(10, Math.min(85, topPosition))}%`, // Ensure 10-85% range for viewport safety
      rotation,
    };
  };

  // Handle dynamic hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    // IMMEDIATELY hide all images and kill any ongoing animations
    const allImages = document.querySelectorAll('.portfolio-image-preview');
    allImages.forEach(img => {
      gsap.killTweensOf(img);
      gsap.set(img, { opacity: 0 });
    });

    const portfolioItem = e.currentTarget;
    const imagePreview = portfolioItem.querySelector('.portfolio-image-preview') as HTMLElement;
    
    if (imagePreview) {
  const transform = generateRandomTransform(portfolioItem);
      
      // Get service ID and set a random image
      const serviceId = imagePreview.querySelector('img')?.getAttribute('data-service-id');
      const imgElement = imagePreview.querySelector('img') as HTMLImageElement;
      
      if (serviceId && imgElement) {
        // Set a random image for this hover
        imgElement.src = getRandomServiceImage(serviceId);
      }
      
      // Calculate viewport-safe positioning
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const imageWidth = 320;
      const imageHeight = 200;
      
      // Ensure image stays within viewport bounds
      let finalLeft: number;
      let finalTop: number;
      
  if (transform && transform.side === 'left') {
        // Position on left side but ensure it's fully visible
        finalLeft = Math.max(20, Math.min(viewportWidth * 0.3, 250));
      } else {
        // Position on right side but ensure it's fully visible
        finalLeft = Math.max(viewportWidth * 0.7, viewportWidth - imageWidth - 20);
      }
      
      // Convert percentage to pixel position and ensure viewport bounds
  const topPercent = parseFloat((transform?.top || '50').replace('%', ''));
      finalTop = Math.max(20, Math.min((topPercent / 100) * viewportHeight, viewportHeight - imageHeight - 20));
      
      // Start from off-screen position
  const startLeft = (transform && transform.side === 'left') ? -400 : viewportWidth + 50;
      
      // Set initial position (off-screen)
      gsap.set(imagePreview, {
        opacity: 0,
        left: startLeft,
        top: finalTop,
  transform: `rotate(${(transform?.rotation ?? 0)}deg) scale(0.9)`,
      });

      // Animate to final position with a slight delay to ensure clean transition
      gsap.to(imagePreview, {
        opacity: 1,
        left: finalLeft,
  transform: `rotate(${((transform?.rotation ?? 0) * 0.8)}deg) scale(1)`,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.15, // Ensures previous image is completely hidden first
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const portfolioItem = e.currentTarget;
    const imagePreview = portfolioItem.querySelector('.portfolio-image-preview') as HTMLElement;
    
    if (imagePreview) {
      // Kill any ongoing animations and fade out
      gsap.killTweensOf(imagePreview);
      gsap.to(imagePreview, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    }
  };

  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
    
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
          delay: index * 0.15,
          ease: 'power3.out',
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services-container">
        <div className="section-header">
          <span className="section-tag">WHAT WE DO</span>
          <h2>OUR SERVICES</h2>
          <p>From web development to AI solutions, we deliver comprehensive technology services that drive business growth.</p>
        </div>

        <div className="services-portfolio">
          {servicesData.map((service) => (
            <Link 
              to={`/services/${service.id}`}
              key={service.id}
              className="portfolio-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleCardClick(e, service.id)}
            >
              <div className="portfolio-header">
                <div className="portfolio-meta">
                  <span className="portfolio-category">{service.title}</span>
                  <div className="portfolio-tags">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <span key={idx} className="tag">{feature.split('(')[0].trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="portfolio-content">
                <h3 className="portfolio-title">{service.headline}</h3>
                <div className="portfolio-arrow">↗</div>
              </div>
              
              <div className="portfolio-image-preview">
                {service.image && (
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="preview-image"
                    data-service-id={service.id}
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
