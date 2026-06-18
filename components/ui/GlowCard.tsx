'use client';

import React from 'react';
import { useMouseGlow } from '@/hooks/useMouseGlow';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlowCard({ children, className = '', onClick }: GlowCardProps) {
  const cardRef = useMouseGlow<HTMLDivElement>();

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`mouse-glow-card relative rounded-2xl transition-all duration-300 
        /* Light mode styles */
        bg-white/80 border border-slate-200/80 shadow-md shadow-slate-100/50
        /* Dark mode styles */
        dark:bg-industrial-gray/65 dark:border-white/8 dark:shadow-none
        backdrop-blur-lg group z-10 ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
