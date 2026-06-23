'use client';

import { motion } from 'framer-motion';
import { ExternalLink, GitBranch } from 'lucide-react';
import { featuredProjects } from '@/config/projects.config';

export function FeaturedShowcase() {
  if (featuredProjects.length === 0) return null;

  return (
    <section id="featured" className="section" aria-label="Featured projects">
      <div className="container">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <p className="text-section-label mb-4">Deep Dive</p>
          <h2 className="text-display font-display gradient-text">Featured Work</h2>
        </motion.div>

        <div className="space-y-32">
          {featuredProjects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={project.id}
                className={`grid md:grid-cols-2 gap-16 items-center ${!isEven ? 'md:[&>*:first-child]:order-2' : ''}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* Thumbnail */}
                <motion.div
                  className="relative aspect-video rounded-3xl overflow-hidden"
                  style={{
                    background: `${project.planetColor}10`,
                    border: `1px solid ${project.planetColor}30`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Placeholder visual */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${project.planetColor}20 0%, transparent 100%)`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                        style={{ background: `${project.planetColor}20`, border: `2px solid ${project.planetColor}40` }}
                      >
                        🚀
                      </div>
                      <span
                        className="text-section-label"
                        style={{ color: project.planetColor }}
                      >
                        {project.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Corner badge */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono"
                    style={{
                      background: `${project.planetColor}20`,
                      border: `1px solid ${project.planetColor}40`,
                      color: project.planetColor,
                    }}
                  >
                    Featured
                  </div>
                </motion.div>

                {/* Content */}
                <div>
                  <motion.span
                    className="text-section-label mb-4 block"
                    style={{ color: project.planetColor }}
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {project.category.toUpperCase()}
                  </motion.span>

                  <motion.h3
                    className="text-title font-display mb-4"
                    style={{ color: 'var(--text-primary)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {project.name}
                  </motion.h3>

                  <motion.p
                    className="text-lg mb-4 leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    {project.tagline}
                  </motion.p>

                  <motion.p
                    className="mb-8 leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Tech pills */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                  >
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                        aria-label={`View ${project.name} on GitHub`}
                      >
                        <GitBranch size={16} /> GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        aria-label={`View live demo of ${project.name}`}
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
