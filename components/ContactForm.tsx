'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    serviceInterest: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill service interest if passed in URL query
  useEffect(() => {
    const service = searchParams.get('service');
    if (service) {
      setFormData(prev => ({
        ...prev,
        serviceInterest: service,
        subject: `Inquiry regarding ${service}`,
      }));
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        serviceInterest: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full">
      {status === 'success' ? (
        <div className="p-8 text-center flex flex-col items-center gap-4 text-green-500 bg-green-500/5 border border-green-500/10 rounded-2xl">
          <CheckCircle2 className="w-12 h-12" />
          <h3 className="font-bold text-lg uppercase tracking-wider">Inquiry Received!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-xs leading-relaxed">
            Thank you for contacting Shree Nivi Buildtech. Your query has been logged locally, and our project estimators will get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-650 dark:text-slate-400 uppercase tracking-wider">Your Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                placeholder="e.g. John Doe"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-655 dark:text-slate-400 uppercase tracking-wider">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                placeholder="e.g. name@company.com"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-650 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                placeholder="e.g. +91 98765 43210"
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-655 dark:text-slate-400 uppercase tracking-wider">Service of Interest</label>
              <select
                name="serviceInterest"
                value={formData.serviceInterest}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-colors cursor-pointer"
              >
                <option value="">Select a service (Optional)</option>
                <option value="Residential Construction">Residential Construction</option>
                <option value="Commercial Buildings">Commercial Buildings</option>
                <option value="Industrial Projects">Industrial Projects</option>
                <option value="Interior Works">Interior Works</option>
                <option value="Renovation Services">Renovation Services</option>
                <option value="Architecture Design">Architecture Design</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-650 dark:text-slate-400 uppercase tracking-wider">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              placeholder="e.g. Design estimate for steel shed"
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-650 dark:text-slate-400 uppercase tracking-wider">Project Specification / message *</label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              placeholder="Provide building dimension (Width x Length x Height), crane capacity load specification, or general message details..."
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 outline-none focus:border-industrial-orange text-slate-900 dark:text-white resize-none transition-colors"
            />
          </div>

          {status === 'error' && (
            <div className="p-3.5 bg-red-500/10 rounded-xl border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 bg-industrial-orange hover:bg-industrial-orange-light text-white font-bold rounded-xl shadow-3d-orange transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:translate-y-0.5"
          >
            {status === 'loading' ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
