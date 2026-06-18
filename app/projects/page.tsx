import React from 'react';
import { readJson } from '@/lib/fs';
import { ProjectData } from '@/types';
import ProjectsContainer from '@/components/ProjectsContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Industrial Projects',
  description: 'Explore our completed portfolio of factory structures, storage warehouses, clean rooms, cold storage chambers, and heavy engineering buildings.',
};

export default async function Page() {
  const projects = await readJson<ProjectData[]>('projects.json', []);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-205 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Our Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Completed Projects
          </h1>
        </div>

        {/* Client Projects Container (Interactive filtering & modals) */}
        <ProjectsContainer initialProjects={projects} />
      </div>
    </div>
  );
}
