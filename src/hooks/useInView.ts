import { useEffect, useRef, useState } from 'react';

/**
 * useInView - a tiny IntersectionObserver hook
 * Returns a ref to attach and a boolean that becomes true once the element enters the viewport.
 */
export default function useInView<T extends HTMLElement = HTMLElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  once = true,
}: {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
} = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, inView } as const;
}
