import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type LoadingContextValue = {
  show: () => void;
  hide: (delay?: number) => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); // default to hidden
  const timerRef = useRef<number | null>(null);

  const show = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLoading(true);
  }, []);

  const hide = useCallback((delay = 120) => {
    // small debounce so quick navs don't flicker
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setIsLoading(false), delay);
  }, []);

  // Hide loader after page load (fallback)
  useEffect(() => {
    const onLoad = () => hide(80);
    if (document.readyState === 'complete') {
      hide(80);
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
    // Always hide loader after mount (SPA navigation)
    hide(80);
    // Failsafe: forcibly hide loader after 1.5s in case of stuck state
    const failsafe = window.setTimeout(() => hide(0), 1500);
    return () => window.clearTimeout(failsafe);
  }, [hide]);

  // Intercept link clicks to show loader immediately for SPA navigation
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Only respond to primary clicks without modifier keys
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      let el = e.target as HTMLElement | null;
      while (el && el.tagName !== 'A') el = el.parentElement;
      if (!el) return;
      const anchor = el as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      if (!href) return;
      // ignore external links and anchors
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
      if (href.startsWith('#')) return;
      // For same-origin links, show loader
      show();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [show]);

  const value = { show, hide, isLoading };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = (): LoadingContextValue => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used inside LoadingProvider');
  return ctx;
};

export default LoadingContext;
