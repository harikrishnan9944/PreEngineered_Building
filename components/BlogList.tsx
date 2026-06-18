'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '@/types';
import GlowCard from '@/components/ui/GlowCard';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface BlogListProps {
  initialPosts: BlogPost[];
}

const CATEGORIES = ['All', 'Industrial Articles', 'Steel Tips', 'Construction News'];

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleSearchAndFilter = (term: string, cat: string) => {
    let filtered = initialPosts;

    if (cat !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    if (term.trim() !== '') {
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.summary.toLowerCase().includes(term.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(term.toLowerCase()))
      );
    }

    setPosts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearchAndFilter(term, activeCategory);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    handleSearchAndFilter(searchTerm, cat);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
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

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-250 dark:border-white/5 bg-white dark:bg-white/5 text-xs font-semibold outline-none focus:border-industrial-orange transition-colors dark:text-white"
          />
          <Search className="w-4 h-4 text-slate-405 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-450 border border-dashed border-slate-250 dark:border-white/5 rounded-3xl">
          No articles match your search parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="h-full"
            >
              <GlowCard className="overflow-hidden border border-slate-200 dark:border-white/5 h-full flex flex-col justify-between group">
                <div className="flex flex-col">
                  {/* Visual Category card mockup */}
                  <div className="aspect-[16/10] bg-slate-900 flex flex-col justify-center items-center text-center p-6 relative group-hover:scale-[1.01] transition-transform duration-500 overflow-hidden">
                    <div className="steel-texture absolute inset-0 opacity-10" />
                    <span className="text-3xl font-black text-white/5 tracking-wider select-none uppercase">
                      STEEL DATA
                    </span>
                    <span className="text-[10px] font-mono text-slate-455 mt-2 uppercase">
                      SHREE NIVI BUILDTECH
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="text-[9px] font-bold text-industrial-orange uppercase tracking-wider px-2 py-0.5 rounded bg-industrial-orange/15 border border-industrial-orange/20">
                        {post.category}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-industrial-orange" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block group-hover:text-industrial-orange transition-colors">
                      <h2 className="text-lg font-bold uppercase text-slate-900 dark:text-white mb-2 tracking-wide line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4 font-medium">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-industrial-orange/10 text-industrial-orange flex items-center justify-center text-[10px] font-bold border border-industrial-orange/20">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                      {post.author}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-industrial-orange flex items-center gap-1 group/btn"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
