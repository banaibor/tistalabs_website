import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';
import automationAnim from '../assets/Automation.json';
import '../styles/components/AutomationSection.css';

gsap.registerPlugin(ScrollTrigger);

// Shard generation ---------------------------------------------------------
type ShardConfig = {
  offsetX: number;
  offsetY: number;
  rotate: number;
  rotateX: number;
  rotateY: number;
  z: number;
  polygon: string; // polygon covering part of card (full coverage overall)
  // bounding box (percent units of card) for per-piece masking layout
  minX: number;
  minY: number;
  width: number;
  height: number;
  normalizedPolygon: string; // polygon normalized to this piece's bounding box (0-100%)
  rawMinX: number; // original (pre-bleed) min x
  rawMinY: number; // original (pre-bleed) min y
};

// Base resolution for standard cards
const GRID_COLS = 4;
const GRID_ROWS = 4; // standard cards; approach & CTA will use smaller grid

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate a random grid of split positions ensuring monotonic increase and full coverage.
// Lines are slightly jittered but shared across adjacent pieces so there are zero gaps.
const buildSplitArray = (count: number, minGap: number, maxGap: number): number[] => {
  const arr: number[] = [0];
  let remaining = 100;
  const segments = count - 1; // interior lines
  for (let i = 0; i < segments - 1; i++) {
    const avg = remaining / (segments - i);
    const gap = Math.min(Math.max(avg + (Math.random() * 2 - 1) * (avg * 0.35), minGap), maxGap);
    arr.push(arr[arr.length - 1] + gap);
    remaining = 100 - arr[arr.length - 1];
  }
  arr.push(100);
  return arr;
};

const buildPuzzlePolygons = (cols = GRID_COLS, rows = GRID_ROWS, diagonals = false, jitter = 2.2): string[] => {
  // Build vertical and horizontal split lines
  const vLines = jitter === 0 ? Array.from({ length: cols + 1 }, (_, i) => (100 / cols) * i) : buildSplitArray(cols + 1, 15, 35);
  const hLines = jitter === 0 ? Array.from({ length: rows + 1 }, (_, i) => (100 / rows) * i) : buildSplitArray(rows + 1, 18, 30);

  // For organic feel, create offset map for interior vertices (so edges tilt)
  // Offsets only applied to interior vertices and mirrored for neighbors.
  const xJitter: Record<string, number> = {};
  const yJitter: Record<string, number> = {};

  const jitterFor = (key: string, amt: number, store: Record<string, number>) => {
    if (!(key in store)) store[key] = (Math.random() * 2 - 1) * amt;
    return store[key];
  };

  const polys: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // corners of the cell
      const x1 = vLines[c];
      const x2 = vLines[c + 1];
      const y1 = hLines[r];
      const y2 = hLines[r + 1];

      // interior corner jitter ids
      const tlKey = `${c}_${r}`;
      const trKey = `${c + 1}_${r}`;
      const blKey = `${c}_${r + 1}`;
      const brKey = `${c + 1}_${r + 1}`;

      // Only jitter interior points (not on outer border) so border stays flush
  const jx1 = jitter === 0 || c === 0 ? 0 : jitterFor(tlKey, jitter, xJitter);
  const jx2 = jitter === 0 || c + 1 === cols ? 0 : jitterFor(trKey, jitter, xJitter);
  const jx3 = jitter === 0 || c === 0 ? 0 : jitterFor(blKey, jitter, xJitter);
  const jx4 = jitter === 0 || c + 1 === cols ? 0 : jitterFor(brKey, jitter, xJitter);

  const jy1 = jitter === 0 || r === 0 ? 0 : jitterFor(tlKey, jitter, yJitter);
  const jy2 = jitter === 0 || r === 0 ? 0 : jitterFor(trKey, jitter, yJitter);
  const jy3 = jitter === 0 || r + 1 === rows ? 0 : jitterFor(blKey, jitter, yJitter);
  const jy4 = jitter === 0 || r + 1 === rows ? 0 : jitterFor(brKey, jitter, yJitter);

  if (diagonals && jitter !== 0 && Math.random() > 0.55) {
        // Split the cell along a diagonal into two triangles for more organic feel
        const diagFirst = Math.random() > 0.5;
        const polyA = diagFirst
          ? `${x1 + jx1}% ${y1 + jy1}%, ${x2 + jx2}% ${y1 + jy2}%, ${x2 + jx4}% ${y2 + jy4}%`
          : `${x1 + jx1}% ${y1 + jy1}%, ${x2 + jx2}% ${y1 + jy2}%, ${x1 + jx3}% ${y2 + jy3}%`;
        const polyB = diagFirst
          ? `${x1 + jx1}% ${y1 + jy1}%, ${x2 + jx4}% ${y2 + jy4}%, ${x1 + jx3}% ${y2 + jy3}%`
          : `${x2 + jx2}% ${y1 + jy2}%, ${x2 + jx4}% ${y2 + jy4}%, ${x1 + jx3}% ${y2 + jy3}%`;
        polys.push(polyA);
        polys.push(polyB);
      } else {
        const polygon = `${x1 + jx1}% ${y1 + jy1}%, ${x2 + jx2}% ${y1 + jy2}%, ${x2 + jx4}% ${y2 + jy4}%, ${x1 + jx3}% ${y2 + jy3}%`;
        polys.push(polygon);
      }
    }
  }
  return polys;
};

const generateShardConfigs = (_seed: number, options?: { small?: boolean; fast?: boolean; diagonals?: boolean; tiny?: boolean; perfect?: boolean; perfectRandom?: boolean }): ShardConfig[] => {
  let cols = options?.tiny ? 3 : options?.small ? 3 : GRID_COLS;
  let rows = options?.tiny ? 2 : options?.small ? 3 : GRID_ROWS;

  let puzzle = buildPuzzlePolygons(
    cols,
    rows,
    options?.perfectRandom ? true : (options?.perfect ? false : !!options?.diagonals),
    options?.perfect ? 0 : options?.perfectRandom ? 1.15 : 2.2 // small jitter for natural shards that still fit
  );

  puzzle = puzzle.map(poly => poly.split(',').map(pt => {
    const [x,y] = pt.trim().split(' ').map(v => parseFloat(v));
    const qx = Math.round(x * 1000) / 1000;
    const qy = Math.round(y * 1000) / 1000;
    return `${qx}% ${qy}%`;
  }).join(', '));

  return puzzle.map(poly => {
    const distanceBase = 340 + rand(-60, 160);
    const angle = rand(0, Math.PI * 2);
    const offsetX = Math.cos(angle) * distanceBase;
    const offsetY = Math.sin(angle) * distanceBase;
    const pts = poly.split(',').map(pt => pt.trim().split(' ').map(v => parseFloat(v.replace('%',''))));
    const xs = pts.map(p => p[0]);
    const ys = pts.map(p => p[1]);
  const rawMinX = Math.min(...xs);
  const rawMaxX = Math.max(...xs);
  const rawMinY = Math.min(...ys);
  const rawMaxY = Math.max(...ys);
    // Expand (bleed) each shard's bounding box slightly so adjacent pieces overlap a bit.
    // This removes sub-pixel seam lines during assembly.
    const BLEED = 0.45; // percent of card dimension on each side
    const minX = Math.max(0, rawMinX - BLEED);
    const maxX = Math.min(100, rawMaxX + BLEED);
    const minY = Math.max(0, rawMinY - BLEED);
    const maxY = Math.min(100, rawMaxY + BLEED);
    const width = maxX - minX;
    const height = maxY - minY;
    const normalizedPolygon = pts.map(([x,y]) => {
      const nx = width === 0 ? 0 : ((x - minX) / width) * 100;
      const ny = height === 0 ? 0 : ((y - minY) / height) * 100;
      return `${nx}% ${ny}%`;
    }).join(', ');
    return {
      offsetX,
      offsetY,
      rotate: rand(-200, 200),
      rotateX: rand(-85, 85),
      rotateY: rand(-85, 85),
      z: rand(-260, 260),
      polygon: poly,
      minX, minY, width, height, normalizedPolygon,
      rawMinX, rawMinY
    } as ShardConfig;
  });
};

interface FragmentedCardProps {
  cardIndex: number;
  className?: string;
  children: ReactNode;
}

const FragmentedCard = ({ cardIndex, className = '', children }: FragmentedCardProps) => {
  const classes = [className, 'fragment-card'].filter(Boolean).join(' ');
  const isApproach = className.includes('step');
  const isCTA = className.includes('automation-cta');
  const shards = generateShardConfigs(cardIndex + 1, {
    tiny: isApproach || isCTA,
    fast: isApproach || isCTA,
    perfectRandom: true
  });
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardDims, setCardDims] = useState<{w:number; h:number; padL:number; padT:number} | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        const cs = window.getComputedStyle(cardRef.current);
        const padL = parseFloat(cs.paddingLeft || '0');
        const padT = parseFloat(cs.paddingTop || '0');
        setCardDims({ w: r.width, h: r.height, padL, padT });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div ref={cardRef} className={classes} data-fragment-card data-fragment-order={cardIndex}>
      <div className="fragment-card-inner">{children}</div>
      <div className="fragment-card-pieces" aria-hidden="true">
        {shards.map((piece, idx) => {
          const usePx = !!cardDims;
          const bw = usePx ? (piece.width/100) * cardDims!.w : piece.width;
          const bh = usePx ? (piece.height/100) * cardDims!.h : piece.height;
          const topPos = usePx ? (piece.minY/100) * cardDims!.h : piece.minY;
          const leftPos = usePx ? (piece.minX/100) * cardDims!.w : piece.minX;
          const pieceStyle: React.CSSProperties = {
            position: 'absolute',
            width: usePx ? `${bw}px` : `${piece.width}%`,
            height: usePx ? `${bh}px` : `${piece.height}%`,
            top: usePx ? `${topPos}px` : `${piece.minY}%`,
            left: usePx ? `${leftPos}px` : `${piece.minX}%`,
            clipPath: `polygon(${piece.normalizedPolygon})`,
            overflow: 'hidden'
          };
          // Translate full-size card content inside piece so only slice shows
          // Use rawMin (pre-bleed) for translation so content aligns perfectly despite bleed expansion.
          let translateX = -(usePx ? (piece.rawMinX/100) * cardDims!.w : piece.rawMinX) + (cardDims?.padL || 0);
          let translateY = -(usePx ? (piece.rawMinY/100) * cardDims!.h : piece.rawMinY) + (cardDims?.padT || 0);
          // Quantize to half-pixels for sharper text alignment particularly on panels 4 & 5
          if (isApproach || isCTA) {
            translateX = Math.round(translateX * 2) / 2;
            translateY = Math.round(translateY * 2) / 2;
          }
          const contentStyle: React.CSSProperties = cardDims ? {
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${cardDims.w}px`,
            height: `${cardDims.h}px`,
            transform: `translate(${translateX}px, ${translateY}px)`,
            pointerEvents: 'none'
          } : {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none'
          };
          return (
            <span
              key={`fragment-piece-${cardIndex}-${idx}`}
              className="fragment-piece"
              data-offset-x={piece.offsetX}
              data-offset-y={piece.offsetY}
              data-rotate={piece.rotate}
              data-rotate-x={piece.rotateX}
              data-rotate-y={piece.rotateY}
              data-z={piece.z}
              style={pieceStyle}
            >
              <span className="fragment-piece-content" style={contentStyle}>{children}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

const AutomationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const headerAnimRef = useRef<HTMLDivElement>(null);
  const headerLottieRef = useRef<AnimationItem | null>(null);
  const cardTimelinesRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    const mm = window.matchMedia('(max-width: 768px)');

    const destroyCardAnimations = () => {
      cardTimelinesRef.current.forEach((timeline) => {
        timeline.scrollTrigger?.kill(true);
        timeline.kill();
      });
      cardTimelinesRef.current = [];
    };

    const initCardAnimations = (containerAnimation?: gsap.core.Tween) => {
      destroyCardAnimations();

      const cards = gsap.utils.toArray<HTMLElement>('[data-fragment-card]');

      cards.forEach((card) => {
  const pieces = card.querySelectorAll<HTMLElement>('.fragment-piece');
  const content = card.querySelector<HTMLElement>('.fragment-card-inner');

        if (!pieces.length || !content) return;

        const setInitialPieceState = () => {
          pieces.forEach((piece) => {
            const offsetX = parseFloat(piece.dataset.offsetX ?? '0');
            const offsetY = parseFloat(piece.dataset.offsetY ?? '0');
            const rotate = parseFloat(piece.dataset.rotate ?? '0');
            const rotateX = parseFloat((piece.dataset.rotateX ?? piece.getAttribute('data-rotate-x')) || '0');
            const rotateY = parseFloat((piece.dataset.rotateY ?? piece.getAttribute('data-rotate-y')) || '0');
            const z = parseFloat((piece.dataset.z ?? piece.getAttribute('data-z')) || '0');

            gsap.set(piece, {
              x: offsetX,
              y: offsetY,
              z,
              rotate,
              rotateX,
              rotateY,
              scale: 1, // exact fit; quantized coordinates mitigate seams
              opacity: 1,
              transformPerspective: 800,
              force3D: true,
              willChange: 'transform'
            });
          });
          // Hide real content initially; piece clones carry text
          gsap.set(content, { autoAlpha: 0, y: 0 });
          const pieceContents = card.querySelectorAll<HTMLElement>('.fragment-piece-content');
          pieceContents.forEach(pc => gsap.set(pc, { autoAlpha: 1 }));
        };

        setInitialPieceState();

  // Earlier assembly for all cards
  const isStep = card.classList.contains('step');
  const isCTA = card.classList.contains('automation-cta');
  const isFast = isStep || isCTA;
        const timeline = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: card,
            // Differentiate timing: Steps moderate, CTA latest
            start: containerAnimation
              ? (isCTA ? 'left 85%' : isStep ? 'left 86%' : 'left 83%')
              : (isCTA ? 'top 83%' : isStep ? 'top 84%' : 'top 82%'),
            end: containerAnimation
              ? (isCTA ? 'left 40%' : isStep ? 'left 45%' : 'left 44%')
              : (isCTA ? 'top 40%' : isStep ? 'top 46%' : 'top 44%'),
            scrub: true,
            containerAnimation,
            invalidateOnRefresh: true,
            onRefresh: setInitialPieceState,
          },
        });

  // isFast already defined above

        timeline.to(pieces, {
          x: 0,
          y: 0,
          z: 0,
          rotate: 0,
          rotateX: 0,
            rotateY: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: isFast ? 0.65 : 1.1,
          stagger: { each: 0.05, from: 'random' }
        });
        // Add a subtle "pop" emphasis after assembly completes
        timeline.to(content, {
          scale: 1.015,
          transformOrigin: '50% 50%',
          duration: isFast ? 0.18 : 0.22,
          ease: 'power3.out'
        }, '-=0.1').to(content, {
          scale: 1,
          duration: isFast ? 0.25 : 0.3,
          ease: 'power2.inOut'
        });

        // Continuous blend with late crossfade: shard text drives readability, final card content fades in only at the very end
        // content starts hidden; reveal progressively in final segment
        timeline.eventCallback('onUpdate', () => {
          const p = timeline.progress();
          // Late build window for crossfade
          // Earlier crossfade so text is readable sooner
          // Per-type crossfade: CTA later for more visible shard travel
          const buildStart = isCTA ? 0.86 : isStep ? 0.83 : 0.81;
          const buildEnd   = isCTA ? 0.97 : isStep ? 0.94 : 0.93;
          let buildPhase = 0;
          if (p >= buildStart) buildPhase = Math.min(1, (p - buildStart) / (buildEnd - buildStart));
          const pieceContents = card.querySelectorAll<HTMLElement>('.fragment-piece-content');
          const contentAlpha = buildPhase; // fade in base content
          gsap.set(content, { autoAlpha: contentAlpha });
          // Piece text fades out inversely
          const pieceAlpha = 1 - buildPhase;
          pieceContents.forEach(pc => pc.style.opacity = pieceAlpha.toString());
          // Shard body opacity remains 1 until build phase, then dims to 0.2
          const shardBodyAlpha = 1 - buildPhase * 0.8;
          pieces.forEach(pce => { (pce as HTMLElement).style.opacity = shardBodyAlpha.toString(); });
          if (p >= buildEnd) {
            // Snap any residual transforms to perfect alignment & mark assembled
            pieces.forEach(pce => gsap.set(pce, { x:0, y:0, z:0, rotate:0, rotateX:0, rotateY:0 }));
            card.classList.add('is-assembled');
            pieceContents.forEach(pc => gsap.set(pc, { autoAlpha: 0 }));
          } else {
            card.classList.remove('is-assembled');
          }
        });

        cardTimelinesRef.current.push(timeline);
      });

      ScrollTrigger.refresh();
    };

    const setupHorizontal = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;
      // horizontal translate amount equals total scrollWidth minus viewport width
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      // Create tween for container animation
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + getDistance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      scrollTweenRef.current = tween;

      initCardAnimations(tween);

      // Optional: toggle active class per panel for subtle fade/scale
      const panels = gsap.utils.toArray<HTMLElement>('.automation-panel');
      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'left center',
          end: 'right center',
          toggleClass: { targets: panel, className: 'is-active' },
          containerAnimation: tween,
        });
      });
    };

    if (!mm.matches) {
      setupHorizontal();
    } else {
      initCardAnimations();
    }

    const onResize = () => {
      // Re-init on crossing breakpoint
      const horizontalEnabled = !!scrollTweenRef.current;
      if (mm.matches && horizontalEnabled) {
        // destroy for mobile
        scrollTweenRef.current?.scrollTrigger?.kill(true);
        scrollTweenRef.current?.kill();
        scrollTweenRef.current = null;
        ScrollTrigger.getAll().forEach(st => st.vars.containerAnimation && st.kill());
        gsap.set(trackRef.current, { x: 0 });
        initCardAnimations();
      } else if (!mm.matches && !horizontalEnabled) {
        setupHorizontal();
      } else {
        initCardAnimations(scrollTweenRef.current ?? undefined);
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize);

    // Setup header lottie animation once
    if (headerAnimRef.current) {
      headerLottieRef.current = lottie.loadAnimation({
        container: headerAnimRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: automationAnim,
      });
    }

    return () => {
      window.removeEventListener('resize', onResize);
      scrollTweenRef.current?.scrollTrigger?.kill(true);
      scrollTweenRef.current?.kill();
      scrollTweenRef.current = null;
      ScrollTrigger.getAll().forEach(st => st.vars.containerAnimation && st.kill());
      destroyCardAnimations();
      if (headerLottieRef.current) {
        headerLottieRef.current.destroy();
        headerLottieRef.current = null;
      }
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

  const approachSteps = [
    {
      number: '01',
      title: 'Rapid Development',
      description: 'Proof-of-concept delivery within 1-2 weeks with measurable efficiency improvements',
    },
    {
      number: '02',
      title: 'Seamless Integration',
      description: 'Minimal disruption deployment with comprehensive testing and rollback procedures',
    },
    {
      number: '03',
      title: 'Complete Support',
      description: 'Full documentation, training, and 24/7 technical support for sustainable adoption',
    },
  ];

  let cardCounter = 0;
  const getNextCardIndex = () => {
    const current = cardCounter;
    cardCounter += 1;
    return current;
  };

  return (
    <section className="automation-section" id="automation" ref={sectionRef}>
      <div className="automation-hscroll">
        <div className="automation-track" ref={trackRef}>
          {/* Panel 1: Header + Stats */}
          <div className="automation-panel">
            <div className="automation-container">
              <div className="automation-hero">
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
                <div className="automation-hero-anim" ref={headerAnimRef} aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Panel 2: Core Technologies */}
          <div className="automation-panel">
            <div className="automation-container">
              <div className="technologies-section">
                <h3>CORE TECHNOLOGIES</h3>
                <div className="technologies-grid">
                  {automationTechnologies.map((tech) => {
                    const cardIndex = getNextCardIndex();
                    return (
                      <FragmentedCard key={tech.name} cardIndex={cardIndex} className="automation-item technology-card">
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
                      </FragmentedCard>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Business Applications */}
          <div className="automation-panel">
            <div className="automation-container">
              <div className="business-applications">
                <h3>BUSINESS APPLICATIONS</h3>
                <div className="applications-grid">
                  {businessApplications.map((application) => {
                    const cardIndex = getNextCardIndex();
                    return (
                      <FragmentedCard key={application.industry} cardIndex={cardIndex} className="automation-item application-card">
                        <div className="application-header">
                          <h4>{application.industry}</h4>
                          <span className="application-impact">{application.impact}</span>
                        </div>
                        <ul className="application-solutions">
                          {application.solutions.map((solution, idx) => (
                            <li key={idx}>{solution}</li>
                          ))}
                        </ul>
                      </FragmentedCard>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Panel 4: Implementation Approach */}
          <div className="automation-panel">
            <div className="automation-container">
              <div className="automation-approach">
                <div className="approach-content">
                  <div className="approach-text">
                    <h3>IMPLEMENTATION APPROACH</h3>
                    <div className="approach-steps">
                      {approachSteps.map((step) => {
                        const cardIndex = getNextCardIndex();
                        return (
                          <FragmentedCard key={step.number} cardIndex={cardIndex} className="step step-card">
                            <span className="step-number">{step.number}</span>
                            <div className="step-content">
                              <h5>{step.title}</h5>
                              <p>{step.description}</p>
                            </div>
                          </FragmentedCard>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 5: CTA */}
          <div className="automation-panel">
            <div className="automation-container">
              <FragmentedCard cardIndex={getNextCardIndex()} className="automation-cta">
                <h3>Ready to eliminate manual tasks and boost productivity?</h3>
                <p>Contact our automation specialists for a complimentary evaluation and discover immediate efficiency gains.</p>
                <button className="automation-cta-button">Start Automation Assessment →</button>
              </FragmentedCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;