'use client';

import React from 'react';
import { motion } from 'framer-motion';

type RevealVariant = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'blur-reveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const getVariants = () => {
    switch (variant) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slide-down':
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        };
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'blur-reveal':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
          visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      variants={getVariants()}
      transition={{
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
