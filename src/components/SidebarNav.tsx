import { useEffect, useRef, useState } from 'react';
import '../styles/components/SidebarNav.css';

type Section = {
  id: string;
  label: string;
};

const sections: Section[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'ai-solutions', label: 'AI Solutions' },
  { id: 'automation', label: 'Automation' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const SidebarNav = () => {
  const [active, setActive] = useState<string>('home');
  const visibilityMapRef = useRef<Record<string, number>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Use IntersectionObserver to track which section has largest visible area
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -30% 0px', // bias toward content around upper-middle viewport
      threshold: Array.from({ length: 21 }, (_, i) => i / 20), // 0..1 step .05
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        // Intersection ratio approximates how much of the section is in view
        visibilityMapRef.current[id] = entry.intersectionRatio;
      });

      // Find visible section with highest ratio; fallback to last known active if ties
      let maxId = active;
      let maxRatio = -1;
      for (const s of sections) {
        const r = visibilityMapRef.current[s.id] ?? 0;
        if (r > maxRatio) {
          maxRatio = r;
          maxId = s.id;
        }
      }

      if (maxId && maxId !== active) {
        setActive(maxId);
      }
    }, options);

    // Observe all sections that exist in DOM
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const scrollWithOffset = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    const offset = navbar ? navbar.getBoundingClientRect().height + 12 : 72; // add small gap
    const top = rect.top + scrollTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="sidebar-nav" aria-label="Section navigation">
      <ul>
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className={isActive ? 'active' : undefined}>
              <button
                type="button"
                className="sidebar-item"
                aria-label={s.label}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => scrollWithOffset(s.id)}
              >
                <span className="dot" aria-hidden></span>
                <span className="label">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SidebarNav;
