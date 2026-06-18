'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  value: string;
  duration?: number; // duration in seconds
}

export default function Counter({ value, duration = 2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  // Extract number (e.g. "250+" -> 250, "100%" -> 100)
  const numericString = value.replace(/[^0-9]/g, '');
  const target = parseInt(numericString, 10) || 0;
  // Extract non-numbers (e.g. "250+" -> "+", "100%" -> "%")
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number | null = null;
    let frameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(Math.floor(easeProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    frameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}
