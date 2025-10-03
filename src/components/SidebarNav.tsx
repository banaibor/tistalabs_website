import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActive(sections[i].id);
            break;
          }
        }
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener with throttle
    let timeoutId: number | null = null;
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = window.setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
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
