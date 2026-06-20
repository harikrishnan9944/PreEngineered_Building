'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Key, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Client-side session check (avoid loading page if already logged in)
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (res.ok) {
          router.replace('/admin/dashboard');
        }
      } catch (err) {
        // Not logged in, stay on page
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Success - redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background CAD Grids & Glowing Orbs */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),rgba(255,255,255,0))]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        {/* Animated grid overlay */}
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#f97316] mb-4 shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Shree Nivi Buildtech
          </h1>
          <p className="text-xs text-[#cbd5e1] font-semibold uppercase tracking-widest mt-1.5 opacity-80">
            Control Management Console
          </p>
        </div>

        {/* Login Box (Glassmorphism) */}
        <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-[#334155] rounded-[16px] p-8 shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[16px]" />
          
          <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-[#334155] pb-3">
            Secure Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-semibold">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#cbd5e1] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="admin@shreenivibuildtech.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-[12px] border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white transition-all font-mono text-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#cbd5e1] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-[12px] border border-[#334155] bg-[#0f172a]/70 outline-none focus:border-[#f97316] text-white transition-all font-mono text-xs placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-500/10 rounded-[12px] border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold rounded-[12px] shadow-lg shadow-orange-500/20 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-[10px] text-slate-500 font-mono">
          SHREE NIVI BUILDTECH ADMIN CONSOLE SYSTEM v1.0.0<br />
          SECURED VIA 256-BIT ENCRYPTION & COOKIE TOKEN SESSIONS
        </div>
      </div>
    </div>
  );
}
