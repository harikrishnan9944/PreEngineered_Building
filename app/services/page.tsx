import React from 'react';
import { readJson } from '@/lib/fs';
import { ServiceData } from '@/types';
import ServicesContainer from '@/components/ServicesContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Engineering Services',
  description: 'Explore our premium industrial services including Pre-Engineered Buildings, Structural Steel, Warehouse Construction, and Heavy Fabrication.',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const services = await readJson<ServiceData[]>('services.json', []);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Services' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-205 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            What We Do
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Industrial Capabilities
          </h1>
        </div>

        {/* Client Services Container (Interactive searches & modals) */}
        <ServicesContainer initialServices={services} />
      </div>
    </div>
  );
}
