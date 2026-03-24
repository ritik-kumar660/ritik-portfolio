import { useState, useEffect, useRef } from 'react'
import { skillsData } from '../data/data'
import {
  SiJavascript, SiPython, SiCplusplus, SiC, SiKotlin,
  SiReact, SiNodedotjs, SiNextdotjs, SiBootstrap, SiTailwindcss,
  SiMysql, SiMongodb, SiFigma, SiGit, SiGithub, SiAndroidstudio,
  SiXampp
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import { VscVscode } from 'react-icons/vsc'
import { Code2 } from 'lucide-react'

const iconMap = {
  'C++':            { Icon: SiCplusplus,    color: '#00599C' },
  'Python':         { Icon: SiPython,       color: '#3776AB' },
  'C':              { Icon: SiC,            color: '#A8B9CC' },
  'Java':           { Icon: FaJava,         color: '#f89820' },
  'Kotlin':         { Icon: SiKotlin,       color: '#7F52FF' },
  'JavaScript':     { Icon: SiJavascript,   color: '#F7DF1E' },
  'React.js':       { Icon: SiReact,        color: '#61DAFB' },
  'Node.js':        { Icon: SiNodedotjs,    color: '#339933' },
  'Next.js':        { Icon: SiNextdotjs,    color: '#ffffff' },
  'Bootstrap':      { Icon: SiBootstrap,    color: '#7952B3' },
  'Tailwind CSS':   { Icon: SiTailwindcss,  color: '#06B6D4' },
  'MySQL':          { Icon: SiMysql,        color: '#4479A1' },
  'MongoDB':        { Icon: SiMongodb,      color: '#47A248' },
  'Figma':          { Icon: SiFigma,        color: '#F24E1E' },
  'XAMPP':          { Icon: SiXampp,        color: '#FB7A24' },
  'Git':            { Icon: SiGit,          color: '#F05032' },
  'GitHub':         { Icon: SiGithub,       color: '#ffffff' },
  'VS Code':        { Icon: VscVscode,      color: '#007ACC' },
  'Android Studio': { Icon: SiAndroidstudio,color: '#3DDC84' },
}

const allSkills = [
  ...skillsData.languages,
  ...skillsData.frameworks,
  ...skillsData.tools,
]

const half = Math.ceil(allSkills.length / 2)
const firstRow  = allSkills.slice(0, half)
const secondRow = allSkills.slice(half)

const categories = [
  { label: 'Languages',   skills: skillsData.languages,  color: '#ef4444', glow: 'rgba(239,68,68,0.15)'  },
  { label: 'Frameworks',  skills: skillsData.frameworks, color: '#f97316', glow: 'rgba(249,115,22,0.15)' },
  { label: 'Tools',       skills: skillsData.tools,      color: '#eab308', glow: 'rgba(234,179,8,0.15)'  },
  { label: 'Soft Skills', skills: skillsData.soft,       color: '#22c55e', glow: 'rgba(34,197,94,0.15)'  },
]

/* ─────────────────────────────────────────
   SPOTLIGHT FOLLOWER (section-scoped)
───────────────────────────────────────── */
function SectionSpotlight({ sectionRef }) {
  const spotRef = useRef(null)
  useEffect(() => {
    const h = (e) => {
      if (!spotRef.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      spotRef.current.style.background = `radial-gradient(500px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(239,68,68,0.06), transparent 50%)`
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [sectionRef])
  return <div ref={spotRef} className="absolute inset-0 pointer-events-none z-[2] transition-none rounded-[inherit]" />
}

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ─────────────────────────────────────────
   FLOATING PARTICLES (section bg)
───────────────────────────────────────── */
function SkillsParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const DOTS = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.25 + 0.05,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      DOTS.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = canvas.width; if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height; if (d.y > canvas.height) d.y = 0
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(239,68,68,${d.o})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
}

/* ─────────────────────────────────────────
   SKILL PILL (marquee)
───────────────────────────────────────── */
function SkillPill({ skill, paused }) {
  const entry = iconMap[skill]
  const Icon = entry?.Icon
  const color = entry?.color || '#e63030'
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="skill-pill-item mx-3 group flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.025] whitespace-nowrap shadow-lg relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'border-color 0.3s, background 0.3s, transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s',
        borderColor: hovered ? `${color}55` : undefined,
        background: hovered ? `${color}12` : undefined,
        transform: hovered ? 'translateY(-4px) scale(1.04)' : undefined,
        boxShadow: hovered ? `0 12px 32px ${color}25, 0 0 0 1px ${color}30` : undefined,
      }}
    >
      {/* Shimmer swipe on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {Icon ? (
        <Icon
          style={{
            color,
            fontSize: '22px',
            filter: hovered ? `drop-shadow(0 0 6px ${color}99)` : 'none',
            transform: hovered ? 'scale(1.2) rotate(-8deg)' : 'none',
            transition: 'transform 0.35s cubic-bezier(.34,1.56,.64,1), filter 0.3s',
          }}
          className="shrink-0"
        />
      ) : (
        <Code2 style={{ color }} className="w-5 h-5 shrink-0" />
      )}
      <span
        className="text-sm font-semibold uppercase tracking-wide font-mono transition-colors duration-300"
        style={{ color: hovered ? '#fff' : '#94a3b8' }}
      >
        {skill}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────
   MARQUEE ROW
───────────────────────────────────────── */
function MarqueeRow({ skills, direction = 'left', speed = '40s' }) {
  const [paused, setPaused] = useState(false)
  const doubled = [...skills, ...skills]
  return (
    <div
      className="overflow-hidden marquee-fade-mask"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}
        style={{
          animationDuration: speed,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {doubled.map((skill, i) => (
          <SkillPill key={`${skill}-${i}`} skill={skill} paused={paused} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CATEGORY CARD
───────────────────────────────────────── */
function CategoryCard({ label, skills, color, glow, delay }) {
  const [ref, visible] = useReveal(0.1)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [cardHover, setCardHover] = useState(false)

  return (
    <div
      ref={ref}
      className="relative p-6 rounded-2xl border border-white/5 overflow-hidden group transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(32px) scale(0.97)',
        transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}s, border-color 0.4s, box-shadow 0.4s`,
        borderColor: cardHover ? `${color}40` : undefined,
        boxShadow: cardHover ? `0 0 40px ${glow}, inset 0 0 30px ${glow}` : undefined,
      }}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 65%)` }}
      />

      {/* Animated corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(circle at 100% 0%, ${color}25 0%, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 100%, ${color}15 0%, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${color}18`,
            boxShadow: cardHover ? `0 0 14px ${color}50` : 'none',
            border: `1px solid ${color}30`,
          }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        </div>
        <h3 className="text-white font-syne font-bold text-sm uppercase tracking-widest transition-colors duration-300"
          style={{ color: cardHover ? color : '#fff' }}>
          {label}
        </h3>
        <span className="ml-auto text-[10px] font-mono opacity-40 group-hover:opacity-70 transition-opacity"
          style={{ color }}>
          {skills.length} skills
        </span>
      </div>

      {/* Skill tags */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {skills.map((skill, i) => {
          const isHov = hoveredSkill === skill
          const entry = iconMap[skill]
          const Icon = entry?.Icon
          const iconColor = entry?.color || color
          return (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border font-mono transition-all duration-250 cursor-default"
              style={{
                animationDelay: `${delay + i * 0.04}s`,
                borderColor: isHov ? `${iconColor}55` : 'rgba(255,255,255,0.08)',
                background: isHov ? `${iconColor}15` : 'transparent',
                color: isHov ? '#fff' : '#94a3b8',
                transform: isHov ? 'translateY(-2px) scale(1.05)' : 'none',
                boxShadow: isHov ? `0 4px 16px ${iconColor}25` : 'none',
              }}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {Icon && (
                <Icon style={{ color: isHov ? iconColor : 'currentColor', fontSize: '12px', filter: isHov ? `drop-shadow(0 0 4px ${iconColor}80)` : 'none', transition: 'all 0.25s' }} />
              )}
              {skill}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function SectionHeader() {
  const [ref, visible] = useReveal(0.2)
  return (
    <div ref={ref} className="flex flex-col items-center gap-4 mb-20">
      {/* Label */}
      <div
        className="flex items-center gap-3 text-red-500 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transitionDelay: '0.05s' }}
      >
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <Code2 className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">Technical Arsenal</span>
      </div>

      {/* Title */}
      <div
        className="overflow-hidden transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transitionDelay: '0.12s' }}
      >
        <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center leading-tight">
          The{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">
              Tech Stack
            </span>
            {/* Underline bar */}
            <span
              className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 to-red-800"
              style={{ width: visible ? '100%' : '0%', transition: 'width 0.9s cubic-bezier(.22,1,.36,1) 0.5s' }}
            />
          </span>
        </h2>
      </div>

      {/* Subtitle */}
      <p
        className="text-[var(--gray,#888)] text-center max-w-xl transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: '0.22s' }}
      >
        Technologies I use to craft modern, scalable applications
      </p>

      {/* Decorative line */}
      <div
        className="flex items-center gap-3 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '0.3s' }}
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50 rounded-full" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   STATS BAR
───────────────────────────────────────── */
function StatsBar() {
  const [ref, visible] = useReveal(0.2)
  const stats = [
    { num: skillsData.languages?.length ?? 6, label: 'Languages' },
    { num: skillsData.frameworks?.length ?? 5, label: 'Frameworks' },
    { num: skillsData.tools?.length ?? 8, label: 'Tools' },
    { num: allSkills.length, label: 'Total Skills' },
  ]
  return (
    <div ref={ref} className="flex justify-center gap-8 mb-16 flex-wrap">
      {stats.map(({ num, label }, i) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 group cursor-default"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${0.1 + i * 0.08}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${0.1 + i * 0.08}s`,
          }}
        >
          <span className="font-syne font-black text-3xl text-white group-hover:text-red-400 transition-colors duration-300">
            {num}+
          </span>
          <span className="text-[10px] text-[var(--gray,#888)] uppercase tracking-widest font-mono group-hover:text-red-400/70 transition-colors duration-300">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function Skills() {
  const sectionRef = useRef(null)
  const [marqueeRef, marqueeVisible] = useReveal(0.05)

  return (
    <>
      <style>{`
        /* Marquee */
        @keyframes marqueeLeft  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes marqueeRight { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        .marquee-track-left  { display:inline-flex; animation:marqueeLeft  linear infinite; will-change:transform; }
        .marquee-track-right { display:inline-flex; animation:marqueeRight linear infinite; will-change:transform; }

        /* Edge fade */
        .marquee-fade-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        /* Section glow pulse */
        @keyframes sectionGlow { 0%,100%{opacity:.6} 50%{opacity:1} }
        .section-glow { animation: sectionGlow 4s ease-in-out infinite; }

        /* Hex grid bg */
        .hex-grid {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8Z' fill='none' stroke='rgba(239,68,68,0.04)' stroke-width='0.5'/%3E%3C/svg%3E");
          background-size: 28px 49px;
        }

        /* Marquee row reveal */
        .marquee-reveal { opacity:0; transform:translateY(24px); transition:opacity 0.7s cubic-bezier(.22,1,.36,1),transform 0.7s cubic-bezier(.22,1,.36,1); }
        .marquee-reveal.in { opacity:1; transform:none; }

        /* Category card skill tag pop-in */
        @keyframes tagIn { 0%{opacity:0;transform:scale(.85) translateY(6px)} 100%{opacity:1;transform:none} }

        /* Noise */
        .skills-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 128px;
        }

        /* Glowing separator line */
        @keyframes lineGrow { 0%{width:0} 100%{width:100%} }
      `}</style>

      <section
        ref={sectionRef}
        id="skills"
        className="relative py-24 lg:py-40 overflow-hidden"
        style={{ background: '#050508' }}
      >
        {/* Hex grid bg */}
        <div className="hex-grid absolute inset-0 pointer-events-none opacity-60" />

        {/* Noise */}
        <div className="skills-noise absolute inset-0 pointer-events-none opacity-[0.025]" />

        {/* Particles */}
        <SkillsParticles />

        {/* Spotlight */}
        <SectionSpotlight sectionRef={sectionRef} />

        {/* Central glow blob */}
        <div className="section-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/8 blur-[160px] rounded-full pointer-events-none" />

        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050508] to-transparent pointer-events-none z-[3]" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-[3]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Header */}
          <SectionHeader />

          {/* Stats */}
          <StatsBar />

          {/* Marquee rows */}
          <div
            ref={marqueeRef}
            className="flex flex-col gap-5 mb-20"
          >
            <div
              className={`marquee-reveal${marqueeVisible ? ' in' : ''}`}
              style={{ transitionDelay: '0s' }}
            >
              <MarqueeRow skills={firstRow}  direction="left"  speed="35s" />
            </div>
            <div
              className={`marquee-reveal${marqueeVisible ? ' in' : ''}`}
              style={{ transitionDelay: '0.12s' }}
            >
              <MarqueeRow skills={secondRow} direction="right" speed="28s" />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">By Category</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map(({ label, skills, color, glow }, i) => (
              <CategoryCard
                key={label}
                label={label}
                skills={skills}
                color={color}
                glow={glow}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}