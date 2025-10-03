import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView';

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

export interface CountUpProps {
  value: string | number;
  duration?: number; // ms
  className?: string;
}

/**
 * CountUp animates the numeric portion of a string, preserving any prefix/suffix like + or %.
 * Examples: "95+", "+30%", "120.5ms" -> animates the number only.
 */
export default function CountUp({ value, duration = 1200, className }: CountUpProps) {
  const text = String(value);
  const match = text.match(/[+-]?\d*\.?\d+/);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    if (!match) return; // nothing numeric, keep as-is
    started.current = true;

    const numStr = match[0];
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const target = parseFloat(numStr);
    const prefix = text.slice(0, match.index || 0);
    const suffix = text.slice((match.index || 0) + numStr.length);

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const curr = (target * eased);
      const formatted = curr.toFixed(decimals);
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) requestAnimationFrame(step);
      else setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`);
    };

    requestAnimationFrame(step);
  }, [inView, match, text, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
