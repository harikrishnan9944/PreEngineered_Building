import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { readJson } from '@/lib/fs';
import { HeroData, CompanyData, ServiceData } from '@/types';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Magnet from '@/components/animations/Magnet';
import GlowCard from '@/components/ui/GlowCard';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import { ArrowUpRight, CheckCircle, MapPin, Phone, Mail, Clock, Award, Shield, Building, Star, Quote } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const heroData = await readJson<HeroData>('hero.json', {
    title: "Engineering Tomorrow's Steel Structures",
    subtitle: "Delivering world-class Pre-Engineered Buildings, Warehouses, Industrial Sheds, Steel Fabrication and Structural Engineering Solutions with over 25+ years of excellence.",
    ctaText1: "Explore Projects",
    ctaLink1: "/projects",
    ctaText2: "Contact Us",
    ctaLink2: "/contact",
    videoUrl: "",
    imageUrl: "/images/peb-hero.png",
    stats: [
      { value: "25+", label: "Years Experience" },
      { value: "250+", label: "Ton Monthly Fabrication Capacity" },
      { value: "60+", label: "Projects Completed Every Year" },
      { value: "100%", label: "Customer Satisfaction" }
    ]
  });

  const companyData = await readJson<CompanyData>('company.json', {
    name: "Shree Nivi Buildtech",
    aboutTitle: "Engineered for Strength. Designed for Scale.",
    aboutStory: "Shree Nivi Buildtech is a leading industrial steel structural fabricator...",
  } as any);

  const services = await readJson<ServiceData[]>('services.json', []);
  const testimonials = await readJson<any[]>('testimonials.json', []);

  // Use all 6 services
  const homeServices = services.slice(0, 6);

  return (
    <div className="w-full relative overflow-hidden bg-white dark:bg-[#070c18] transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <Hero heroData={heroData} />

      {/* 2. SERVICES SECTION: Premium cards with real images and no icons */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-white/5 relative">
        <div className="animated-grid opacity-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              Our Core Services
            </h2>
            <div className="h-1 w-20 bg-industrial-orange mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeServices.map((service, i) => (
              <ScrollReveal key={service.id} variant="slide-up" delay={i * 0.05}>
                <GlowCard className="group overflow-hidden border border-slate-200 dark:border-white/5 hover:border-industrial-orange/30 rounded-2xl bg-white dark:bg-slate-900/40 shadow-lg hover:shadow-xl hover:shadow-industrial-orange/5 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    {/* Real image container with hover zoom */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/0 transition-colors" />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-8">
                      <h3 className="text-xl font-bold uppercase text-slate-900 dark:text-white mb-3 tracking-wide group-hover:text-industrial-orange transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed font-medium mb-6">
                        {service.description}
                      </p>

                      {/* Bullet points list */}
                      <ul className="flex flex-col gap-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-industrial-orange shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions / CTA Link */}
                  <div className="p-6 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <Link
                      href={`/services?service=${service.id}`}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-industrial-orange hover:text-white hover:border-industrial-orange transition-all duration-350 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Learn More Details
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION: Trust + Legacy stats */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-white/5 relative">
        <div className="animated-grid opacity-15" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Legacy trust text */}
            <ScrollReveal variant="slide-right" className="flex flex-col gap-6">
              <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest">
                Our Corporate Legacy
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white leading-tight">
                {companyData.aboutTitle}
              </h2>
              <div className="h-1 w-20 bg-industrial-orange rounded-full" />
              <p className="text-base text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                {companyData.aboutStory}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-md shrink-0">
                  <div className="p-3 bg-industrial-orange/10 text-industrial-orange rounded-xl border border-industrial-orange/20">
                    <Shield className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-slate-900 dark:text-white">100% Certified</h4>
                    <p className="text-xs text-slate-500">ISO 9001:2015 Structural Safety</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-md shrink-0">
                  <div className="p-3 bg-industrial-orange/10 text-industrial-orange rounded-xl border border-industrial-orange/20">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-slate-900 dark:text-white">In-house Fabrication</h4>
                    <p className="text-xs text-slate-500">200,000+ Sq. Ft. Automated Factory</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Premium stats highlight block */}
            <ScrollReveal variant="scale" className="relative">
              <div className="absolute -inset-4 border border-industrial-orange/20 rounded-3xl translate-x-2 translate-y-2 pointer-events-none" />
              
              <div className="bg-slate-900 dark:bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8 relative flex flex-col justify-center items-center text-center text-white min-h-[350px]">
                <div className="steel-texture absolute inset-0 opacity-10 pointer-events-none" />
                <Award className="w-16 h-16 text-industrial-orange mb-6" />
                
                <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-wider">
                  25 Years of Engineering Trust
                </h3>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-6 font-medium">
                  We maintain zero-incident site track records, and every steel member undergoes ultrasonic and radiography weld tests.
                </p>
                
                <div className="grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-6">
                  <div>
                    <span className="text-3xl font-black text-industrial-orange block">1,500+</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Structures Erected</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-industrial-orange block">45+</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Specialized Engineers</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. CLIENT REVIEWS SECTION: Premium testimonial showcase */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-white/5 relative">
          <div className="animated-grid opacity-15" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-3">
                Client Reviews
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
                What Our Clients Say
              </h2>
              <div className="h-1 w-20 bg-industrial-orange mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, i) => (
                <ScrollReveal key={testimonial.id || i} variant="slide-up" delay={i * 0.05}>
                  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-lg relative flex flex-col justify-between h-full">
                    <div className="absolute top-6 right-8 text-industrial-orange/10 dark:text-[#f97316]/5 pointer-events-none">
                      <Quote className="w-12 h-12 fill-current" />
                    </div>
                    
                    <div className="relative z-10">
                      {/* Stars rating */}
                      <div className="flex gap-1 mb-5 text-yellow-500">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic mb-6">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-5 border-t border-slate-100 dark:border-white/5">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover border border-industrial-orange/20 bg-slate-900"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-industrial-orange/15 text-industrial-orange flex items-center justify-center font-black text-xs border border-industrial-orange/20">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wide">
                          {testimonial.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {testimonial.role} <span className="text-industrial-orange font-bold">— {testimonial.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CONTACT SECTION: Simple Form + Map + Call Button */}
      <section className="py-24 bg-white dark:bg-[#070c18] relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-3">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              Start Your Project Consultation
            </h2>
            <div className="h-1 w-20 bg-industrial-orange mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Part: Contact Info, Map, Call Button (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              <div className="flex flex-col gap-6">
                <h3 className="text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                  Corporate Office Contact Details
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Feel free to contact us for structural estimations, layout designs, feasibility reports, and pricing sheet consultations.
                </p>
              </div>

              {/* Call Us Magnet CTA Button */}
              <Magnet>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-3 px-8 py-5 bg-industrial-orange hover:bg-industrial-orange-light text-white font-bold rounded-2xl text-base shadow-3d-orange transition-all hover:scale-[1.03] active:translate-y-1"
                >
                  <Phone className="w-5 h-5 animate-bounce" />
                  Call Our Engineers Now
                </a>
              </Magnet>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 flex gap-4">
                  <Mail className="w-6 h-6 text-industrial-orange shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-500">Email Address</h4>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-300 mt-1">inquiry@shreenivi.com</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 flex gap-4">
                  <Clock className="w-6 h-6 text-industrial-orange shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs uppercase text-slate-500">Business Hours</h4>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-300 mt-1">Mon - Sat: 9am - 6pm</p>
                  </div>
                </div>
              </div>

              {/* High Trust Map Iframe */}
              <div className="w-full h-[280px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 relative bg-slate-100 shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.840742186835!2d80.20165997576579!3d13.04581451325608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266e7b165b4c1%3A0x8673a5a4a5b4c10!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-none opacity-85 hover:opacity-100 transition-opacity"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right Part: Simple Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900/35 border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white tracking-wider mb-6">
                Send Project Inquiry
              </h3>
              <Suspense fallback={<div className="py-12 text-center text-xs text-slate-400 font-mono">Loading form...</div>}>
                <ContactForm />
              </Suspense>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
