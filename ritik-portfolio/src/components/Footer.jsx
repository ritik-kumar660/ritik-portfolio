import { useState, useEffect, useRef } from 'react'
import { personalData } from '../data/data'
import { BsGithub, BsLinkedin } from 'react-icons/bs'
import { SiLeetcode } from 'react-icons/si'
import { Mail, Heart, ArrowUp, MapPin, Phone } from 'lucide-react'

const navLinks = [
  { label: 'Home',           href: '#home' },
  { label: 'About',          href: '#about' },
  { label: 'Skills',         href: '#skills' },
  { label: 'Projects',       href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Achievements',   href: '#achievements' },
  { label: 'Resume',         href: '#resume' },
  { label: 'Contact',        href: '#contact' },
]

/* ─────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────── */
function useReveal(threshold = 0.1) {
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
   FLOATING PARTICLES
───────────────────────────────────────── */
function FooterParticles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const DOTS = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.0 + 0.3, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      o: Math.random() * 0.14 + 0.04,
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
   SPOTLIGHT
───────────────────────────────────────── */
function FooterSpotlight({ footerRef }) {
  const spotRef = useRef(null)
  useEffect(() => {
    const h = (e) => {
      if (!spotRef.current || !footerRef.current) return
      const rect = footerRef.current.getBoundingClientRect()
      spotRef.current.style.background = `radial-gradient(400px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(239,68,68,0.05), transparent 50%)`
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [footerRef])
  return <div ref={spotRef} className="absolute inset-0 pointer-events-none z-[2]" />
}

/* ─────────────────────────────────────────
   MAGNETIC SOCIAL ICON
───────────────────────────────────────── */
function MagneticIcon({ Icon, href, color, label }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.4
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.4
    el.style.transform = `translate(${dx}px,${dy}px) scale(1.15)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; setHovered(false) }
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="relative p-2.5 rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden"
      style={{
        transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), border-color 0.3s, box-shadow 0.3s',
        borderColor: hovered ? `${color}50` : undefined,
        boxShadow: hovered ? `0 8px 24px ${color}30` : undefined,
        background: hovered ? `${color}12` : undefined,
      }}
    >
      {/* Shimmer */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none transition-transform duration-600 ${hovered ? 'translate-x-full' : '-translate-x-full'}`} />
      <Icon size={16} style={{ color: hovered ? color : '#888', transition: 'color 0.25s', filter: hovered ? `drop-shadow(0 0 6px ${color}80)` : 'none' }} />
    </a>
  )
}

/* ─────────────────────────────────────────
   NAV LINK
───────────────────────────────────────── */
function NavLink({ label, href, delay, visible }) {
  const [hov, setHov] = useState(false)
  const scrollTo = () => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <button
      onClick={scrollTo}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="text-left text-sm font-mono relative overflow-hidden group transition-all duration-700"
      style={{
        color: hov ? '#f87171' : '#666',
        transition: 'color 0.25s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(12px)',
        transitionDelay: `${delay}s`,
      }}
    >
      {/* Underline */}
      <span className="absolute bottom-0 left-0 h-[1px] rounded-full bg-gradient-to-r from-red-500 to-red-700"
        style={{ width: hov ? '100%' : '0%', transition: 'width 0.35s cubic-bezier(.22,1,.36,1)' }} />
      <span style={{ transform: hov ? 'translateX(4px)' : 'none', display: 'inline-block', transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)' }}>
        {label}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────
   BACK TO TOP BUTTON
───────────────────────────────────────── */
function BackToTop() {
  const [show, setShow] = useState(false)
  const [hov, setHov] = useState(false)
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-2xl border border-red-500/30 bg-[#0a0a10] flex items-center justify-center overflow-hidden group"
      style={{
        boxShadow: hov ? '0 0 30px rgba(239,68,68,0.4)' : '0 0 16px rgba(239,68,68,0.15)',
        borderColor: hov ? 'rgba(239,68,68,0.6)' : undefined,
        transition: 'box-shadow 0.3s, border-color 0.3s',
        animation: 'btt-in 0.4s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/0 to-red-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <ArrowUp
        size={16}
        className="text-red-400 relative z-10 transition-transform duration-300"
        style={{ transform: hov ? 'translateY(-2px)' : 'none' }}
      />
    </button>
  )
}

/* ─────────────────────────────────────────
   ANIMATED LOGO
───────────────────────────────────────── */
function Logo({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="font-syne font-black text-2xl tracking-tight text-left relative"
    >
      <span className="text-white transition-all duration-300" style={{ textShadow: hov ? '0 0 20px rgba(255,255,255,0.3)' : 'none' }}>RK</span>
      <span
        className="transition-all duration-300"
        style={{
          color: '#ef4444',
          textShadow: hov ? '0 0 20px rgba(239,68,68,0.8)' : '0 0 8px rgba(239,68,68,0.3)',
        }}
      >.</span>
      {/* Underline sweep */}
      <span className="absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-gradient-to-r from-red-500 to-red-800"
        style={{ width: hov ? '100%' : '0%', transition: 'width 0.4s cubic-bezier(.22,1,.36,1)' }} />
    </button>
  )
}

/* ─────────────────────────────────────────
   CONTACT ROW
───────────────────────────────────────── */
function ContactRow({ icon: Icon, text, href, delay, visible }) {
  const [hov, setHov] = useState(false)
  const el = href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center gap-2.5 text-sm font-mono group transition-all duration-700"
      style={{ color: hov ? '#f87171' : '#666', transition: 'color 0.25s', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transitionDelay: `${delay}s` }}>
      <Icon size={13} className="text-red-500 shrink-0" style={{ filter: hov ? 'drop-shadow(0 0 5px rgba(239,68,68,0.7))' : 'none', transition: 'filter 0.25s' }} />
      <span className="truncate" style={{ transform: hov ? 'translateX(3px)' : 'none', display: 'inline-block', transition: 'transform 0.25s cubic-bezier(.34,1.56,.64,1)' }}>{text}</span>
    </a>
  ) : (
    <div className="flex items-center gap-2.5 text-sm font-mono transition-all duration-700"
      style={{ color: '#555', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transitionDelay: `${delay}s` }}>
      <Icon size={13} className="text-red-500/60 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  )
  return el
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function Footer() {
  const footerRef = useRef(null)
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  const [brandRef, brandVisible] = useReveal(0.1)
  const [navRef, navVisible] = useReveal(0.1)
  const [contactRef, contactVisible] = useReveal(0.1)
  const [bottomRef, bottomVisible] = useReveal(0.05)

  return (
    <>
      <style>{`
        /* Grid bg */
        .footer-grid { background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:60px 60px; }

        /* Noise */
        .footer-noise { background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-repeat:repeat;background-size:128px; }

        /* Aurora */
        @keyframes auroraF1 { 0%,100%{transform:translate(-50%,0) scale(1)} 50%{transform:translate(-50%,-20px) scale(1.06)} }
        .aurora-footer { animation:auroraF1 12s ease-in-out infinite; }

        /* Back to top btn entry */
        @keyframes btt-in { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:none} }

        /* Heart beat */
        @keyframes heartBeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.2)} 56%{transform:scale(1)} }
        .heart-beat { animation:heartBeat 1.6s ease-in-out infinite; }

        /* Bottom bar line grow */
        @keyframes lineGrow { 0%{width:0} 100%{width:100%} }
        .line-grow { animation:lineGrow 1.2s cubic-bezier(.22,1,.36,1) forwards; }

        /* Glow pulse */
        @keyframes glowP { 0%,100%{opacity:.5} 50%{opacity:1} }
        .glow-p { animation:glowP 5s ease-in-out infinite; }
      `}</style>

      <BackToTop />

      <footer
        ref={footerRef}
        className="relative border-t border-white/5 overflow-hidden"
        style={{ background: '#040406' }}
      >
        {/* Grid */}
        <div className="footer-grid absolute inset-0 pointer-events-none opacity-70" />

        {/* Noise */}
        <div className="footer-noise absolute inset-0 pointer-events-none opacity-[0.02]" />

        {/* Particles */}
        <FooterParticles />

        {/* Spotlight */}
        <FooterSpotlight footerRef={footerRef} />

        {/* Aurora top glow */}
        <div className="aurora-footer absolute top-0 left-1/2 w-[600px] h-[200px] bg-red-600/6 blur-[100px] rounded-full pointer-events-none glow-p" />

        {/* Top gradient border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

            {/* ── Brand ── */}
            <div ref={brandRef} className="flex flex-col gap-5">
              <div className="transition-all duration-700"
                style={{ opacity: brandVisible ? 1 : 0, transform: brandVisible ? 'none' : 'translateY(20px)', transitionDelay: '0.05s' }}>
                <Logo onClick={() => scrollTo('#home')} />
              </div>

              <p className="text-sm leading-relaxed max-w-xs font-mono transition-all duration-700"
                style={{ color: '#555', opacity: brandVisible ? 1 : 0, transform: brandVisible ? 'none' : 'translateY(16px)', transitionDelay: '0.12s' }}>
                Full Stack Developer &amp; CS Engineer building AI-powered, high-performance web applications.
              </p>

              {/* Social icons */}
              <div className="flex gap-2.5 transition-all duration-700"
                style={{ opacity: brandVisible ? 1 : 0, transform: brandVisible ? 'none' : 'translateY(14px)', transitionDelay: '0.2s' }}>
                <MagneticIcon Icon={BsGithub}   href={personalData.github}           color="#ffffff" label="GitHub"   />
                <MagneticIcon Icon={BsLinkedin}  href={personalData.linkedIn}         color="#0077b5" label="LinkedIn" />
                <MagneticIcon Icon={SiLeetcode}  href={personalData.leetcode}         color="#f89820" label="LeetCode" />
                <MagneticIcon Icon={Mail}        href={`mailto:${personalData.email}`} color="#e63030" label="Email"    />
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 bg-white/[0.02] w-fit transition-all duration-700"
                style={{ opacity: brandVisible ? 1 : 0, transitionDelay: '0.28s' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-mono text-emerald-400/80">Open to opportunities</span>
              </div>
            </div>

            {/* ── Navigation ── */}
            <div ref={navRef}>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.3em] font-mono mb-6 transition-all duration-700"
                style={{ opacity: navVisible ? 0.5 : 0, transform: navVisible ? 'none' : 'translateY(12px)', transitionDelay: '0.05s' }}>
                Navigation
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                {navLinks.map((link, i) => (
                  <NavLink key={link.href} label={link.label} href={link.href}
                    delay={0.07 + i * 0.04} visible={navVisible} />
                ))}
              </div>
            </div>

            {/* ── Contact ── */}
            <div ref={contactRef}>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.3em] font-mono mb-6 transition-all duration-700"
                style={{ opacity: contactVisible ? 0.5 : 0, transform: contactVisible ? 'none' : 'translateY(12px)', transitionDelay: '0.05s' }}>
                Contact
              </h4>
              <div className="flex flex-col gap-4">
                <ContactRow icon={Mail}   text={personalData.email}   href={`mailto:${personalData.email}`} delay={0.1}  visible={contactVisible} />
                <ContactRow icon={Phone}  text={personalData.phone}   href={`tel:${personalData.phone}`}   delay={0.16} visible={contactVisible} />
                <ContactRow icon={MapPin} text={personalData.address} href={null}                           delay={0.22} visible={contactVisible} />
              </div>

              {/* CTA nudge */}
              <div className="mt-6 transition-all duration-700"
                style={{ opacity: contactVisible ? 1 : 0, transform: contactVisible ? 'none' : 'translateY(12px)', transitionDelay: '0.3s' }}>
                <button
                  onClick={() => scrollTo('#contact')}
                  className="group relative px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider overflow-hidden hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Get in touch
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div ref={bottomRef}>
            {/* Divider with animated line */}
            <div className="mt-14 mb-8 h-px relative overflow-hidden rounded-full bg-white/[0.04]">
              {bottomVisible && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/25 to-transparent line-grow rounded-full" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700"
              style={{ opacity: bottomVisible ? 1 : 0, transitionDelay: '0.15s' }}>

              <p className="text-[11px] font-mono" style={{ color: '#444' }}>
                &copy; {new Date().getFullYear()} Ritik Kumar. All rights reserved.
              </p>

              {/* Center: nav dots */}
              <div className="hidden sm:flex items-center gap-2">
                {['home','skills','projects','contact'].map((id) => (
                  <button key={id} onClick={() => scrollTo(`#${id}`)}
                    className="w-1 h-1 rounded-full bg-white/15 hover:bg-red-500 hover:scale-150 transition-all duration-250"
                    title={id} />
                ))}
              </div>

              <p className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: '#444' }}>
                Made with{' '}
                <Heart size={11} className="heart-beat fill-red-500 text-red-500" />
                {' '}in India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}