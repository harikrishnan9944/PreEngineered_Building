import React from 'react';
import { readJson } from '@/lib/fs';
import { GalleryItem } from '@/types';
import GalleryContainer from '@/components/GalleryContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Photo Gallery',
  description: 'View real-world snapshots of our pre-engineered building structures, automated steel fabrication workshops, and construction site erections.',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const galleryItems = await readJson<GalleryItem[]>('gallery.json', []);

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'Gallery' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-205 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Site Snapshots
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Photo Gallery
          </h1>
        </div>

        {/* Client Gallery Container (Pinterest Masonry & Lightbox) */}
        <GalleryContainer initialItems={galleryItems} />
      </div>
    </div>
  );
}
