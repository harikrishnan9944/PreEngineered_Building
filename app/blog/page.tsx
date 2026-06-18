import React from 'react';
import { readJson } from '@/lib/fs';
import { BlogPost } from '@/types';
import BlogList from '@/components/BlogList';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Industrial Blog & Steel Tips',
  description: 'Read construction industry reports, steel building maintenance tips, and sustainable green structural news from Shree Nivi Buildtech.',
};

export default async function Page() {
  const posts = await readJson<BlogPost[]>('blogs.json', []);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-205 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Knowledge Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Articles & Updates
          </h1>
        </div>

        {/* Client side Blog list filtering */}
        <BlogList initialPosts={posts} />
      </div>
    </div>
  );
}
