import React, { type ElementType } from 'react';
import useInView from '../hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  /** Optional tag to render the wrapper as (default: div) */
  as?: ElementType;
  /** Delay in ms for the transition */
  delay?: number;
  className?: string;
}

export default function Reveal({ children, as = 'div', delay = 0, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const Tag: any = as;
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' in-view' : ''}${className ? ' ' + className : ''}`}
      style={{ transitionDelay: `${Math.max(0, delay)}ms` }}
    >
      {children}
    </Tag>
  );
}
