import { useState, useEffect, useRef } from 'react'
import { personalData, educationData, trainingData } from '../data/data'
import { User, GraduationCap, Calendar, MapPin, BookOpen } from 'lucide-react'

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.12) {
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
   MOUSE SPOTLIGHT
───────────────────────────────────────── */
function SectionSpotlight({ sectionRef }) {
  const spotRef = useRef(null)
  useEffect(() => {
    const h = (e) => {
      if (!spotRef.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      spotRef.current.style.background = `radial-gradient(520px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(239,68,68,0.055), transparent 50%)`
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [sectionRef])
  return <div ref={spotRef} className="absolute inset-0 pointer-events-none z-[2]" />
}

/* ─────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────── */
function AboutParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const DOTS = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.3, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      o: Math.random() * 0.2 + 0.05,
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
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />
}

/* ─────────────────────────────────────────
   ANIMATED COUNT-UP
───────────────────────────────────────── */
function CountUp({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1400, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setVal(Math.floor(ease * to))
        if (p < 1) requestAnimationFrame(tick); else setVal(to)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─────────────────────────────────────────
   TILT CARD
───────────────────────────────────────── */
function TiltCard({ children, className, style }) {
  const ref = useRef(null)
  const raf = useRef(null)
  const target = useRef({ rx: 0, ry: 0 })
  const current = useRef({ rx: 0, ry: 0 })
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    target.current.rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -6
    target.current.ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 6
  }
  const onLeave = () => { target.current = { rx: 0, ry: 0 } }
  useEffect(() => {
    const tick = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.1
      current.current.ry += (target.current.ry - current.current.ry) * 0.1
      if (ref.current) ref.current.style.transform = `perspective(900px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg)`
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={className} style={{ ...style, transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
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
      <div className="flex items-center gap-3 text-red-500 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transitionDelay: '0.05s' }}>
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <User className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">About Me</span>
      </div>

      <div className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transitionDelay: '0.12s' }}>
        <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center">
          My{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">Journey</span>
            <span className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 to-red-800"
              style={{ width: visible ? '100%' : '0%', transition: 'width 0.9s cubic-bezier(.22,1,.36,1) 0.55s' }} />
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-3 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '0.28s' }}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50 rounded-full" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   BIO CARD
───────────────────────────────────────── */
function BioCard() {
  const [ref, visible] = useReveal(0.1)
  const [hovered, setHovered] = useState(false)

  const quickStats = [
    { num: 3, suffix: '+', label: 'Projects' },
    { num: 200, suffix: '+', label: 'DSA Solved' },
    { num: 5, suffix: '★', label: 'HackerRank' },
  ]

  return (
    <div ref={ref} className="transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)', transitionDelay: '0.05s' }}>
      <TiltCard
        className="relative p-8 lg:p-10 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl group"
        style={{ borderColor: hovered ? 'rgba(239,68,68,0.25)' : undefined, transition: 'border-color 0.4s, box-shadow 0.4s' }}
      >
        {/* Hover inner glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(239,68,68,0.07) 0%, transparent 60%)' }} />

        {/* Scan line */}
        <div className="scan-line-about" />

        {/* Left accent bar — animated height */}
        <div className="absolute w-1 bg-gradient-to-b from-red-500 via-red-700 to-transparent left-0 top-10 rounded-r-full"
          style={{ height: visible ? '96px' : '0px', transition: 'height 0.8s cubic-bezier(.22,1,.36,1) 0.3s' }} />

        {/* Top-right corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-tr-3xl"
          style={{ background: 'radial-gradient(circle at 100% 0%, rgba(239,68,68,0.12) 0%, transparent 70%)' }} />

        <p className="text-slate-300 text-lg leading-relaxed font-light relative z-10">
          {personalData.description}
        </p>

        {/* Quick Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          {[
            { Icon: MapPin, text: personalData.address },
            { Icon: BookOpen, text: 'B.Tech CSE — LPU' },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-400 group/item px-4 py-3 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-300">
              <Icon className="w-4 h-4 text-red-500 shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Mini stats */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-around relative z-10">
          {quickStats.map(({ num, suffix, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 group/stat cursor-default">
              <span className="font-syne font-black text-2xl text-white group-hover/stat:text-red-400 transition-colors duration-300">
                <CountUp to={num} suffix={suffix} />
              </span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 group-hover/stat:text-red-400/70 transition-colors duration-300">{label}</span>
            </div>
          ))}
        </div>
      </TiltCard>
    </div>
  )
}

/* ─────────────────────────────────────────
   TRAINING CARD
───────────────────────────────────────── */
function TrainingCard({ t, delay }) {
  const [ref, visible] = useReveal(0.1)
  const [open, setOpen] = useState(false)

  return (
    <div ref={ref} className="transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(32px)', transitionDelay: `${delay}s` }}>
      <div
        className="relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden group cursor-pointer transition-all duration-400 hover:border-red-500/25 hover:bg-white/[0.035]"
        onClick={() => setOpen(o => !o)}
        style={{ boxShadow: open ? '0 0 40px rgba(239,68,68,0.08), inset 0 0 30px rgba(239,68,68,0.03)' : undefined }}
      >
        {/* Shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.025] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        {/* Top glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 55%)' }} />

        <div className="flex items-start gap-4 mb-5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:border-red-500/40 group-hover:bg-red-500/15 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300">
            <BookOpen className="text-red-500 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold font-mono mb-1">Training</p>
            <h3 className="text-white font-syne font-bold text-lg leading-snug">{t.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
              <span>{t.provider}</span>
              <span>·</span>
              <span className="text-red-500/80">{t.duration}</span>
            </div>
          </div>
          {/* Expand chevron */}
          <div className="text-slate-600 group-hover:text-red-400 transition-all duration-300 text-lg shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1), color 0.3s' }}>
            ↓
          </div>
        </div>

        {/* Details — animated expand */}
        <div style={{ maxHeight: open ? '400px' : '0px', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(.22,1,.36,1)' }}>
          <ul className="flex flex-col gap-3 relative z-10 pt-1">
            {t.details.map((d, i) => (
              <li key={i}
                className="flex gap-3 text-slate-400 text-sm leading-relaxed"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'none' : 'translateX(-10px)',
                  transition: `opacity 0.4s ease ${0.05 + i * 0.07}s, transform 0.4s ease ${0.05 + i * 0.07}s`,
                }}>
                <span className="text-red-500 mt-1 shrink-0 font-bold">→</span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Collapsed preview hint */}
        {!open && (
          <p className="text-xs text-slate-600 font-mono relative z-10 group-hover:text-slate-500 transition-colors">
            Click to expand details →
          </p>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   EDUCATION TIMELINE
───────────────────────────────────────── */
function EducationTimeline() {
  const [ref, visible] = useReveal(0.1)
  const [lineRef, lineVisible] = useReveal(0.05)

  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      {/* Heading */}
      <div ref={ref} className="flex items-center gap-3 mb-2 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(24px)', transitionDelay: '0.1s' }}>
        <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.1)]">
          <GraduationCap className="w-4 h-4 text-red-500" />
        </div>
        <h3 className="font-syne font-bold text-white text-lg">Education</h3>
      </div>

      <div ref={lineRef} className="relative flex flex-col gap-6">
        {/* Animated timeline line */}
        <div className="absolute left-5 top-5 w-px bg-gradient-to-b from-red-600 via-red-900/50 to-transparent rounded-full"
          style={{ height: lineVisible ? 'calc(100% - 20px)' : '0px', transition: 'height 1.2s cubic-bezier(.22,1,.36,1) 0.3s' }} />

        {educationData.map((edu, index) => (
          <EduCard key={edu.id} edu={edu} index={index} delay={0.15 + index * 0.12} />
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   EDUCATION CARD
───────────────────────────────────────── */
function EduCard({ edu, index, delay }) {
  const [ref, visible] = useReveal(0.1)
  const [hovered, setHovered] = useState(false)
  const isActive = index === 0

  return (
    <div ref={ref} className="relative flex gap-6 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(28px)', transitionDelay: `${delay}s` }}>

      {/* Timeline dot */}
      <div className="relative z-10 shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-400"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, #ef4444, #991b1b)'
              : hovered ? 'rgba(239,68,68,0.12)' : '#0c0c12',
            border: isActive
              ? '2px solid rgba(252,165,165,0.6)'
              : hovered ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(127,29,29,0.5)',
            boxShadow: isActive
              ? '0 0 20px rgba(239,68,68,0.5), 0 0 40px rgba(239,68,68,0.2)'
              : hovered ? '0 0 14px rgba(239,68,68,0.25)' : 'none',
            transform: hovered ? 'scale(1.1)' : 'none',
          }}
        >
          <GraduationCap
            className="w-4 h-4 transition-colors duration-300"
            style={{ color: isActive ? '#fff' : hovered ? '#f87171' : '#7f1d1d' }}
          />
        </div>

        {/* Pulsing ring for active */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl border-2 border-red-400/40 animate-ping-slow pointer-events-none" />
        )}
      </div>

      {/* Card */}
      <div className="flex flex-col gap-2 pb-2 flex-1">
        <div
          className="relative p-5 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-350 group"
          style={{
            borderColor: hovered ? 'rgba(239,68,68,0.28)' : undefined,
            background: hovered ? 'rgba(255,255,255,0.035)' : undefined,
            boxShadow: hovered ? '0 8px 32px rgba(239,68,68,0.08)' : undefined,
            transform: hovered ? 'translateX(4px)' : 'none',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.025] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 pointer-events-none" />

          {/* Left accent */}
          <div
            className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-red-500 to-red-900 transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          />

          <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase tracking-widest font-mono mb-2">
            <Calendar className="w-3 h-3" />
            {edu.duration}
            {index === 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[9px] border border-red-500/20 animate-pulse-subtle">
                Current
              </span>
            )}
          </div>

          <h4 className="text-white font-syne font-bold text-base leading-snug transition-colors duration-300"
            style={{ color: hovered ? '#fff' : undefined }}>{edu.degree}</h4>
          {edu.field && <p className="text-red-400/80 text-sm font-medium mt-0.5">{edu.field}</p>}
          <p className="text-slate-400 text-sm mt-1">{edu.institution}</p>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-slate-500 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{edu.location}</span>
            <span
              className="ml-auto font-mono font-bold text-sm px-2 py-0.5 rounded-lg transition-all duration-300"
              style={{
                color: hovered ? '#ef4444' : 'rgba(239,68,68,0.7)',
                background: hovered ? 'rgba(239,68,68,0.12)' : 'transparent',
              }}
            >
              {edu.score}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function About() {
  const sectionRef = useRef(null)

  return (
    <>
      <style>{`
        /* Scan line */
        @keyframes scanAbout { 0%{top:-4px} 100%{top:103%} }
        .scan-line-about { position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(239,68,68,0.15),transparent);animation:scanAbout 4s linear infinite;pointer-events:none;z-index:10; }

        /* Slow ping for active edu dot */
        @keyframes pingSlow { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
        .animate-ping-slow { animation:pingSlow 2s cubic-bezier(0,0,.2,1) infinite; }

        /* Subtle pulse for "Current" badge */
        @keyframes pulsSubtle { 0%,100%{opacity:.8} 50%{opacity:1} }
        .animate-pulse-subtle { animation:pulsSubtle 2s ease-in-out infinite; }

        /* Noise */
        .about-noise { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px; }

        /* Dot grid */
        .dot-grid { background-image:radial-gradient(rgba(239,68,68,0.07) 1px,transparent 1px);background-size:28px 28px; }

        /* Aurora */
        @keyframes auroraA { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(40px,-30px) scale(1.08)} }
        @keyframes auroraB { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,25px) scale(1.05)} }
        .aurora-about-a { animation:auroraA 14s ease-in-out infinite; }
        .aurora-about-b { animation:auroraB 18s ease-in-out infinite; }

        /* Section glow pulse */
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:.9} }
        .glow-pulse { animation:glowPulse 5s ease-in-out infinite; }
      `}</style>

      <section
        ref={sectionRef}
        id="about"
        className="relative py-24 lg:py-40 overflow-hidden"
        style={{ background: '#050508' }}
      >
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-[0.45]" />

        {/* Noise */}
        <div className="about-noise absolute inset-0 pointer-events-none opacity-[0.022]" />

        {/* Particles */}
        <AboutParticles />

        {/* Spotlight */}
        <SectionSpotlight sectionRef={sectionRef} />

        {/* Aurora blobs */}
        <div className="aurora-about-a absolute top-1/4 -left-20 w-[400px] h-[400px] bg-red-600/8 blur-[130px] rounded-full pointer-events-none glow-pulse" />
        <div className="aurora-about-b absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-red-900/8 blur-[130px] rounded-full pointer-events-none" />

        {/* Top / bottom section fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050508] to-transparent pointer-events-none z-[3]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-[3]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          <SectionHeader />

          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* LEFT — Bio + Training */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <BioCard />
              {trainingData.map((t, i) => (
                <TrainingCard key={t.id} t={t} delay={0.12 + i * 0.1} />
              ))}
            </div>

            {/* RIGHT — Education */}
            <EducationTimeline />
          </div>
        </div>
      </section>
    </>
  )
}