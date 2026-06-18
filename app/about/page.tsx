import React from 'react';
import { readJson } from '@/lib/fs';
import { CompanyData } from '@/types';
import ScrollReveal from '@/components/animations/ScrollReveal';
import GlowCard from '@/components/ui/GlowCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Shield, Eye, Flame, Award, Building, UserCheck } from 'lucide-react';

export default async function Page() {
  const companyData = await readJson<CompanyData>('company.json', {
    name: "Shree Nivi Buildtech",
    logoText: "SHREE NIVI BUILDTECH",
    aboutTitle: "Engineered for Strength. Designed for Scale.",
    aboutStory: "Shree Nivi Buildtech is a leading industrial steel structural fabricator...",
    mdName: "K. N. Viswanathan",
    mdTitle: "Founder & Managing Director",
    mdMessage: "At Shree Nivi Buildtech, we believe steel is the skeleton of our country's economic future...",
    mdImage: "/images/md.jpg",
    mission: "To design, manufacture, and erect the safest, most durable steel structures...",
    vision: "To lead the global transition toward smart, rapid-build steel infrastructure...",
    coreValues: [],
    journeyTimeline: []
  });

  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* CAD Grid Overlay */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumb Trail */}
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Banner Title */}
        <div className="border-b border-slate-200 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">

          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Company Overview
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            About Shree Nivi
          </h1>
        </div>

        {/* Company Story & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <ScrollReveal variant="slide-right" className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wide text-slate-900 dark:text-white">
              {companyData.aboutTitle}
            </h2>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              {companyData.aboutStory}
            </p>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl">
                <span className="text-2xl font-black text-industrial-orange block">1,500+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Projects Completed</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl">
                <span className="text-2xl font-black text-industrial-orange block">25+</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Years of Trust</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="scale" className="relative">
            <div className="absolute -inset-4 border border-industrial-orange/30 rounded-3xl translate-x-2 translate-y-2 pointer-events-none" />
            <div className="bg-slate-950/65 rounded-3xl overflow-hidden aspect-[4/3] flex flex-col justify-center items-center text-center p-8 border border-slate-200 dark:border-white/5 relative">
              <div className="steel-texture absolute inset-0 opacity-10 pointer-events-none" />
              <Building className="w-16 h-16 text-industrial-orange mb-4" />
              <h3 className="text-xl font-bold uppercase text-white mb-2">Our Manufacturing Hub</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Spanning over 200,000 Sq. Ft. of state-of-the-art automated workshops located in prime industrial corridors.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* MD message section */}
        <section className="mb-28 bg-slate-50 dark:bg-slate-950/40 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/5 relative">
          <div className="steel-texture absolute inset-0 opacity-10 rounded-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start gap-4">
              <div className="w-24 h-24 rounded-full bg-industrial-orange/15 text-industrial-orange flex items-center justify-center text-3xl font-black border border-industrial-orange/30">
                {companyData.mdName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                  {companyData.mdName}
                </h3>
                <p className="text-xs font-bold text-industrial-orange uppercase tracking-widest">
                  {companyData.mdTitle}
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-8 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/5 pt-8 lg:pt-0 lg:pl-10">
              <span className="text-sm font-mono text-slate-400 uppercase tracking-widest block mb-3">
                Managing Director's Statement
              </span>
              <blockquote className="text-base md:text-lg italic leading-relaxed text-slate-700 dark:text-slate-350 font-medium">
                "{companyData.mdMessage}"
              </blockquote>
            </div>
          </div>
        </section>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          <ScrollReveal variant="slide-up">
            <GlowCard className="p-8 border border-slate-200 dark:border-white/5 h-full flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-industrial-orange/10 text-industrial-orange flex items-center justify-center border border-industrial-orange/20 shadow-sm shrink-0">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-2">Our Mission</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                  {companyData.mission}
                </p>
              </div>
            </GlowCard>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.1}>
            <GlowCard className="p-8 border border-slate-200 dark:border-white/5 h-full flex flex-col gap-5">
              <div className="w-12 h-12 rounded-xl bg-industrial-orange/10 text-industrial-orange flex items-center justify-center border border-industrial-orange/20 shadow-sm shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900 dark:text-white mb-2">Our Vision</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                  {companyData.vision}
                </p>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>

        {/* Core Values grid */}
        {companyData.coreValues.length > 0 && (
          <div className="mb-28">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
                Ethical Benchmarks
              </span>
              <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white">
                Our Core Values
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyData.coreValues.map((value, i) => (
                <ScrollReveal key={i} variant="scale" delay={i * 0.1}>
                  <GlowCard className="p-6 border border-slate-200 dark:border-white/5 h-full flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-lg bg-industrial-orange/10 text-industrial-orange flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white tracking-wide uppercase mb-1.5">{value.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{value.description}</p>
                    </div>
                  </GlowCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Company Journey Milestones Timeline */}
        {companyData.journeyTimeline.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
                25 Year Legacy
              </span>
              <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white">
                Our Company Journey
              </h2>
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-white/5 pl-8 max-w-4xl mx-auto flex flex-col gap-12">
              {companyData.journeyTimeline.map((item, i) => (
                <ScrollReveal key={i} variant="slide-up" className="relative group">
                  {/* Timeline bullet tag */}
                  <span className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#08090d] bg-industrial-orange scale-100 group-hover:scale-120 transition-transform duration-300 shadow-md shadow-industrial-orange/50" />
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl font-mono font-black text-industrial-orange">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-555 dark:text-slate-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
