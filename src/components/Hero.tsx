import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import '../styles/components/Hero.css';

type HoverWordProps = {
  text: string;
  quote: string;
  color: string; // accent color for tooltip/glow
  cursorClass: string; // maps to CSS cursor class
  className?: string; // allow gradient wrapping to style
  noQuote?: boolean; // suppress tooltip for invisible/hover-only words
};

const HoverWord = ({ text, quote, color, cursorClass, className, noQuote }: HoverWordProps) => {
  const style = { '--accent': color } as CSSProperties;
  const wordRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  const positionTooltip = (mouse?: { x: number; y: number }) => {
    const word = wordRef.current;
    const tip = tipRef.current;
    if (!word || !tip) return;
    const margin = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prepare for measurement
    tip.style.position = 'fixed';
    tip.style.maxWidth = '70vw';
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.style.visibility = 'hidden';
    tip.textContent = quote;

    const wordRect = word.getBoundingClientRect();
    const tRect = tip.getBoundingClientRect();
    const width = Math.min(tRect.width || 0, vw - margin * 2);
    const height = tRect.height || 0;

    // Follow cursor horizontally; center relative to cursor, clamp to viewport
    const desiredLeft = mouse
      ? mouse.x - width / 2
      : wordRect.left + wordRect.width / 2 - width / 2;
    let left = Math.max(margin, Math.min(desiredLeft, vw - width - margin));

    // Always place above the cursor/word, clamped to top margin
    let top = mouse ? mouse.y - height - 12 : wordRect.top - height - margin;
    let placement: 'bottom' | 'top' = 'top';
    top = Math.max(margin, Math.min(top, vh - height - margin));

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.dataset.placement = placement;
    tip.style.visibility = 'visible';
  };

  const show = (mouse?: { x: number; y: number }) => {
    visibleRef.current = true;
    // Do not show quotes if the word isn't actually visible (e.g., hidden until hovered elsewhere)
    const el = wordRef.current;
    if (el) {
      const cs = getComputedStyle(el);
      const opacity = parseFloat(cs.opacity || '1');
      const hidden = cs.visibility === 'hidden' || cs.display === 'none';
      if (hidden || opacity < 0.2 || noQuote) {
        // ensure tooltip is hidden if previously visible
        visibleRef.current = false;
        if (tipRef.current) {
          tipRef.current.classList.remove('visible');
          tipRef.current.style.visibility = 'hidden';
        }
        return;
      }
    }
    positionTooltip(mouse);
    tipRef.current?.classList.add('visible');
  };
  const hide = () => {
    visibleRef.current = false;
    tipRef.current?.classList.remove('visible');
  };

  useEffect(() => {
    const onResize = () => { if (visibleRef.current) positionTooltip(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, []);

  return (
    <>
      <span
        ref={wordRef}
        className={`hover-word ${cursorClass} ${className ?? ''} ${noQuote ? 'no-quote' : ''}`}
        style={style}
        tabIndex={0}
        onMouseEnter={(e) => show({ x: e.clientX, y: e.clientY })}
        onMouseLeave={hide}
        onFocus={() => show()}
        onBlur={hide}
        onMouseMove={(e) => visibleRef.current && positionTooltip({ x: e.clientX, y: e.clientY })}
      >
        {text}
      </span>
      <div ref={tipRef} className="hover-tooltip" aria-hidden style={style}>
        {quote}
      </div>
    </>
  );
};

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(h1Ref.current, {
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: 'power4.out',
    })
    .from(pRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.5');
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-content" ref={heroRef}>
        
        <h1 ref={h1Ref} className="hero-headline">
          <HoverWord
            text="DRIVEN"
            quote="The difference between ordinary and extraordinary is that little extra drive that refuses to quit."
            color="#22d3ee"
            cursorClass="cursor-lightning"
          />{' '}
          <HoverWord
            text="BY"
            quote="Success stands by those who stand by their vision, no matter the obstacles."
            color="#a78bfa"
            cursorClass="cursor-star"
          />{' '}
          <HoverWord
            text="CODE"
            quote="Code is poetry written in logic, where every line has the power to change the world."
            color="#34d399"
            cursorClass="cursor-braces"
          />,
          <br />
          <HoverWord
            text="FUELED"
            quote="Passion is the fuel that turns dreams into reality and impossibilities into achievements."
            color="#f59e0b"
            cursorClass="cursor-flame"
          />{' '}
          <HoverWord
            text="BY"
            quote="By choosing courage over comfort, we unlock doors we never knew existed."
            color="#a78bfa"
            cursorClass="cursor-star"
          />{' '}
          <HoverWord
            text="INNOVATION"
            quote="Innovation is seeing what everyone else sees but thinking what no one else has thought."
            color="#8b5cf6"
            cursorClass="cursor-bulb"
          />,
          <br />
          <span className="gradient-text">
            <HoverWord
              text="BUILDING"
              quote="Every great achievement starts with the decision to build, brick by brick, line by line."
              color="#22d3ee"
              cursorClass="cursor-hammer"
              className="in-gradient"
              noQuote
            />{' '}
            <HoverWord
              text="THE"
              quote="The journey of a thousand miles begins with the courage to take the first step."
              color="#60a5fa"
              cursorClass="cursor-compass"
              className="in-gradient"
              noQuote
            />{' '}
            <HoverWord
              text="FUTURE"
              quote="The future belongs not to those who wait for it, but to those who create it with their own hands."
              color="#a78bfa"
              cursorClass="cursor-rocket"
              className="in-gradient"
              noQuote
            />
          </span>
        </h1>
        
        <div className="hero-subtext">
          <h2>
            <HoverWord
              text="HELPING"
              quote="Helping others rise lifts us all higher than we could ever climb alone."
              color="#34d399"
              cursorClass="cursor-heart"
            />{' '}
            <HoverWord
              text="BUSINESSES"
              quote="Great businesses aren't built on profits alone, but on the value they create for the world."
              color="#22d3ee"
              cursorClass="cursor-briefcase"
            />{' '}
            <HoverWord
              text="THRIVE"
              quote="To thrive is to grow beyond survival, to flourish where others merely exist."
              color="#f472b6"
              cursorClass="cursor-spark"
            />{' '}
            <HoverWord
              text="IN"
              quote="In every challenge lies an opportunity, in every setback lives a comeback."
              color="#f59e0b"
              cursorClass="cursor-compass"
            />{' '}
            <HoverWord
              text="THE"
              quote="The only limits that exist are the ones we place on ourselves."
              color="#60a5fa"
              cursorClass="cursor-star"
            />{' '}
            <HoverWord
              text="DIGITAL"
              quote="Digital is not just technology—it's the language of limitless possibility."
              color="#22d3ee"
              cursorClass="cursor-chip"
            />{' '}
            <HoverWord
              text="WORLD"
              quote="The world changes when dreamers become doers and ideas become impact."
              color="#a78bfa"
              cursorClass="cursor-globe"
            />
          </h2>
          <p ref={pRef}>
            We craft exceptional digital experiences through cutting-edge web development, 
            intelligent automation, and innovative AI solutions. From startups to enterprises, 
            we transform ambitious ideas into powerful technology that drives real results.
          </p>
        </div>
        
        <div className="hero-cta">
          <a href="#services" className="btn-primary">View Our Services</a>
          <a href="#contact" className="btn-secondary">Start a Project</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
