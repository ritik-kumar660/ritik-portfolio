import { achievementsData } from '../data/data'
import { Trophy, Star, Zap } from 'lucide-react'

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-24 lg:py-40 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-red-700/7 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-20">
          <div className="flex items-center gap-3 text-red-500">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">Milestones</span>
          </div>
          <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center">
            Achieve<span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">ments</span>
          </h2>
          <p className="text-[var(--gray)] text-center max-w-xl">
            Milestones that reflect consistent growth and dedication to the craft.
          </p>
        </div>

        {/* Achievement Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {achievementsData.map((ach, index) => (
            <div
              key={ach.id}
              className="group relative p-8 rounded-3xl border border-white/6 bg-white/[0.025] hover:border-red-500/35 transition-all duration-500 overflow-hidden"
            >
              {/* Giant background stat */}
              <div className="absolute -right-4 -bottom-6 font-syne font-black text-[90px] leading-none select-none text-white/[0.025] group-hover:text-white/[0.04] transition-all duration-500">
                {ach.stat}
              </div>

              <div className="relative z-10 flex gap-6 items-start">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(230,48,48,0.2)]">
                  {ach.icon}
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest font-mono">{ach.platform}</span>
                    <h3 className="font-syne font-black text-xl text-white mt-1 leading-tight group-hover:text-red-400 transition-colors duration-300">
                      {ach.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-light">{ach.description}</p>
                  <div className="flex items-center gap-2 text-[var(--gray)] text-xs font-mono">
                    <Zap className="w-3 h-3 text-red-500" />
                    {ach.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlight band */}
        <div className="mt-16 relative overflow-hidden p-10 rounded-3xl border border-red-500/15 bg-gradient-to-r from-red-600/8 via-transparent to-red-900/8">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(230,48,48,0.3) 10px, rgba(230,48,48,0.3) 11px)' }} />
          <div className="relative z-10 flex flex-wrap justify-center gap-12 md:gap-20">
            <div className="flex flex-col items-center gap-2">
              <span className="font-syne font-black text-4xl text-white">200+</span>
              <span className="text-[var(--gray)] text-sm uppercase tracking-widest font-mono">DSA Problems</span>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block self-center" />
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-6 h-6 fill-red-500 text-red-500" />
                ))}
              </div>
              <span className="text-[var(--gray)] text-sm uppercase tracking-widest font-mono">HackerRank Rating</span>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block self-center" />
            <div className="flex flex-col items-center gap-2">
              <span className="font-syne font-black text-4xl text-white">3+</span>
              <span className="text-[var(--gray)] text-sm uppercase tracking-widest font-mono">Full Stack Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
