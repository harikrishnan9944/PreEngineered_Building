'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Construction, Mail, ArrowUp, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

interface FooterProps {
  logoText?: string;
  logoUrl?: string;
  footerDescription?: string;
  copyrightText?: string;
}

export default function Footer({
  logoText = "SHREE NIVI BUILDTECH",
  logoUrl = "",
  footerDescription = "Leading the steel construction sector for over 25 years. We design, fabricate, and erect high-grade pre-engineered buildings and heavy industrial structures.",
  copyrightText
}: FooterProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const words = logoText.trim().split(/\s+/);
  const highlightPart = words.length > 1 ? words[words.length - 1] : '';
  const mainPart = words.length > 1 ? words.slice(0, -1).join(' ') + ' ' : logoText;

  const activeCopyrightText = copyrightText || `© ${new Date().getFullYear()} Shree Nivi Buildtech. All rights reserved.`;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-[#06070a] border-t border-slate-200 dark:border-white/5 pt-16 pb-8 text-slate-700 dark:text-slate-400 overflow-hidden">
      {/* Animated background grids */}
      <div className="animated-grid opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              {logoUrl ? (
                <div className="w-12 h-12 relative overflow-hidden flex items-center justify-center shrink-0 rounded-full">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="p-2 rounded bg-industrial-orange text-white transform group-hover:rotate-6 transition-transform shadow-3d-orange/30">
                  <Construction className="w-5 h-5" />
                </div>
              )}
              <span className="font-sans font-black tracking-widest text-lg text-slate-900 dark:text-white">
                {mainPart}
                {highlightPart && (
                  <span className="text-industrial-orange font-normal">{highlightPart}</span>
                )}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-455">
              {footerDescription}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-industrial-orange hover:text-white dark:hover:bg-industrial-orange dark:hover:text-white transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-industrial-orange hover:text-white dark:hover:bg-industrial-orange dark:hover:text-white transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-industrial-orange hover:text-white dark:hover:bg-industrial-orange dark:hover:text-white transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-industrial-orange hover:text-white dark:hover:bg-industrial-orange dark:hover:text-white transition-all flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 00.5 6.163C0 8.024 0 12 0 12s0 3.976.5 5.837a3.003 3.003 0 002.11 2.108c1.858.555 9.388.555 9.388.555s7.53 0 9.388-.555a3.003 3.003 0 002.11-2.108c.5-1.861.5-5.837.5-5.837s0-3.976-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white tracking-wide mb-6 uppercase text-sm border-l-2 border-industrial-orange pl-3">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-industrial-orange transition-colors">Company Story</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-industrial-orange transition-colors">Our Services</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-industrial-orange transition-colors">Completed Projects</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-industrial-orange transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-industrial-orange transition-colors">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white tracking-wide mb-6 uppercase text-sm border-l-2 border-industrial-orange pl-3">
              Office Details
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-industrial-orange shrink-0" />
                <span>
                  104, Industrial Estate Phase II,
                  Chennai, Tamil Nadu - 600032
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-industrial-orange shrink-0" />
                <a href="tel:+914422201900" className="hover:text-industrial-orange transition-colors">+91 44 2220 1900</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-industrial-orange shrink-0" />
                <a href="mailto:info@shreenivibuildtech.com" className="hover:text-industrial-orange transition-colors">info@shreenivibuildtech.com</a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-4 h-4 text-industrial-orange shrink-0" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-slate-900 dark:text-white tracking-wide uppercase text-sm border-l-2 border-industrial-orange pl-3">
              Newsletter
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
              Subscribe to get industrial trends, steel tips, and construction updates direct to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-sm outline-none focus:border-industrial-orange transition-colors dark:text-white"
                />
                <button
                  type="submit"
                  aria-label="Submit Newsletter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-industrial-orange hover:bg-industrial-orange-light text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <span className="text-xs text-green-500 font-semibold animate-pulse">
                  Subscribed successfully! Thank you.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-200 dark:border-white/5 pt-8 text-xs text-slate-500">
          <p>{activeCopyrightText}</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-industrial-orange">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-industrial-orange">Terms of Service</Link>
            <Link href="/admin" className="hover:text-industrial-orange">Local Admin Panel</Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-industrial-orange hover:bg-industrial-orange-light text-white shadow-3d-orange cursor-pointer transition-all active:translate-y-1"
        >
          <ArrowUp className="w-5 h-5 animate-pulse" />
        </button>
      )}
    </footer>
  );
}
