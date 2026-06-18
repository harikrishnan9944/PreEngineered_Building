'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceData } from '@/types';
import GlowCard from '@/components/ui/GlowCard';
import Icon from '@/components/Icon';
import { Search, X, CheckCircle, ArrowRight, ArrowUpRight } from 'lucide-react';

interface ServicesContainerProps {
  initialServices: ServiceData[];
}

export default function ServicesContainer({ initialServices }: ServicesContainerProps) {
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeService, setActiveService] = useState<ServiceData | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setServices(initialServices);
    } else {
      const filtered = initialServices.filter(
        (s) =>
          s.title.toLowerCase().includes(term.toLowerCase()) ||
          s.description.toLowerCase().includes(term.toLowerCase())
      );
      setServices(filtered);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Search Bar */}
      <div className="relative max-w-md w-full mx-auto">
        <input
          type="text"
          placeholder="Search 14 premium services..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-md text-sm outline-none focus:border-industrial-orange transition-all dark:text-white"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Grid of Cards */}
      {services.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-450 border border-dashed border-slate-250 dark:border-white/5 rounded-3xl">
          No services match your search query. Try typing another term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="h-full"
            >
              <GlowCard className="p-8 border border-slate-200 dark:border-white/5 h-full flex flex-col justify-between group">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-900 dark:text-white group-hover:bg-industrial-orange group-hover:text-white transition-all shadow-sm">
                      <Icon name={service.icon} className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest">
                      REF-{service.id.toUpperCase().slice(0, 3)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-3 group-hover:text-industrial-orange transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-8 flex flex-col gap-4">
                  <ul className="flex flex-col gap-2">
                    {service.features.slice(0, 2).map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-industrial-orange shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setActiveService(service)}
                    className="w-full py-2.5 rounded-lg border border-slate-250 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Read More
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detailed Lightbox Drawer Modal */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveService(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-industrial-gray rounded-3xl border border-slate-200 dark:border-white/8 shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              <div className="steel-texture absolute inset-0 opacity-5 pointer-events-none rounded-3xl" />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-450 hover:bg-industrial-orange hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-industrial-orange/15 text-industrial-orange rounded-xl border border-industrial-orange/20">
                    <Icon name={activeService.icon} className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-white">
                      {activeService.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      SERVICE SPECIFICATION
                    </span>
                  </div>
                </div>

                <div className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed font-medium">
                  {activeService.details}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white tracking-wide uppercase text-xs mb-3 border-l-2 border-industrial-orange pl-2">
                    Key Features & Technical Specs
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {activeService.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-industrial-orange shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-200 dark:border-white/5 pt-6 mt-4 flex items-center justify-end gap-4">
                  <button
                    onClick={() => setActiveService(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Close Specifications
                  </button>
                  <Link
                    href={`/contact?service=${encodeURIComponent(activeService.title)}`}
                    className="px-5 py-2.5 bg-industrial-orange hover:bg-industrial-orange-light text-white text-xs font-bold rounded-xl shadow-3d-orange flex items-center gap-1.5 transition-all"
                  >
                    Inquire Now
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
