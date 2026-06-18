'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobListing } from '@/types';
import GlowCard from '@/components/ui/GlowCard';
import { Briefcase, MapPin, Calendar, FileText, CheckCircle2, Upload, AlertCircle, Check, X, Search } from 'lucide-react';

interface CareersContainerProps {
  initialJobs: JobListing[];
}

export default function CareersContainer({ initialJobs }: CareersContainerProps) {
  const [jobs] = useState<JobListing[]>(initialJobs);
  const [activeJob, setActiveJob] = useState<JobListing | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) {
      setErrorMsg('No active job selection found.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const apiFormData = new FormData();
      apiFormData.append('name', formData.name);
      apiFormData.append('email', formData.email);
      apiFormData.append('phone', formData.phone);
      apiFormData.append('position', activeJob.title);
      apiFormData.append('coverLetter', formData.coverLetter);
      if (resumeFile) {
        apiFormData.append('resume', resumeFile);
      }

      const res = await fetch('/api/careers', {
        method: 'POST',
        body: apiFormData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setStatus('success');
      setToastMessage(`Application for ${activeJob.title} submitted successfully!`);
      setShowToast(true);
      
      // Reset form fields
      setFormData({ name: '', email: '', phone: '', coverLetter: '' });
      setResumeFile(null);
      
      // Auto-dismiss toast after 5s
      setTimeout(() => {
        setShowToast(false);
      }, 5000);

      // Close modal after success prompt
      setTimeout(() => {
        setStatus('idle');
        setActiveJob(null);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during submission. Please try again.');
      setStatus('error');
    }
  };

  const categories = ['All', 'IT', 'Marketing', 'Design', 'HR'];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      job.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-industrial-gray/50 border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-lg overflow-hidden animate-pulse flex flex-col h-[480px]">
      <div className="h-48 bg-slate-200 dark:bg-white/5 w-full" />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-3">
          <div className="h-3.5 bg-slate-200 dark:bg-white/5 w-1/4 rounded" />
          <div className="h-6 bg-slate-200 dark:bg-white/5 w-3/4 rounded" />
          <div className="h-4 bg-slate-200 dark:bg-white/5 w-1/2 rounded" />
          <div className="h-4 bg-slate-200 dark:bg-white/5 w-full rounded mt-2" />
          <div className="h-4 bg-slate-200 dark:bg-white/5 w-5/6 rounded" />
        </div>
        <div className="h-10 bg-slate-200 dark:bg-white/5 w-full rounded-xl mt-6" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full relative">
      {/* Search and Filters Segment */}
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mb-6 relative z-10">
        {/* Search Input */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for positions, skills, or departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-all shadow-md focus:shadow-lg focus:shadow-industrial-orange/5 font-semibold text-sm"
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-industrial-orange transition-colors" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer z-10 ${
                selectedCategory === category
                  ? 'text-white font-bold'
                  : 'bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-industrial-orange/50 dark:hover:border-industrial-orange/50'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full bg-industrial-orange z-[-1] shadow-3d-orange"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Skeletons/Results */}
      {isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 flex flex-col items-center gap-4 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/5 p-8"
        >
          <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
            <Briefcase className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wider">No Positions Found</h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 max-w-sm leading-relaxed">
            We couldn't find any job openings matching your search query or selected filter. Try searching for other terms or check back soon!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-5 py-2 bg-industrial-orange hover:bg-industrial-orange-light text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-md cursor-pointer transition-colors"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
        >
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative flex flex-col h-[480px] bg-white/70 dark:bg-industrial-gray/60 backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Card Image and Badge */}
              <div className="relative h-48 overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-white/5">
                {job.badge && (
                  <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-full shadow-md text-white ${
                    job.badge === 'Urgent Hiring'
                      ? 'bg-red-500'
                      : job.badge === 'Remote'
                      ? 'bg-blue-500'
                      : 'bg-green-600'
                  }`}>
                    {job.badge}
                  </span>
                )}
                <img
                  src={job.image || '/images/peb-hero.png'}
                  alt={job.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-80" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-industrial-orange uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="text-[10px] font-mono text-slate-450 dark:text-slate-400">
                      EXP: {job.experience}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-industrial-orange transition-colors uppercase leading-tight line-clamp-2 min-h-[44px]">
                    {job.title}
                  </h3>

                  {/* Metadata labels */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold my-1 border-t border-b border-slate-100 dark:border-white/5 py-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-industrial-orange shrink-0" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-industrial-orange shrink-0" />
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 leading-relaxed mt-1.5 font-medium">
                    {job.description}
                  </p>
                </div>

                <button
                  onClick={() => setActiveJob(job)}
                  className="w-full mt-4 py-2.5 bg-slate-950 dark:bg-white/5 text-white dark:text-slate-300 group-hover:bg-industrial-orange group-hover:text-white group-hover:shadow-3d-orange font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Application Form Drawer Modal */}
      <AnimatePresence>
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => { if (status !== 'loading') setActiveJob(null); }}
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-industrial-gray rounded-3xl border border-slate-200 dark:border-white/8 shadow-2xl p-6 md:p-8 overflow-hidden z-10"
            >
              <div className="steel-texture absolute inset-0 opacity-5 pointer-events-none rounded-3xl" />
              
              {/* Close button */}
              <button
                onClick={() => setActiveJob(null)}
                disabled={status === 'loading'}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-450 hover:bg-industrial-orange hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <div className="mb-6">
                  <span className="text-[10px] font-mono font-bold text-industrial-orange uppercase tracking-widest block mb-1">
                    CANDIDATE PORTAL
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white leading-tight">
                    Apply: {activeJob.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1 uppercase">
                    {activeJob.department} · {activeJob.location}
                  </p>
                </div>

                {status === 'success' ? (
                  <div className="py-10 text-center flex flex-col items-center gap-4 text-green-500">
                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/30">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h4 className="font-bold text-lg uppercase tracking-wide">Application Submitted!</h4>
                    <p className="text-xs text-slate-450 max-w-xs leading-relaxed font-semibold">
                      Your files have been saved locally in the database. Our HR department will review your application soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm font-semibold">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={status === 'loading'}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={status === 'loading'}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        placeholder="e.g. +91 98765 43210"
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Cover Letter Summary</label>
                      <textarea
                        name="coverLetter"
                        rows={3}
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        placeholder="Briefly state why you fit this role..."
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    {/* File Upload box */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">Attach Resume (PDF/Word) (Optional)</label>
                      <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-4 text-center hover:border-industrial-orange transition-all">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={status === 'loading'}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-1.5">
                          <Upload className="w-6 h-6 text-industrial-orange animate-pulse" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {resumeFile ? resumeFile.name : 'Click or drag file here to upload'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Max size: 5MB (PDF/DOCX)</span>
                        </div>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-200 dark:border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveJob(null)}
                        disabled={status === 'loading'}
                        className="px-5 py-2.5 rounded-xl border border-slate-205 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-6 py-2.5 bg-industrial-orange hover:bg-industrial-orange-light text-white text-xs font-bold rounded-xl shadow-3d-orange flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {status === 'loading' ? 'Submitting Application...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-250"
          >
            <div className="p-1.5 bg-green-500 rounded-full text-white">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-green-500">Success</p>
              <p className="text-xs font-semibold text-slate-200 dark:text-slate-800">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 p-1 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-400 dark:text-slate-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
