import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/components/AnimatedLogo.css';

const AnimatedLogo = () => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    
    // Run once: build the logo, celebrate, and hold pose (no loop)
    const timeline = gsap.timeline({ repeat: 0 });
    
    // Scope all selectors to this component instance
    const container = logoRef.current;
    const logoLetters = container.querySelectorAll('.logo-letter');
    const babyGroot = container.querySelector('.baby-groot');
    const carriedLetter = container.querySelector('.carried-letter');
    
    // Safety check - only proceed if all required elements exist
    if (!babyGroot || !carriedLetter || logoLetters.length === 0) {
      return;
    }
    
    // Initially hide all letters and Baby Groot
    gsap.set(logoLetters, { opacity: 0, y: 15, scale: 0.7, rotation: 0 });
    gsap.set(babyGroot, { opacity: 0, x: -40, scale: 0 });
    gsap.set(carriedLetter, { opacity: 0, scale: 0, xPercent: -50, yPercent: -100 });
    
    const letters = ['T', 'I', 'S', 'T', 'A', 'L', 'A', 'B', 'S'];
    // Random rotations for each letter placement (Groot's imperfect placement)
    const letterRotations = [-3, 2, -1, 4, -2, 1, -4, 3, -1];
    const letterYOffsets = [0, -2, 1, -1, 2, -1, 0, 1, -2]; // Slight vertical variations
    
    // Animation sequence: Baby Groot appears and builds each letter
    timeline
      // Baby Groot appears with a waddle
      .to(babyGroot, {
        opacity: 1,
        scale: 1,
        x: -10, // Start closer to the first letter position
        duration: 0.8,
        ease: 'back.out(1.7)'
      })
      
      // Groot does a little dance before starting
      .to(babyGroot, {
        rotation: -10,
        duration: 0.2,
        yoyo: true,
        repeat: 3
      }, '+=0.3')
      
    // Build each letter sequentially with Groot's personality
    letters.forEach((letter, index) => {
      const letterEl = container.querySelector(`.letter-${index}`);
      const grootArms = container.querySelector('.groot-arms');
      
      // Safety check - skip if elements don't exist
      if (!letterEl || !grootArms) return;
      
      const letterRotation = letterRotations[index];
      const yOffset = letterYOffsets[index];
      
      timeline
        // Groot picks up letter first (reaches up and grabs it)
        .to(grootArms, {
          rotation: -20,
          duration: 0.3,
          onStart: () => {
            // Bring Groot to front while carrying letters
            if (babyGroot) gsap.set(babyGroot, { zIndex: 15 });
            // Set the character for the carried overlay
            if (carriedLetter) {
              (carriedLetter as HTMLElement).textContent = letter;
              gsap.set(carriedLetter, { opacity: 1, scale: 1 });
            }
          }
        })
        
        // Groot waddles to position while carrying the letter
        .to(babyGroot, {
          x: () => {
            if (!container) return 0;
            const containerRect = container.getBoundingClientRect();
            const handEl = container.querySelector('.groot-hand.right') as HTMLElement | null;
            if (!letterEl || !handEl || !babyGroot) return 0;
            const letterRect = letterEl.getBoundingClientRect();
            const handRect = handEl.getBoundingClientRect();
            const grootRect = babyGroot.getBoundingClientRect();
            const letterCenterX = letterRect.left + letterRect.width / 2 - containerRect.left;
            // Aim a bit toward the fingertips so it visually reads as gripping from below-right
            const handTargetX = (handRect.left + handRect.width * 0.75) - grootRect.left;
            return letterCenterX - handTargetX;
          },
          duration: 0.8,
          ease: 'power1.inOut',
          onUpdate: function() {
            // Letter moves with Groot's right hand while walking
            const containerRect = container?.getBoundingClientRect();
            const handEl = container.querySelector('.groot-hand.right') as HTMLElement | null;
            if (containerRect && handEl && babyGroot && carriedLetter) {
              const handRect = handEl.getBoundingClientRect();
              const handX = handRect.left + handRect.width * 0.75 - containerRect.left;
              // Position just above the palm so the letter bottom sits on the hand
              const handY = handRect.top + handRect.height * 0.15 - containerRect.top;
              const progress = this.progress();
              const bounce = Math.sin(progress * Math.PI * 6) * 1.5;
              gsap.set(babyGroot, { y: bounce });
              gsap.set(carriedLetter, {
                x: handX,
                y: handY,
                rotation: (Math.random() * 10 - 5) + letterRotation * 0.25
              });
            }
          }
        })
        
        // Groot carefully places the letter (reaches down)
        .to(grootArms, {
          rotation: 15,
          duration: 0.4
        })
        
        // Groot struggles a bit to get it perfect (cute adjustment)
        .to(babyGroot, {
          rotation: letterRotation * 0.3,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        })
        
        // Perfect synchronization: carried letter transforms into placed letter
        .to({}, {
          duration: 0.35,
          ease: 'back.out(1.5)',
          onStart: () => {
            if (!container || !letterEl || !carriedLetter) return;
            const containerRect = container.getBoundingClientRect();
            const lr = letterEl.getBoundingClientRect();
            const cx = lr.left + lr.width / 2 - containerRect.left;
            const cy = lr.bottom - containerRect.top; // bottom center for under-support
            gsap.set(carriedLetter, { x: cx, y: cy });
            gsap.set(letterEl, { opacity: 1, y: yOffset, scale: 1, rotation: letterRotation });
          },
          onComplete: () => {
            if (carriedLetter) gsap.set(carriedLetter, { opacity: 0 });
          }
        })
        
        // Groot's arms return to normal position and he steps back (lower z-index)
        .to(grootArms, {
          rotation: 0,
          duration: 0.4,
          onStart: () => {
            // Move Groot behind the letters once placed
            if (babyGroot) gsap.set(babyGroot, { zIndex: 3 });
          }
        })
        
        // Groot celebrates with a little bounce and arm raise
        .to(babyGroot, {
          y: -8,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        })
        .to(grootArms, {
          rotation: 30,
          duration: 0.15,
          yoyo: true,
          repeat: 1
        }, '-=0.2');
    });
    
    // Final celebration — non-looping; celebrate clearly and hold pose
    const logoText = container.querySelector('.logo-text');
    const grootArmsMain = container.querySelector('.groot-arms');
    const grootArmRight = container.querySelector('.groot-arm.right');
    
    if (logoText && grootArmsMain && grootArmRight) {
      timeline
        // quick celebratory wiggle
        .to(babyGroot, {
          rotation: 15,
          duration: 0.2,
          yoyo: true,
          repeat: 3
        }, '+=0.3')
        // logo glow punch-up
        .to(logoText, {
          textShadow: '0 0 25px rgba(139, 195, 74, 0.8)',
          duration: 0.4
        })
        .to(logoText, {
          textShadow: '0 0 10px rgba(139, 195, 74, 0.4)',
          duration: 0.4
        })
        // move Groot slightly to the right side and hold
        .to(babyGroot, {
          x: "+=30",
          y: 0,
          rotation: 0,
          duration: 0.6,
          ease: 'power1.inOut'
        })
        // reset wrapper arms rotation to a neutral baseline
        .to(grootArmsMain, { rotation: 0, duration: 0.001 })
        // raise right arm for a wave
        .to(grootArmRight, {
          rotation: -60,
          transformOrigin: 'top center',
          duration: 0.25
        })
        // wave motion 3x
        .to(grootArmRight, {
          rotation: -20,
          duration: 0.22,
          yoyo: true,
          repeat: 3
        })
        // happy bounce
        .to(babyGroot, {
          y: -6,
          duration: 0.2,
          yoyo: true,
          repeat: 2
        })
        // hold a pleasant pose with arm slightly raised
        .to(grootArmRight, { rotation: -35, duration: 0.15 });
    }
    
    // Cleanup function to prevent errors when component unmounts
    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <a className="logo-link" href="/" aria-label="Home" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
      <div className="animated-logo-container" ref={logoRef}>
        {/* Baby Groot - humanoid tree character */}
        <div className="baby-groot">
        {/* Head - rounded with bark texture */}
        <div className="groot-head">
          <div className="groot-face">
            <div className="groot-eye left"></div>
            <div className="groot-eye right"></div>
            <div className="groot-nose"></div>
            <div className="groot-mouth"></div>
          </div>
          <div className="bark-texture">
            <div className="bark-line"></div>
            <div className="bark-line"></div>
            <div className="bark-line"></div>
          </div>
        </div>
        
        {/* Torso - humanoid proportions */}
        <div className="groot-torso">
          <div className="groot-chest"></div>
          <div className="groot-belly"></div>
        </div>
        
        {/* Arms with hands that can hold letters */}
        <div className="groot-arms">
          <div className="groot-arm left">
            <div className="groot-forearm left"></div>
            <div className="groot-hand left">
              <div className="groot-finger"></div>
              <div className="groot-finger"></div>
              <div className="groot-finger"></div>
            </div>
          </div>
          <div className="groot-arm right">
            <div className="groot-forearm right"></div>
            <div className="groot-hand right">
              <div className="groot-finger"></div>
              <div className="groot-finger"></div>
              <div className="groot-finger"></div>
            </div>
          </div>
          {/* Letter will be rendered at container level for pixel-perfect positioning */}
        </div>
        
        {/* Legs - more humanoid stance */}
        <div className="groot-legs">
          <div className="groot-leg left">
            <div className="groot-thigh left"></div>
            <div className="groot-shin left"></div>
            <div className="groot-foot left"></div>
          </div>
          <div className="groot-leg right">
            <div className="groot-thigh right"></div>
            <div className="groot-shin right"></div>
            <div className="groot-foot right"></div>
          </div>
        </div>
        
        {/* Natural foliage growing on body */}
        <div className="groot-foliage">
          <div className="branch shoulder-branch">
            <div className="leaf"></div>
            <div className="leaf"></div>
          </div>
          <div className="branch head-branch">
            <div className="leaf"></div>
          </div>
          <div className="moss-patch chest"></div>
          <div className="moss-patch arm"></div>
        </div>
      </div>

  {/* Carried letter overlay (follows Groot's hand exactly) */}
  <div className="carried-letter" />

  {/* Logo Text */}
      <div className="logo-text">
        <span className="logo-letter letter-0">T</span>
        <span className="logo-letter letter-1">I</span>
        <span className="logo-letter letter-2">S</span>
        <span className="logo-letter letter-3">T</span>
        <span className="logo-letter letter-4">A</span>
        <span className="logo-space"></span>
        <span className="logo-letter letter-5">L</span>
        <span className="logo-letter letter-6">A</span>
        <span className="logo-letter letter-7">B</span>
        <span className="logo-letter letter-8">S</span>
      </div>
    </div>
    </a>
  );
};

export default AnimatedLogo;