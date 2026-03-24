import { projectsData } from '../data/data'
import { BsGithub } from 'react-icons/bs'
import { Globe, Code, ExternalLink, Sparkles, Layers } from 'lucide-react'
import { useState } from 'react'

function ProjectCard({ project }) {
  const [showAll, setShowAll] = useState(false)
  const maxTags = 4
  const visible = showAll ? project.tools : project.tools.slice(0, maxTags)

  return (
    <div className="group relative flex flex-col h-full rounded-3xl border border-white/8 bg-white/[0.02] hover:border-red-600/40 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(230,48,48,0.08)]">
      {/* Top color accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Tag + Sparkle */}
        <div className="flex items-start justify-between">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono">
            {project.tag}
          </span>
          <Sparkles className="w-4 h-4 text-red-500/40 group-hover:text-red-500/80 transition-colors duration-300" />
        </div>

        {/* Title */}
        <div>
          <h3 className="font-syne font-black text-2xl text-white group-hover:text-red-400 transition-colors duration-300 leading-tight mb-3">
            {project.name}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed font-light">{project.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {visible.map((tool) => (
            <span key={tool} className="px-2.5 py-1 text-[11px] font-mono bg-white/4 border border-white/8 text-slate-400 rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-200">
              {tool}
            </span>
          ))}
          {project.tools.length > maxTags && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-2.5 py-1 text-[11px] font-mono font-bold text-red-500 hover:text-red-400 transition-colors"
            >
              {showAll ? 'less' : `+${project.tools.length - maxTags}`}
            </button>
          )}
        </div>
      </div>

      {/* Footer buttons */}
      <div className="p-5 pt-0 flex gap-3">
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/4 border border-white/8 text-slate-300 hover:bg-red-600/20 hover:border-red-600/40 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300">
            <Globe className="w-4 h-4" /> Demo
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.015] border border-white/4 text-slate-700 text-xs font-semibold uppercase tracking-wider cursor-not-allowed">
            <Globe className="w-4 h-4" /> Demo
          </div>
        )}
        {project.code ? (
          <a href={project.code} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/4 border border-white/8 text-slate-300 hover:bg-white/8 hover:border-white/20 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300">
            <BsGithub className="w-4 h-4" /> Code
          </a>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.015] border border-white/4 text-slate-700 text-xs font-semibold uppercase tracking-wider cursor-not-allowed">
            <Code className="w-4 h-4" /> Code
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 lg:py-40 overflow-hidden">
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-red-600/6 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-20">
          <div className="flex items-center gap-3 text-red-500">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">Portfolio</span>
          </div>
          <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center">
            Featured <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-[var(--gray)] text-center max-w-xl">
            AI-powered full stack applications built with real-world impact in mind.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {projectsData.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="flex justify-center mt-14">
          <a
            href="https://github.com/ritik-kumar660"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-red-600/40 hover:bg-red-600/8 hover:text-white transition-all duration-300 font-semibold text-sm uppercase tracking-wider"
          >
            <BsGithub size={20} />
            View All on GitHub
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </section>
  )
}
