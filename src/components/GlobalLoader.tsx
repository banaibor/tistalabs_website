import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { useLoading } from '../contexts/LoadingContext';
import animationData from '../assets/Tista Labs.json';
import '../styles/components/GlobalLoader.css';

const GlobalLoader: React.FC = () => {
  const { isLoading } = useLoading();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<lottie.AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData as any,
    });
    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`global-loader ${isLoading ? 'visible' : 'hidden'}`} aria-hidden={!isLoading}>
      <div className="global-loader-backdrop" />
      <div className="global-loader-body">
        <div ref={containerRef} className="global-loader-lottie" />
      </div>
    </div>
  );
};

export default GlobalLoader;
