import React from 'react';
import { readJson } from '@/lib/fs';
import { JobListing } from '@/types';
import CareersContainer from '@/components/CareersContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Careers & Jobs',
  description: 'Join Shree Nivi Buildtech as a structural engineer, PEB designer, or site project coordinator. View openings and apply locally.',
};

export default async function Page() {
  const jobs = await readJson<JobListing[]>('careers.json', []);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Careers' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-205 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Work With Us
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Join the Team
          </h1>
        </div>

        {/* Careers container */}
        <CareersContainer initialJobs={jobs} />
      </div>
    </div>
  );
}
