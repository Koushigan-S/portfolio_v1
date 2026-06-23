'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Terminal,
  Share2
} from 'lucide-react';
import { socials } from '@/config/socials.config';
import { siteConfig } from '@/config/site.config';
import type { ContactFormState } from '@/types';
import { GlitchText } from '../hero/GlitchText';

// Custom Brand SVG Icons for Magic Share Menu
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.08-1.72l1.28-4.04 4.2 1c.06 1.05.93 1.88 2 1.88 1.1 0 2-.9 2-2s-.9-2-2-2c-1.03 0-1.88.77-1.97 1.76l-4.7-1.12c-.22-.05-.44.08-.5.3l-1.5 4.76C6.18 5.75 3.94 6.4 2.26 7.42 1.7 6.66.8 6.18 0 6.18c-1.65 0-3 1.35-3 3 0 1.1.6 2.05 1.48 2.58-.08.24-.12.49-.12.74 0 3.86 4.48 7 10 7s10-3.14 10-7c0-.25-.04-.5-.12-.74.88-.53 1.48-1.48 1.48-2.58zM4.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 3.5c-1.8 1.8-5.2 1.8-7 0-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0 1.2 1.2 3.6 1.2 4.8 0 .3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1zm-.5-5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.905-6.99C16.558 1.878 14.078.848 11.44.848 6.002.848 1.58 5.27 1.576 10.708c-.001 1.737.478 3.427 1.386 4.935L1.93 20.31l4.717-1.156zM17.48 14.86c-.313-.156-1.848-.912-2.131-1.015-.282-.102-.489-.153-.694.156-.205.308-.795 1.002-.975 1.205-.18.203-.359.228-.672.072-1.53-.766-2.686-1.332-3.754-2.22-.282-.24-.428-.48-.005-.985.18-.216.36-.432.54-.648.18-.216.24-.37.36-.617.12-.247.06-.463-.03-.617-.09-.155-.694-1.67-.95-2.285-.25-.6-.525-.52-.722-.53-.186-.01-.4-.01-.613-.01-.213 0-.559.08-.85.399-.29.318-1.11 1.085-1.11 2.643 0 1.558 1.135 3.067 1.29 3.277.156.21 2.235 3.415 5.414 4.79.756.327 1.346.522 1.805.667.76.24 1.45.207 1.996.126.61-.09 1.847-.756 2.108-1.45.26-.694.26-1.288.182-1.411-.077-.123-.282-.2-.595-.356z" />
  </svg>
);

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<ContactFormState>({ status: 'idle' });
  const [menuOpen, setMenuOpen] = useState(false);

  const socialItems = [
    { icon: TwitterIcon, href: socials.twitter || '#', color: '#000000', label: 'X' },
    { icon: RedditIcon, href: 'https://reddit.com', color: '#ff4500', label: 'Reddit' },
    { icon: LinkedinIcon, href: socials.linkedin, color: '#0a66c2', label: 'LinkedIn' },
    { icon: InstagramIcon, href: socials.instagram || '#', color: '#e1306c', label: 'Instagram' },
    { icon: GithubIcon, href: socials.github, color: '#24292e', label: 'GitHub' },
    { icon: YoutubeIcon, href: 'https://youtube.com', color: '#ff0000', label: 'YouTube' },
    { icon: FacebookIcon, href: 'https://facebook.com', color: '#1877f2', label: 'Facebook' },
    { icon: WhatsappIcon, href: `https://wa.me/${socials.email}`, color: '#25d366', label: 'WhatsApp' },
  ];

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
            className="glass-heavy p-[15px] rounded-xl border border-blue-500/20 glow-primary relative overflow-hidden mb-16"
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
              <div className="font-mono flex flex-col justify-between min-h-[300px]">
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-blue-400">{"KOUSHIGAN'S LAB"}</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-1">{siteConfig.name}</h3>
                  <p className="text-xs text-[#a0a0b0] mb-6">{siteConfig.title}</p>
                </div>
                
                {/* Magic Social Share Menu */}
                <div className="relative flex items-center justify-center w-full h-[240px] select-none">
                  
                  {/* Surrounding Ring of Social Icons */}
                  {socialItems.map((item, index) => {
                    const angle = (index * 360) / 8 - 90; // offset by -90deg so index 0 is at the top
                    const rad = (angle * Math.PI) / 180;
                    const radius = 85;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;

                    return (
                      <motion.a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg border border-gray-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:z-30 z-10"
                        style={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={menuOpen ? {
                          x,
                          y,
                          scale: 1,
                          opacity: 1,
                        } : {
                          x: 0,
                          y: 0,
                          scale: 0,
                          opacity: 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 24,
                          delay: menuOpen ? index * 0.04 : (7 - index) * 0.03,
                        }}
                        whileHover={{
                          scale: 1.15,
                          boxShadow: `0 0 16px ${item.color}, 0 0 4px #fff`,
                        }}
                        aria-label={`Share on ${item.label}`}
                      >
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </motion.a>
                    );
                  })}

                  {/* Center Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="absolute w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-20 focus:outline-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-expanded={menuOpen}
                    aria-label="Toggle social share menu"
                  >
                    <motion.div
                      className="flex items-center justify-center"
                      animate={{ rotate: menuOpen ? 45 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <Share2 size={18} className="text-gray-800" />
                    </motion.div>
                  </button>

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
