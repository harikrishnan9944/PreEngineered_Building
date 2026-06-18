'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryItem } from '@/types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryContainerProps {
  initialItems: GalleryItem[];
}

const CATEGORIES = ['All', 'Fabrication', 'Erection', 'Warehouse', 'Factory'];

export default function GalleryContainer({ initialItems }: GalleryContainerProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  const filteredItems = activeCategory === 'All'
    ? initialItems
    : initialItems.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      setActiveImageIdx(idx);
    }
  };

  const handlePrev = () => {
    if (activeImageIdx !== null) {
      setActiveImageIdx(prev => (prev! - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = () => {
    if (activeImageIdx !== null) {
      setActiveImageIdx(prev => (prev! + 1) % filteredItems.length);
    }
  };

  const activeItem = activeImageIdx !== null ? filteredItems[activeImageIdx] : null;

  return (
    <div className="flex flex-col gap-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? 'bg-industrial-orange text-white shadow-3d-orange'
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-355 hover:border-industrial-orange/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Pinterest Masonry Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-450 border border-dashed border-slate-250 dark:border-white/5 rounded-3xl">
          No gallery images found in this category.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/5 cursor-pointer group shadow-md"
            >
              {/* Simulated high-quality industrial layout */}
              <div className="w-full flex flex-col justify-center items-center p-8 min-h-[160px] text-center relative group-hover:scale-[1.01] transition-transform duration-500">
                <div className="steel-texture absolute inset-0 opacity-10" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider max-w-[180px]">
                  {item.title}
                </h3>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-3 bg-industrial-orange rounded-xl text-white shadow-3d-orange transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveImageIdx(null)}
            />

            {/* Close Button */}
            <button
              onClick={() => setActiveImageIdx(null)}
              className="absolute top-6 right-6 p-3 rounded-xl bg-white/10 text-white hover:bg-industrial-orange hover:text-white transition-all z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Slider panel */}
            <div className="relative w-full max-w-4xl max-h-[70vh] aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 z-10 flex flex-col justify-center items-center text-center p-10">
              <div className="steel-texture absolute inset-0 opacity-15" />
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                <span className="px-3 py-1 bg-industrial-orange text-white text-[10px] font-bold tracking-widest uppercase rounded">
                  {activeItem.category}
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-wider max-w-md">
                  {activeItem.title}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Image {activeImageIdx! + 1} of {filteredItems.length}
                </p>
              </div>

              {/* Slider Left Trigger */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 p-3 bg-white/5 hover:bg-industrial-orange rounded-xl text-white transition-all cursor-pointer z-20 border border-white/5"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slider Right Trigger */}
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 p-3 bg-white/5 hover:bg-industrial-orange rounded-xl text-white transition-all cursor-pointer z-20 border border-white/5"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom details label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center mt-6 text-white"
            >
              <h4 className="text-lg font-bold uppercase tracking-wider">{activeItem.title}</h4>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{activeItem.category} Section</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
