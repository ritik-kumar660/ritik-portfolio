import { useState, useEffect, useRef } from 'react'
import { certificationsData } from '../data/data'
import { Calendar, ExternalLink, Download, X, BadgeCheck, Award } from 'lucide-react'

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
function CertParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const DOTS = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      o: Math.random() * 0.18 + 0.05,
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
   SECTION HEADER
───────────────────────────────────────── */
function SectionHeader() {
  const [ref, visible] = useReveal(0.2)
  return (
    <div ref={ref} className="flex flex-col items-center gap-4 mb-20">
      <div className="flex items-center gap-3 text-red-500 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transitionDelay: '0.05s' }}>
        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <Award className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">Credentials</span>
      </div>

      <div className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transitionDelay: '0.12s' }}>
        <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center">
          My{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent">Certifications</span>
            <span className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-red-500 to-red-800"
              style={{ width: visible ? '100%' : '0%', transition: 'width 0.9s cubic-bezier(.22,1,.36,1) 0.55s' }} />
          </span>
        </h2>
      </div>

      <p className="text-[var(--gray,#888)] text-center max-w-xl transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: '0.2s' }}>
        Verified credentials &amp; achievements
      </p>

      <div className="flex items-center gap-3 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '0.3s' }}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50 rounded-full" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   CERT CARD
───────────────────────────────────────── */
function CertCard({ cert, index, onClick }) {
  const [ref, visible] = useReveal(0.08)
  const [hovered, setHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const cardRef = useRef(null)
  const rafRef = useRef(null)
  const target = useRef({ rx: 0, ry: 0 })
  const current = useRef({ rx: 0, ry: 0 })

  /* 3D tilt */
  const onMove = (e) => {
    const el = cardRef.current; if (!el) return
    const rect = el.getBoundingClientRect()
    target.current.rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -10
    target.current.ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10
  }
  const onLeave = () => { target.current = { rx: 0, ry: 0 }; setHovered(false) }

  useEffect(() => {
    const tick = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.1
      current.current.ry += (target.current.ry - current.current.ry) * 0.1
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(700px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const col = index % 4
  const delay = 0.06 + col * 0.09

  return (
    <div ref={ref} className="transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(36px) scale(0.96)', transitionDelay: `${delay}s` }}>
      <div
        ref={cardRef}
        className="group cursor-pointer relative rounded-2xl overflow-hidden border border-white/8 bg-white/[0.025] shadow-xl"
        style={{
          transformStyle: 'preserve-3d', willChange: 'transform',
          borderColor: hovered ? 'rgba(239,68,68,0.35)' : undefined,
          boxShadow: hovered ? '0 20px 60px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.2)' : undefined,
          transition: 'border-color 0.35s, box-shadow 0.35s',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={() => onClick(cert)}
      >
        {/* Shimmer swipe */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800 pointer-events-none" />

        {/* Top glow on hover */}
        <div className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 60%)' }} />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 100% 0%, rgba(239,68,68,0.18) 0%, transparent 70%)' }} />

        {/* Image container */}
        <div className="relative w-full h-44 overflow-hidden bg-black">
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          <img
            src={cert.image}
            alt={cert.title}
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-contain transition-all duration-500"
            style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', opacity: imgLoaded ? 1 : 0 }}
          />
          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-red-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Verified badge overlay */}
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider border border-emerald-500/30 bg-black/70 text-emerald-400 backdrop-blur-sm"
            style={{ transform: hovered ? 'translateY(0) scale(1)' : 'translateY(-4px) scale(0.9)', opacity: hovered ? 1 : 0.7, transition: 'all 0.35s cubic-bezier(.34,1.56,.64,1)' }}
          >
            <BadgeCheck className="w-3 h-3" />
            Verified
          </div>

          {/* View hint */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <div className="px-4 py-2 rounded-xl bg-black/80 border border-red-500/30 text-red-400 text-xs font-mono font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Certificate
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 relative z-10">
          <h3 className="font-syne font-bold text-white text-sm leading-snug mb-1 transition-colors duration-300"
            style={{ color: hovered ? '#fff' : undefined }}>{cert.title}</h3>
          <p className="text-slate-400 text-xs mb-3">{cert.issuer}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-red-400/80 text-[11px] font-mono">
              <Calendar className="w-3 h-3" />
              {cert.date}
            </div>
            <div
              className="flex items-center gap-1 text-emerald-400 text-[11px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 transition-all duration-300"
              style={{ borderColor: hovered ? 'rgba(34,197,94,0.35)' : undefined, background: hovered ? 'rgba(34,197,94,0.1)' : undefined }}
            >
              <BadgeCheck className="w-3 h-3" />
              Verified
            </div>
          </div>

          {/* Progress-style bottom bar */}
          <div className="mt-4 h-[2px] rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700"
              style={{ width: hovered ? '100%' : '35%', transition: 'width 0.6s cubic-bezier(.22,1,.36,1)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MODAL
───────────────────────────────────────── */
function CertModal({ cert, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20)
    const esc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a10] shadow-2xl"
        style={{
          transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(24px)',
          transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)',
          boxShadow: '0 0 0 1px rgba(239,68,68,0.15), 0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(239,68,68,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scan line */}
        <div className="modal-scan-line" />

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

        {/* Header */}
        <div className="relative px-6 py-4 border-b border-white/8 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Award className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-white text-base leading-tight">{cert.title}</h3>
              <p className="text-xs text-slate-500 font-mono">{cert.issuer}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-mono px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/8">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/25 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all duration-250 group ml-2"
            >
              <X className="w-4 h-4 text-red-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative">
          <iframe
            src={`${cert.file}#toolbar=1`}
            className="w-full bg-white"
            style={{ height: 'min(600px, 65vh)' }}
            title="Certificate"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-white/8 bg-white/[0.015]">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            {cert.date}
          </div>
          <div className="flex items-center gap-3">
            <a href={cert.file} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-250 font-mono text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              Open Full
            </a>
            <a href={cert.file} download
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-250 text-sm font-semibold shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 pointer-events-none" />
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function Certifications() {
  const [selected, setSelected] = useState(null)
  const sectionRef = useRef(null)

  return (
    <>
      <style>{`
        /* Dot grid */
        .cert-dot-grid { background-image:radial-gradient(rgba(239,68,68,0.06) 1px,transparent 1px);background-size:28px 28px; }

        /* Noise */
        .cert-noise { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px; }

        /* Aurora */
        @keyframes auroraC1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-30px) scale(1.08)} }
        @keyframes auroraC2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,25px) scale(1.06)} }
        .aurora-c1 { animation:auroraC1 13s ease-in-out infinite; }
        .aurora-c2 { animation:auroraC2 17s ease-in-out infinite; }

        /* Glow pulse */
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .glow-pulse { animation:glowPulse 5s ease-in-out infinite; }

        /* Modal scan */
        @keyframes modalScan { 0%{top:-4px} 100%{top:103%} }
        .modal-scan-line { position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(239,68,68,0.18),transparent);animation:modalScan 3.5s linear infinite;pointer-events:none;z-index:20; }

        /* Count bounce */
        @keyframes countBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      `}</style>

      <section
        ref={sectionRef}
        id="certifications"
        className="relative py-24 lg:py-40 overflow-hidden"
        style={{ background: '#050508' }}
      >
        {/* Dot grid */}
        <div className="cert-dot-grid absolute inset-0 pointer-events-none opacity-50" />

        {/* Noise */}
        <div className="cert-noise absolute inset-0 pointer-events-none opacity-[0.022]" />

        {/* Particles */}
        <CertParticles />

        {/* Spotlight */}
        <SectionSpotlight sectionRef={sectionRef} />

        {/* Aurora blobs */}
        <div className="aurora-c1 absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/8 blur-[120px] rounded-full pointer-events-none glow-pulse" />
        <div className="aurora-c2 absolute bottom-0 right-0 w-[300px] h-[300px] bg-red-900/8 blur-[100px] rounded-full pointer-events-none" />

        {/* Top / bottom fades */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050508] to-transparent pointer-events-none z-[3]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-[3]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

          <SectionHeader />

          {/* Count badge */}
          <CountBadge count={certificationsData.length} />

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {certificationsData.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} onClick={setSelected} />
            ))}
          </div>
        </div>

        {/* Modal */}
        {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
      </section>
    </>
  )
}

/* ─────────────────────────────────────────
   COUNT BADGE
───────────────────────────────────────── */
function CountBadge({ count }) {
  const [ref, visible] = useReveal(0.2)
  return (
    <div ref={ref} className="flex justify-center transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: '0.35s' }}>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        {count} Certifications Earned
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      </div>
    </div>
  )
}