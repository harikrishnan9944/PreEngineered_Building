'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, Construction, PhoneCall } from 'lucide-react';
import Magnet from './animations/Magnet';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-industrial-black/80 border-b border-slate-200/50 dark:border-white/5 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded bg-industrial-orange text-white transform group-hover:rotate-6 transition-transform duration-300 shadow-3d-orange/30 shadow-sm">
            <Construction className="w-6 h-6" />
          </div>
          <span className="font-sans font-black tracking-widest text-lg md:text-xl text-slate-900 dark:text-white group-hover:text-industrial-orange transition-colors">
            SHREE NIVI <span className="text-industrial-orange font-normal">BUILDTECH</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? 'text-industrial-orange'
                    : 'text-slate-600 dark:text-slate-350 hover:text-industrial-orange'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-industrial-orange rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden xl:flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Quick Quote Magnet CTA */}
          <Magnet range={40} strength={0.25}>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-industrial-orange hover:bg-industrial-orange-light text-white transition-all shadow-3d-orange active:translate-y-1"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              Get Free Quote
            </Link>
          </Magnet>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="flex xl:hidden items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-350"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-350"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[73px] bg-white dark:bg-industrial-black border-b border-slate-250 dark:border-white/5 shadow-2xl z-40 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-bold py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-industrial-orange/10 text-industrial-orange'
                      : 'text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-industrial-orange'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/contact"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold bg-industrial-orange text-white shadow-3d-orange text-center"
          >
            <PhoneCall className="w-4 h-4" />
            Get Free Quote
          </Link>
        </div>
      )}
    </header>
  );
}
