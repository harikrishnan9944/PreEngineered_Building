'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Zap, Construction, Shield } from 'lucide-react';
import Counter from './animations/Counter';
import Magnet from './animations/Magnet';

interface StatItem {
  value: string;
  label: string;
}

interface HeroData {
  title: string;
  subtitle: string;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
  imageUrl: string;
  stats: StatItem[];
}

interface HeroProps {
  heroData: HeroData;
}

export default function Hero({ heroData }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);

  // Scroll parallax hook
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 240]);
  const opacityParallax = useTransform(scrollY, [0, 500], [1, 0]);

  // Track mouse coordinates for glow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Mount animation trigger, client-side particles, and page-load progress bar
  useEffect(() => {
    setIsMounted(true);

    // Generate random background particles ONLY on the client to prevent hydration mismatch
    const generatedParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 3, // 3px to 8px
      left: Math.random() * 100, // %
      top: Math.random() * 100, // %
      duration: Math.random() * 15 + 20, // 20s to 35s
      delay: Math.random() * -10, // negative delay so they start immediately
      xMovement: Math.random() * 60 - 30,
      yMovement: Math.random() * -120 - 40,
    }));
    setParticles(generatedParticles);

    const interval = setInterval(() => {
      setLineProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleScrollDown = () => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
      window.scrollTo({
        top: height - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen min-h-[750px] w-full bg-slate-950 text-white overflow-hidden -mt-[88px] pt-[88px] flex flex-col justify-between"
    >
      {/* Top preloader loading indicator line */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-industrial-orange to-industrial-orange-light z-50 transition-all duration-300 pointer-events-none"
        style={{ width: `${lineProgress}%`, opacity: lineProgress === 100 ? 0 : 1 }}
      />

      {/* BACKGROUND IMAGE WITH PARALLAX & ZOOM */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <motion.div
          initial={{ scale: 1.15, filter: 'blur(4px)' }}
          animate={isMounted ? { scale: 1.0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }} // Custom easeOutExpo
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={heroData.imageUrl}
            alt="Pre-Engineered Building Modern Steel Warehouse Factory"
            fill
            priority
            quality={95}
            className="object-cover object-center select-none"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      {/* PREMIUM GRADIENTS & READABILITY OVERLAYS */}
      <div className="absolute inset-0 bg-slate-950/45 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/15 to-transparent z-10 pointer-events-none" />

      {/* INTERACTIVE MOUSE GLOW OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 md:opacity-100"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 90, 0, 0.09), transparent 50%)`
        }}
      />

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-industrial-orange/20 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, p.yMovement, 0],
              x: [0, p.xMovement, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* HERO MAIN CONTENT GRID */}
      <motion.div 
        style={{ opacity: opacityParallax }}
        className="max-w-7xl mx-auto px-6 w-full flex-grow flex items-center relative z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full pt-8 pb-16">
          
          {/* Headline details */}
          <div className="lg:col-span-8 flex flex-col justify-center items-start text-left gap-6">
            
            {/* Tag line badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-industrial-orange/30 bg-industrial-orange/10 text-xs md:text-sm font-bold text-industrial-orange tracking-widest uppercase">
                <Zap className="w-4 h-4 animate-pulse" />
                Premium Steel Construction
              </span>
            </motion.div>

            {/* Main Title (Headline) */}
            <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight uppercase">
              <span className="block text-white filter drop-shadow-md">
                Engineering
              </span>
              <span className="block text-white filter drop-shadow-md">
                Tomorrow's
              </span>
              <motion.span 
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-industrial-orange via-industrial-orange-light to-industrial-orange drop-shadow-[0_4px_16px_rgba(255,90,0,0.3)]"
              >
                Steel Structures
              </motion.span>
            </h1>

            {/* Sub-heading */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed font-medium filter drop-shadow-sm"
            >
              {heroData.subtitle}
            </motion.p>

            {/* Actions Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Magnet>
                <Link
                  href={heroData.ctaLink1}
                  className="px-8 py-4 bg-industrial-orange hover:bg-industrial-orange-light text-white font-bold rounded-xl text-base shadow-3d-orange transition-all hover:scale-105 active:translate-y-1 flex items-center gap-2"
                >
                  {heroData.ctaText1}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Magnet>

              <Magnet>
                <Link
                  href={heroData.ctaLink2}
                  className="px-8 py-4 bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-industrial-orange/30 text-white font-bold rounded-xl text-base transition-all hover:scale-105 backdrop-blur-md block"
                >
                  {heroData.ctaText2}
                </Link>
              </Magnet>
            </motion.div>
          </div>

          {/* Luxury industrial side card */}
          <div className="lg:col-span-4 hidden lg:flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={isMounted ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 1.0, delay: 0.8, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-white/10 backdrop-blur-xl bg-slate-950/60 p-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="steel-texture absolute inset-0 opacity-10 rounded-2xl pointer-events-none" />
              {/* Card glowing edge animation */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-industrial-orange/40 to-transparent group-hover:via-industrial-orange transition-all duration-700" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-industrial-orange/10 rounded-xl border border-industrial-orange/20 text-industrial-orange shadow-inner">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">REF: SN-PEB-2026</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide group-hover:text-industrial-orange transition-colors">
                    Tekla 3D Engineered
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    ISO 9001:2015 certified steel structures designed using smart detailing software to withstand high wind speed, seismic activity, and excessive loads.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between text-xs font-mono text-slate-400">
                  <span>STRUCTURAL QUALITY</span>
                  <span className="text-industrial-orange font-bold">100% CERTIFIED</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* GLASSMORPHISM STATS BANNER */}
      <motion.div 
        style={{ opacity: opacityParallax }}
        className="w-full relative z-20 pb-16 md:pb-12 max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {heroData.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isMounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <div className="relative group overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-slate-950/40 p-5 md:p-6 text-center flex flex-col justify-center h-full shadow-lg transition-all duration-500 hover:bg-slate-900/60 hover:border-industrial-orange/30 hover:scale-[1.02]">
                {/* Micro glow behind card on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-industrial-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <span className="text-3xl md:text-4xl lg:text-5xl font-black text-industrial-orange drop-shadow-md mb-2">
                  <Counter value={stat.value} />
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest leading-snug">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* BOUNCING SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isMounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-industrial-orange transition-colors"
          onClick={handleScrollDown}
        >
          <div className="w-5 h-9 rounded-full border border-white/30 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [1, 0, 30, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-industrial-orange"
            />
          </div>
          <ChevronDown className="w-4 h-4 animate-pulse -mt-1" />
        </motion.div>
      </motion.div>
    </div>
  );
}
