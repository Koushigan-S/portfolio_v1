'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { socials } from '@/config/socials.config';
import { skillsRadar } from '@/config/skills.config';
import { projects } from '@/config/projects.config';
import { features } from '@/config/features.config';

type TerminalLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string | string[];
};

const HELP_OUTPUT = [
  '╔══════════════════════════════════════╗',
  '║        PORTFOLIO TERMINAL v1.0       ║',
  '╚══════════════════════════════════════╝',
  '',
  'Available commands:',
  '  help       — Show this help message',
  '  about      — Learn about me',
  '  skills     — View skill proficiencies',
  '  projects   — List all projects',
  '  resume     — Download my resume',
  '  contact    — Get contact information',
  '  whoami     — Reveal identity card',
  '  clear      — Clear the terminal',
  '',
  'Tip: Press Ctrl + ` to toggle this terminal',
];

const WHOAMI_OUTPUT = [
  '╔═══════════════════════════════════════════╗',
  `║  ${siteConfig.name.padEnd(42)}║`,
  `║  ${siteConfig.title.padEnd(42)}║`,
  '╠═══════════════════════════════════════════╣',
  `║  Email: ${siteConfig.email.padEnd(34)}║`,
  `║  GitHub: ${socials.github.replace('https://', '').padEnd(33)}║`,
  `║  LinkedIn: ${socials.linkedin.replace('https://linkedin.com/in/', '@').padEnd(31)}║`,
  '╠═══════════════════════════════════════════╣',
  `║  Portfolio: ${siteConfig.url.padEnd(30)}║`,
  '╚═══════════════════════════════════════════╝',
];

function processCommand(cmd: string): string[] {
  const c = cmd.trim().toLowerCase();

  switch (c) {
    case 'help':
      return HELP_OUTPUT;

    case 'about':
      return [
        `>> ${siteConfig.name}`,
        `>> ${siteConfig.title}`,
        '',
        siteConfig.tagline,
        '',
        siteConfig.description,
      ];

    case 'skills':
      return [
        'Skill Proficiencies:',
        '──────────────────────────────',
        ...skillsRadar.map((s) => {
          const filled = Math.round(s.value / 5);
          const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
          return `${s.name.padEnd(12)} ${bar} ${s.value}%`;
        }),
      ];

    case 'projects':
      return [
        `${projects.length} Projects Found:`,
        '──────────────────────────────',
        ...projects.map((p, i) => `${i + 1}. ${p.name} [${p.category}] — ${p.tagline}`),
        '',
        'Click on a planet in Project Galaxy to explore.',
      ];

    case 'resume':
      // Trigger download
      if (typeof window !== 'undefined') {
        window.open(siteConfig.resumeUrl, '_blank');
      }
      return ['Opening resume…', 'If download did not start, visit: ' + siteConfig.resumeUrl];

    case 'contact':
      return [
        'Contact Information:',
        '──────────────────────────────',
        `Email:     ${siteConfig.email}`,
        `GitHub:    ${socials.github}`,
        `LinkedIn:  ${socials.linkedin}`,
        `Twitter:   ${socials.twitter}`,
        '',
        'Or scroll to the Contact section.',
      ];

    case 'whoami':
      return WHOAMI_OUTPUT;

    case 'clear':
      return ['__CLEAR__'];

    case '':
      return [];

    default:
      return [`Command not found: ${cmd}`, 'Type "help" for available commands.'];
  }
}

export function DeveloperTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: HELP_OUTPUT },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // Keyboard shortcut: Ctrl + `
  useEffect(() => {
    if (!features.developerTerminal) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, toggle]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const submit = () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    const output = processCommand(cmd);

    if (output[0] === '__CLEAR__') {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: 'input', content: `> ${cmd}` },
        ...(output.length > 0 ? [{ type: 'output' as const, content: output }] : []),
      ]);
    }

    setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistoryIdx(-1);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setInput(history[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? '' : history[idx] ?? '');
    }
  };

  if (!features.developerTerminal) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="terminal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Developer terminal"
        >
          <motion.div
            className="terminal-window"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Title bar */}
            <div className="terminal-titlebar">
              <button
                onClick={() => setOpen(false)}
                className="terminal-dot"
                style={{ background: '#ef4444' }}
                aria-label="Close terminal"
              />
              <div className="terminal-dot" style={{ background: '#f59e0b' }} aria-hidden />
              <div className="terminal-dot" style={{ background: '#10b981' }} aria-hidden />
              <span
                className="ml-4 text-xs font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                portfolio — bash — 80×24
              </span>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Close terminal"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="terminal-body" ref={bodyRef} aria-live="polite">
              {lines.map((line, i) => (
                <div key={i} className="mb-1">
                  {Array.isArray(line.content) ? (
                    line.content.map((l, j) => (
                      <div
                        key={j}
                        style={{
                          color:
                            line.type === 'input'
                              ? 'var(--accent-primary)'
                              : line.type === 'error'
                              ? '#ef4444'
                              : line.type === 'system'
                              ? 'var(--text-secondary)'
                              : 'var(--text-primary)',
                        }}
                      >
                        {l || '\u00A0'}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        color:
                          line.type === 'input'
                            ? 'var(--accent-primary)'
                            : line.type === 'error'
                            ? '#ef4444'
                            : 'var(--text-primary)',
                      }}
                    >
                      {line.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Input row */}
              <div className="flex items-center gap-2 mt-1">
                <span style={{ color: 'var(--accent-primary)' }}>❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent outline-none font-mono text-sm"
                  style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-primary)' }}
                  aria-label="Terminal input"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
