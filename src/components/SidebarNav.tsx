import { useEffect, useMemo, useState } from 'react';
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

  const observer = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) setActive(id);
        }
      });
    };
    // Using threshold ~0.55 so a section becomes active when majority is in view
    return new IntersectionObserver(onIntersect, { threshold: 0.55 });
  }, []);

  useEffect(() => {
    if (!observer) return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as Element[];
    targets.forEach((el) => observer.observe(el));
    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [observer]);

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
