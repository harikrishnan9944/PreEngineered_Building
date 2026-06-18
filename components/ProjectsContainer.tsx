'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectData } from '@/types';
import GlowCard from '@/components/ui/GlowCard';
import { MapPin, Calendar, User, Check, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProjectsContainerProps {
  initialProjects: ProjectData[];
}

const CATEGORIES = [
  'All',
  'Factory',
  'Warehouse',
  'Textile',
  'Logistics',
  'Cold Storage',
  'Automobile',
  'Industrial',
];

export default function ProjectsContainer({ initialProjects }: ProjectsContainerProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const filteredProjects = activeCategory === 'All'
    ? initialProjects
    : initialProjects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const handleOpenProject = (project: ProjectData) => {
    setActiveProject(project);
    setActiveImageIdx(0);
  };

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
                  : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-350 hover:border-industrial-orange/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Masonry-like projects grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-450 border border-dashed border-slate-250 dark:border-white/5 rounded-3xl">
          No projects found in this category.
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <GlowCard
                  onClick={() => handleOpenProject(project)}
                  className="overflow-hidden border border-slate-200 dark:border-white/5 h-full flex flex-col justify-between group"
                >
                  <div className="flex flex-col">
                    {/* Project Hero Image Placeholder/Visual */}
                    <div className="aspect-[16/10] bg-slate-900 flex flex-col justify-center items-center text-center p-6 relative group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                      <div className="steel-texture absolute inset-0 opacity-10" />
                      <span className="text-3xl font-black text-white/5 tracking-wider select-none uppercase mb-2">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {project.client}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-industrial-orange uppercase tracking-wider px-2 py-0.5 rounded bg-industrial-orange/15 border border-industrial-orange/20">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-industrial-orange" />
                          {project.location.split(',')[0]}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold uppercase text-slate-900 dark:text-white mb-2 tracking-wide group-hover:text-industrial-orange transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-white/5 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span>YEAR: {project.completionYear}</span>
                    <span className="text-industrial-orange font-bold hover:underline cursor-pointer flex items-center gap-1">
                      View details →
                    </span>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Lightbox Gallery Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveProject(null)}
            />

            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-industrial-gray rounded-3xl border border-slate-200 dark:border-white/8 shadow-2xl overflow-hidden z-10 flex flex-col lg:flex-row max-h-[85vh]"
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-450 hover:bg-industrial-orange hover:text-white transition-colors z-25 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Visual Mockup representation / Gallery slides */}
              <div className="lg:w-1/2 bg-slate-900 relative flex flex-col items-center justify-center min-h-[300px] lg:min-h-0 p-8">
                <div className="steel-texture absolute inset-0 opacity-15 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />

                <div className="relative z-10 text-center flex flex-col items-center gap-3">
                  <span className="px-3 py-1 bg-industrial-orange text-white rounded text-xs font-bold tracking-widest uppercase">
                    {activeProject.category}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-white tracking-wide max-w-xs leading-snug">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    Slide {activeImageIdx + 1} of {activeProject.gallery?.length || 1}
                  </p>
                </div>

                {/* Simulated interactive image slider preview controls */}
                {activeProject.gallery && activeProject.gallery.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev - 1 + activeProject.gallery.length) % activeProject.gallery.length)}
                      className="p-2 bg-slate-950/80 hover:bg-industrial-orange rounded-full border border-white/10 text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx(prev => (prev + 1) % activeProject.gallery.length)}
                      className="p-2 bg-slate-950/80 hover:bg-industrial-orange rounded-full border border-white/10 text-white transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Project Details */}
              <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block mb-1">
                    PROJECT SUMMARY
                  </span>
                  <h3 className="text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-white leading-tight">
                    {activeProject.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  {activeProject.description}
                </p>

                {/* Client / Location specs list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-200 dark:border-white/5 py-4 my-2 text-xs font-semibold">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-normal uppercase text-[9px] tracking-widest">Client</span>
                    <span className="text-slate-900 dark:text-white flex items-center gap-1.5 font-bold">
                      <User className="w-3.5 h-3.5 text-industrial-orange" />
                      {activeProject.client.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-normal uppercase text-[9px] tracking-widest">Location</span>
                    <span className="text-slate-900 dark:text-white flex items-center gap-1.5 font-bold truncate">
                      <MapPin className="w-3.5 h-3.5 text-industrial-orange" />
                      {activeProject.location.split(',')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-normal uppercase text-[9px] tracking-widest">Completion</span>
                    <span className="text-slate-900 dark:text-white flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-industrial-orange" />
                      {activeProject.completionYear}
                    </span>
                  </div>
                </div>

                {/* Features list */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white tracking-wide uppercase text-xs mb-3 border-l-2 border-industrial-orange pl-2">
                    Scope of Construction
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-405 font-bold">
                    {activeProject.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-industrial-orange shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
