'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Link, AtSign, Camera, Mail, Send, CheckCircle2, AlertCircle, Phone, Terminal } from 'lucide-react';
import { socials } from '@/config/socials.config';
import { siteConfig } from '@/config/site.config';
import type { ContactFormState } from '@/types';
import { GlitchText } from '../hero/GlitchText';

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<ContactFormState>({ status: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: 'loading' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 500) {
          window.location.href = `mailto:${siteConfig.email}?subject=Message from ${formData.name}&body=${encodeURIComponent(formData.message)}`;
        }
        setState({ status: 'error', message: data.error ?? 'Something went wrong.' });
        return;
      }

      setState({ status: 'success', message: 'Transmission sent! Connection established.' });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      window.location.href = `mailto:${siteConfig.email}?subject=Message from ${formData.name}&body=${encodeURIComponent(formData.message)}`;
      setState({ status: 'error', message: 'Network offline. Fallback mail client opened.' });
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-24 bg-transparent" aria-label="Contact Section">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-section-label tracking-[0.3em] mb-4 text-blue-500">CHAMBER_07 // EXIT</p>
            <h2 className="text-display font-display text-white font-bold select-none mb-4">
              <GlitchText text="CONTACT FINALE" />
            </h2>
            <p className="mt-4 max-w-xl mx-auto font-mono text-xs text-[#a0a0b0]">
              The drone projects its final communications interface card. Send a message to register logs.
            </p>
          </motion.div>

          {/* Holographic Visiting Card Container */}
          <motion.div
            className="glass-heavy p-8 md:p-12 rounded-xl border border-blue-500/20 glow-primary relative overflow-hidden mb-16"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* HUD elements */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 font-mono text-[9px] text-blue-400/40">
              <Terminal size={10} />
              IDENTITY_CARD_PROJ_ACTIVE
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              
              {/* Left Side Info Card */}
              <div className="font-mono">
                <span className="text-[10px] tracking-[0.2em] text-blue-400">{"KOUSHIGAN'S LAB"}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-1">{siteConfig.name}</h3>
                <p className="text-xs text-[#a0a0b0] mb-6">{siteConfig.title}</p>
                
                <div className="space-y-3.5 text-xs text-[#a0a0b0]">
                  <a href={`mailto:${socials.email}`} className="flex items-center gap-2 hover:text-white transition-colors group outline-none focus-visible:text-white">
                    <Mail size={12} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span>{socials.email}</span>
                  </a>
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group outline-none focus-visible:text-white">
                    <GitBranch size={12} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span>github.com/yourusername</span>
                  </a>
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group outline-none focus-visible:text-white">
                    <Link size={12} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span>linkedin.com/in/yourusername</span>
                  </a>
                  <div className="flex items-center gap-2 select-none">
                    <Phone size={12} className="text-blue-400" />
                    <span>[PHONE]</span>
                  </div>
                </div>
              </div>

              {/* Right Side Form fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    placeholder=" "
                    className="peer w-full px-3 pt-5 pb-2 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-white outline-none hover:border-white/20 focus:border-blue-500/50 focus:bg-black/70 transition-all duration-200"
                  />
                  <label className="absolute left-3 top-1 text-[8px] font-mono text-[#8c8c9c] peer-focus:text-blue-400 uppercase tracking-widest peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs transition-all pointer-events-none">
                    NAME_NODE
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    placeholder=" "
                    className="peer w-full px-3 pt-5 pb-2 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-white outline-none hover:border-white/20 focus:border-blue-500/50 focus:bg-black/70 transition-all duration-200"
                  />
                  <label className="absolute left-3 top-1 text-[8px] font-mono text-[#8c8c9c] peer-focus:text-blue-400 uppercase tracking-widest peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs transition-all pointer-events-none">
                    EMAIL_COORDS
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                    placeholder=" "
                    className="peer w-full px-3 pt-5 pb-2 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-white outline-none hover:border-white/20 focus:border-blue-500/50 focus:bg-black/70 transition-all duration-200 resize-none"
                  />
                  <label className="absolute left-3 top-1 text-[8px] font-mono text-[#8c8c9c] peer-focus:text-blue-400 uppercase tracking-widest peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs transition-all pointer-events-none">
                    TRANSMISSION_DATA
                  </label>
                </div>

                {state.status === 'success' && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 bg-blue-500/5 p-2.5 rounded border border-blue-500/20">
                    <CheckCircle2 size={12} />
                    <span>{state.message}</span>
                  </div>
                )}

                {state.status === 'error' && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 bg-red-500/5 p-2.5 rounded border border-red-500/20">
                    <AlertCircle size={12} />
                    <span>{state.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state.status === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-[10px] font-mono tracking-widest text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_12px_rgba(59,130,246,0.2)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  data-cursor-magnetic
                >
                  <Send size={12} />
                  SEND_DATAFEED
                </button>
              </form>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
