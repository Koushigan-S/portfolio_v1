'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { skillsRadar } from '@/config/skills.config';
import { features } from '@/config/features.config';

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 120;
const LEVELS = 5;

function polarToCartesian(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function pointsToString(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

export function SkillsRadar() {
  const count = skillsRadar.length;
  const angleStep = 360 / count;

  const axisPoints = useMemo(
    () => skillsRadar.map((_, i) => polarToCartesian(i * angleStep, RADIUS)),
    [angleStep]
  );

  const dataPoints = useMemo(
    () =>
      skillsRadar.map((s, i) =>
        polarToCartesian(i * angleStep, (s.value / 100) * RADIUS)
      ),
    [angleStep]
  );

  const levelPolygons = useMemo(() =>
    Array.from({ length: LEVELS }, (_, lvl) => {
      const r = ((lvl + 1) / LEVELS) * RADIUS;
      return skillsRadar.map((_, i) => polarToCartesian(i * angleStep, r));
    }),
    [angleStep]
  );

  return (
    <section id="skills" className="section" aria-label="Skills section">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="text-section-label mb-4">My Expertise</p>
          <h2 className="text-display font-display gradient-text">Skills</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-center justify-center">
          {/* SVG Radar */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              aria-label="Skills radar chart"
              role="img"
            >
              {/* Background rings */}
              {levelPolygons.map((pts, lvl) => (
                <polygon
                  key={lvl}
                  points={pointsToString(pts)}
                  fill={`rgba(99, 102, 241, ${0.03 + lvl * 0.01})`}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines */}
              {axisPoints.map((pt, i) => (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* Data polygon */}
              {features.skillsRadar ? (
                <motion.polygon
                  points={pointsToString(dataPoints)}
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                />
              ) : (
                <polygon
                  points={pointsToString(dataPoints)}
                  fill="rgba(99, 102, 241, 0.15)"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              )}

              {/* Data dots */}
              {dataPoints.map((pt, i) => (
                <motion.circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  fill={skillsRadar[i].color}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  style={{ filter: `drop-shadow(0 0 8px ${skillsRadar[i].color})` }}
                />
              ))}

              {/* Labels */}
              {axisPoints.map((pt, i) => {
                const offset = 20;
                const rad = (i * angleStep - 90) * (Math.PI / 180);
                const lx = CENTER + (RADIUS + offset) * Math.cos(rad);
                const ly = CENTER + (RADIUS + offset) * Math.sin(rad);
                const anchor = Math.abs(lx - CENTER) < 5 ? 'middle' : lx > CENTER ? 'start' : 'end';

                return (
                  <text
                    key={i}
                    x={lx}
                    y={ly}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fill={skillsRadar[i].color}
                    fontWeight="500"
                  >
                    {skillsRadar[i].name}
                  </text>
                );
              })}
            </svg>

            {/* Pulse glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
              aria-hidden
            />
          </motion.div>

          {/* Skills list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            {skillsRadar.map((skill, i) => (
              <motion.div
                key={skill.name}
                className="p-4 rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {skill.name}
                  </span>
                  <span className="text-sm font-mono" style={{ color: skill.color }}>
                    {skill.value}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: skill.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
