import React, { Suspense } from 'react';
import ContactForm from '@/components/ContactForm';
import GlowCard from '@/components/ui/GlowCard';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Engineering Team',
  description: 'Get in touch with Shree Nivi Buildtech. Call, email, or chat with us on WhatsApp for PEB and steel structure calculations.',
};

export default function Page() {
  return (
    <div className="w-full relative overflow-hidden py-12">
      {/* Background CAD Grids */}
      <div className="animated-grid opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Banner Title */}
        <div className="border-b border-slate-200 dark:border-white/5 pb-8 mb-16 text-center lg:text-left">
          <span className="text-sm font-bold text-industrial-orange uppercase tracking-widest block mb-2">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <ScrollReveal variant="slide-right" className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-905 dark:text-white">
                Corporate Headquarters
              </h2>
              <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                Visit our office or get in touch through our direct channels. Our engineers are ready to assist with design and price details.
              </p>
            </ScrollReveal>

            {/* Communication Details List */}
            <ScrollReveal variant="slide-right" delay={0.1}>
              <div className="flex flex-col gap-4">
                <GlowCard className="p-5 border border-slate-200 dark:border-white/5 flex gap-4">
                  <div className="p-3 bg-industrial-orange/10 text-industrial-orange rounded-xl border border-industrial-orange/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Office Address</h3>
                    <p className="text-sm text-slate-800 dark:text-white font-bold leading-relaxed">
                      104, Industrial Estate Phase II, <br />
                      Guindy, Chennai, Tamil Nadu - 600032
                    </p>
                  </div>
                </GlowCard>

                <GlowCard className="p-5 border border-slate-205 dark:border-white/5 flex gap-4">
                  <div className="p-3 bg-industrial-orange/10 text-industrial-orange rounded-xl border border-industrial-orange/20 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Working Hours</h3>
                    <p className="text-sm text-slate-800 dark:text-white font-bold">
                      Mon - Sat: 9:00 AM - 6:00 PM <br />
                      <span className="text-industrial-orange text-xs">Sunday: Holiday</span>
                    </p>
                  </div>
                </GlowCard>
              </div>
            </ScrollReveal>

            {/* Direct click to Call Buttons */}
            <ScrollReveal variant="slide-right" delay={0.2} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:+914422201900"
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 border border-white/5 text-white text-xs font-bold uppercase rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Phone className="w-4 h-4 text-industrial-orange" />
                Call Now
              </a>

              <a
                href="mailto:info@shreenivibuildtech.com"
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 border border-white/5 text-white text-xs font-bold uppercase rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Mail className="w-4 h-4 text-industrial-orange" />
                Email Us
              </a>

              <a
                href="https://wa.me/914422201900"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-650 hover:bg-green-600 border border-green-650/10 text-white text-xs font-bold uppercase rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                WhatsApp
              </a>
            </ScrollReveal>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slide-left" delay={0.1}>
              <GlowCard className="p-6 md:p-8 border border-slate-200 dark:border-white/5 relative">
                <div className="steel-texture absolute inset-0 opacity-5 pointer-events-none rounded-2xl" />
                <div className="mb-6 relative z-10">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                    PROJECT ESTIMATOR
                  </span>
                  <h2 className="text-xl md:text-2xl font-black uppercase text-slate-900 dark:text-white">
                    Request Quote & Design Consult
                  </h2>
                </div>
                <Suspense fallback={<div className="text-center py-10 font-mono text-xs text-slate-500">Loading Form...</div>}>
                  <ContactForm />
                </Suspense>
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>

        {/* SECTION 3: GOOGLE MAP EMBED */}
        <ScrollReveal variant="slide-up" delay={0.2} className="w-full h-[400px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-lg relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.234674391629!2d80.20790831525946!3d12.988888790844784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526760df768f51%3A0xc34dbd5351a029cf!2sGuindy%20Industrial%20Estate%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1655555555555!5m2!1sen!2sin"
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Guindy Industrial Estate map location"
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
