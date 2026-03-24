import { useState, useEffect, useRef, useCallback } from 'react'
import { personalData } from '../data/data'
import { BsGithub, BsLinkedin } from 'react-icons/bs'
import { SiLeetcode } from 'react-icons/si'
import { FaHackerrank } from 'react-icons/fa'
import { MdDownload } from 'react-icons/md'
import { RiContactsFill } from 'react-icons/ri'

const ROLES = ['Full Stack Developer', 'Problem Solver', 'AI Enthusiast', 'CS Engineer']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

/* ─────────────────────────────────────────
   MOUSE SPOTLIGHT
───────────────────────────────────────── */
function Spotlight() {
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return
      ref.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(239,68,68,0.07), transparent 50%)`
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return <div ref={ref} className="fixed inset-0 pointer-events-none z-[5] transition-none" />
}

/* ─────────────────────────────────────────
   MORPHING SVG BLOB (behind code card)
───────────────────────────────────────── */
function MorphBlob() {
  const pathRef = useRef(null)
  const t = useRef(0)
  useEffect(() => {
    let raf
    const shapes = [
      'M50,10 C80,5 95,30 90,55 C85,80 70,95 45,92 C20,89 5,72 8,47 C11,22 20,15 50,10Z',
      'M55,8 C85,10 98,35 88,62 C78,89 55,98 30,88 C5,78 2,55 12,30 C22,5 25,6 55,8Z',
      'M45,12 C75,2 100,28 92,58 C84,88 60,100 35,90 C10,80 0,58 10,32 C20,6 15,22 45,12Z',
      'M52,6 C82,8 96,32 90,60 C84,88 62,100 36,88 C10,76 4,52 14,28 C24,4 22,4 52,6Z',
    ]
    const tick = () => {
      t.current += 0.003
      const i = Math.floor(t.current) % shapes.length
      const j = (i + 1) % shapes.length
      const frac = t.current - Math.floor(t.current)
      if (pathRef.current) {
        pathRef.current.setAttribute('d', frac < 0.5 ? shapes[i] : shapes[j])
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0">
      <svg viewBox="0 0 100 100" className="w-[520px] h-[520px] opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
        </defs>
        <path ref={pathRef} fill="url(#blobGrad)"
          style={{ transition: 'd 1.2s ease-in-out, transform 0.1s' }} />
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────
   ADVANCED PARTICLE SYSTEM
───────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    window.addEventListener('mousemove', onMouse)
    const DOTS = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      hue: Math.random() > 0.7 ? 'rgba(251,113,133,' : 'rgba(239,68,68,',
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x, my = mouseRef.current.y
      DOTS.forEach(d => {
        const dx = d.x - mx, dy = d.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) { const f = (120 - dist) / 120; d.vx += (dx / dist) * f * 0.6; d.vy += (dy / dist) * f * 0.6 }
        d.vx *= 0.98; d.vy *= 0.98; d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = canvas.width; if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height; if (d.y > canvas.height) d.y = 0
        const alpha = 0.15 + (dist < 120 ? (1 - dist / 120) * 0.5 : 0)
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r + (dist < 120 ? (1 - dist / 120) * 1.5 : 0), 0, Math.PI * 2)
        ctx.fillStyle = `${d.hue}${alpha})`; ctx.fill()
      })
      for (let i = 0; i < DOTS.length; i++) for (let j = i + 1; j < DOTS.length; j++) {
        const dx = DOTS[i].x - DOTS[j].x, dy = DOTS[i].y - DOTS[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 110) {
          ctx.beginPath(); ctx.moveTo(DOTS[i].x, DOTS[i].y); ctx.lineTo(DOTS[j].x, DOTS[j].y)
          ctx.strokeStyle = `rgba(239,68,68,${0.09 * (1 - dist / 110)})`; ctx.lineWidth = 0.7; ctx.stroke()
        }
      }
      DOTS.forEach(d => {
        const dx = d.x - mx, dy = d.y - my, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(239,68,68,${0.12 * (1 - dist / 160)})`; ctx.lineWidth = 0.5; ctx.stroke()
        }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
}

/* ─────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────── */
function TiltCard({ children }) {
  const ref = useRef(null)
  const raf = useRef(null)
  const target = useRef({ rx: 0, ry: 0 })
  const current = useRef({ rx: 0, ry: 0 })
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    target.current.rx = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -18
    target.current.ry = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 18
  }, [])
  const onLeave = useCallback(() => { target.current = { rx: 0, ry: 0 } }, [])
  useEffect(() => {
    const tick = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.1
      current.current.ry += (target.current.ry - current.current.ry) * 0.1
      if (ref.current) ref.current.style.transform = `perspective(800px) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg) scale(1.02)`
      raf.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf.current)
  }, [])
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className="relative w-full max-w-[500px]" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
function MagneticBtn({ children, className, onClick, href, target: t, rel }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.35}px, ${(e.clientY - rect.top - rect.height / 2) * 0.35}px) scale(1.06)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
  const props = { ref, onMouseMove: onMove, onMouseLeave: onLeave, className, style: { transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1)' } }
  return href ? <a {...props} href={href} target={t} rel={rel}>{children}</a> : <button {...props} onClick={onClick}>{children}</button>
}

/* ─────────────────────────────────────────
   TEXT SCRAMBLE ON HOVER
───────────────────────────────────────── */
function ScrambleName({ text }) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef(null)
  const iterRef = useRef(0)

  const scramble = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    iterRef.current = 0
    const len = text.length
    const tick = () => {
      iterRef.current += 0.5
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        if (i < iterRef.current) return ch
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join(''))
      if (iterRef.current < len) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(text)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [text])

  return (
    <span
      className="relative inline-block bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent font-syne font-black tracking-tight select-none"
      onMouseEnter={scramble}
      style={{ fontVariantNumeric: 'tabular-nums', minWidth: '100%' }}
    >
      {display}
    </span>
  )
}

/* ─────────────────────────────────────────
   GLITCH NAME WRAPPER
───────────────────────────────────────── */
function GlitchName({ text }) {
  return (
    <span className="relative inline-block">
      <ScrambleName text={text} />
      <span aria-hidden className="glitch-a absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-transparent font-syne font-black">{text}</span>
      <span aria-hidden className="glitch-b absolute inset-0 bg-gradient-to-r from-rose-400 via-red-500 to-red-800 bg-clip-text text-transparent font-syne font-black">{text}</span>
    </span>
  )
}

/* ─────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      const num = parseInt(target), start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1600, 1), ease = 1 - Math.pow(1 - p, 4)
        setVal(Math.floor(ease * num))
        if (p < 1) requestAnimationFrame(tick); else setVal(num)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─────────────────────────────────────────
   SPLIT TEXT REVEAL
───────────────────────────────────────── */
function SplitReveal({ text, delay = 0 }) {
  return (
    <span aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="split-char inline-block" style={{ animationDelay: `${delay + i * 0.035}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

/* ─────────────────────────────────────────
   NOISE OVERLAY
───────────────────────────────────────── */
function Noise() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
  )
}

/* ─────────────────────────────────────────
   LIVE CLOCK BADGE
───────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/3 text-[10px] font-mono text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      IST {time}
    </div>
  )
}

/* ─────────────────────────────────────────
   SKILL PILLS
───────────────────────────────────────── */
const SKILLS = ['React', 'Node.js', 'MongoDB', 'TypeScript', 'TailwindCSS', 'Python']
function SkillPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {SKILLS.map((s, i) => (
        <span
          key={s}
          className="skill-pill px-3 py-1 rounded-full text-[11px] font-mono font-medium border border-red-500/15 bg-red-500/5 text-red-300/80 hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-300 transition-all duration-300 hover:-translate-y-1"
          style={{ animationDelay: `${0.6 + i * 0.07}s` }}
        >
          {s}
        </span>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [ripples, setRipples] = useState([])

  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t) }, [])
  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h)
  }, [])
  useEffect(() => {
    const current = ROLES[roleIndex]; let timeout
    if (!isDeleting && charIndex <= current.length) { setDisplayed(current.slice(0, charIndex)); timeout = setTimeout(() => setCharIndex(c => c + 1), 80) }
    else if (!isDeleting && charIndex > current.length) { timeout = setTimeout(() => setIsDeleting(true), 2000) }
    else if (isDeleting && charIndex >= 0) { setDisplayed(current.slice(0, charIndex)); timeout = setTimeout(() => setCharIndex(c => c - 1), 45) }
    else { setIsDeleting(false); setCharIndex(0); setRoleIndex(r => (r + 1) % ROLES.length) }
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect(), id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700)
  }

  return (
    <>
      <Spotlight />

      <style>{`
        /* Aurora */
        @keyframes auroraMove1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,50px) scale(.95)}}
        @keyframes auroraMove2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-50px,30px) scale(1.08)}70%{transform:translate(40px,-20px) scale(.97)}}
        .aurora-1{animation:auroraMove1 12s ease-in-out infinite}
        .aurora-2{animation:auroraMove2 15s ease-in-out infinite}

        /* Split char */
        @keyframes charDrop{0%{opacity:0;transform:translateY(-24px) rotateX(-60deg)}100%{opacity:1;transform:none}}
        .split-char{opacity:0;animation:charDrop .55s cubic-bezier(.22,1,.36,1) forwards}

        /* Glitch */
        @keyframes glitchA{0%,88%,100%{opacity:0;clip-path:none;transform:none}89%{opacity:.75;clip-path:inset(25% 0 55% 0);transform:translate(-4px,2px) skewX(-2deg)}91%{clip-path:inset(65% 0 8% 0);transform:translate(4px,-1px)}93%{clip-path:inset(10% 0 72% 0);transform:translate(-3px,3px) skewX(2deg)}95%{opacity:0}}
        @keyframes glitchB{0%,91%,100%{opacity:0;clip-path:none;transform:none}92%{opacity:.55;clip-path:inset(48% 0 22% 0);transform:translate(5px,0) skewX(3deg);filter:hue-rotate(20deg)}95%{clip-path:inset(18% 0 63% 0);transform:translate(-4px,2px)}97%{opacity:0}}
        .glitch-a{animation:glitchA 4.5s infinite}
        .glitch-b{animation:glitchB 4.5s infinite .08s}

        /* Reveal */
        .hr{opacity:0;transform:translateY(30px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
        .hr.in{opacity:1;transform:none}
        .hrr{opacity:0;transform:translateX(50px) scale(.96);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
        .hrr.in{opacity:1;transform:none}

        /* Float */
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
        .float-card{animation:floatY 5s ease-in-out infinite}

        /* Scan */
        @keyframes scan{0%{top:-4px}100%{top:103%}}
        .scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(239,68,68,.2),transparent);animation:scan 3.5s linear infinite;pointer-events:none;z-index:10}

        /* Badge shimmer */
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .badge-shimmer{background:linear-gradient(90deg,rgba(239,68,68,.1) 0%,rgba(239,68,68,.3) 40%,rgba(239,68,68,.1) 100%);background-size:200% auto;animation:shimmer 2.6s linear infinite}

        /* Cursor blink */
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .cursor-blink{animation:blink 1s step-end infinite}

        /* Scroll pulse */
        @keyframes scrollPulse{0%,100%{opacity:.3;transform:scaleY(.5) translateX(-50%)}50%{opacity:1;transform:scaleY(1) translateX(-50%)}}
        .scroll-bar{animation:scrollPulse 2s ease-in-out infinite;transform-origin:top}

        /* Glow pulse */
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(239,68,68,.3)}50%{box-shadow:0 0 50px rgba(239,68,68,.6),0 0 80px rgba(239,68,68,.2)}}
        .btn-glow{animation:glowPulse 2.4s ease-in-out infinite}

        /* Ripple */
        @keyframes rippleOut{0%{transform:scale(0);opacity:.4}100%{transform:scale(4);opacity:0}}
        .ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,.25);width:60px;height:60px;margin:-30px;animation:rippleOut .7s ease-out forwards;pointer-events:none}

        /* Code line */
        .code-line{transition:background .2s;border-radius:6px;padding:0 4px}
        .code-line:hover{background:rgba(239,68,68,.09)}

        /* Social */
        .social-icon{transition:transform .3s cubic-bezier(.34,1.56,.64,1),border-color .25s,background .25s,color .25s,box-shadow .25s}
        .social-icon:hover{transform:translateY(-7px) scale(1.22);box-shadow:0 12px 28px rgba(239,68,68,.25)}

        /* Stats */
        @keyframes numPop{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
        .stat-item:hover .stat-num{animation:numPop .4s ease}
        .stat-item:hover .stat-label{color:#f87171}
        .stat-label{transition:color .3s}

        /* Grid shift */
        @keyframes gridShift{0%{background-position:0 0}100%{background-position:80px 80px}}
        .grid-bg{animation:gridShift 12s linear infinite}

        /* Role glow */
        @keyframes roleGlow{0%,100%{text-shadow:0 0 8px rgba(239,68,68,.3)}50%{text-shadow:0 0 22px rgba(239,68,68,.7)}}
        .role-text{animation:roleGlow 2s ease-in-out infinite}

        /* Card hover */
        .code-card{transition:box-shadow .4s}
        .code-card:hover{box-shadow:0 0 0 1px rgba(239,68,68,.25),0 32px 80px rgba(0,0,0,.6),0 0 60px rgba(239,68,68,.08)}

        /* LPU underline */
        .lpu-link{position:relative;display:inline-block}
        .lpu-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:linear-gradient(90deg,#ef4444,#991b1b);transition:width .5s cubic-bezier(.22,1,.36,1);border-radius:9px}
        .lpu-link:hover::after{width:100%}

        /* Availability ping */
        @keyframes ping2{75%,100%{transform:scale(2);opacity:0}}
        .ping2{animation:ping2 1.4s cubic-bezier(0,0,.2,1) infinite}

        /* Skill pills stagger in */
        @keyframes pillIn{0%{opacity:0;transform:translateY(10px) scale(.9)}100%{opacity:1;transform:none}}
        .skill-pill{opacity:0;animation:pillIn .5s cubic-bezier(.22,1,.36,1) forwards}

        /* Horizontal scroll ticker */
        @keyframes tickerMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ticker-inner{animation:tickerMove 18s linear infinite;white-space:nowrap;display:inline-flex;gap:2rem}
        .ticker-wrap:hover .ticker-inner{animation-play-state:paused}

        /* Card corner glow on hover */
        .card-corner{position:absolute;width:60px;height:60px;pointer-events:none;opacity:0;transition:opacity .4s}
        .code-card:hover .card-corner{opacity:1}
        .card-corner-tl{top:0;left:0;background:radial-gradient(circle at 0 0,rgba(239,68,68,.25),transparent 70%)}
        .card-corner-br{bottom:0;right:0;background:radial-gradient(circle at 100% 100%,rgba(239,68,68,.2),transparent 70%)}
      `}</style>

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ background: '#050508' }}>
        <Noise />

        {/* Aurora */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="aurora-1 absolute w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle,#ef4444 0%,transparent 70%)', top: '-10%', left: '-5%' }} />
          <div className="aurora-2 absolute w-[500px] h-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle,#dc2626 0%,transparent 70%)', bottom: '-5%', right: '5%' }} />
        </div>

        <ParticleField />

        {/* Animated grid */}
        <div className="grid-bg absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        {/* Parallax blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-red-700/10 blur-[130px] rounded-full pointer-events-none transition-transform duration-700"
          style={{ transform: `translate(${(mousePos.x - 0.5) * 40}px,${(mousePos.y - 0.5) * 25}px)` }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-900/10 blur-[160px] rounded-full pointer-events-none transition-transform duration-700"
          style={{ transform: `translate(${(mousePos.x - 0.5) * -30}px,${(mousePos.y - 0.5) * -20}px)` }} />

        {/* ── MAIN GRID ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-16">

          {/* LEFT */}
          <div className="flex flex-col gap-7">

            {/* Top row: badge + live clock */}
            <div className={`hr${mounted ? ' in' : ''} flex items-center gap-3 flex-wrap`} style={{ transitionDelay: '0.05s' }}>
              <span className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-red-500/25 badge-shimmer text-red-400 text-xs font-semibold tracking-[0.3em] uppercase">
                <span className="relative inline-flex">
                  <span className="ping2 absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-red-500" />
                </span>
                Available for Opportunities
              </span>
              <LiveClock />
            </div>

            {/* Heading */}
            <div className={`hr${mounted ? ' in' : ''} flex flex-col gap-2`} style={{ transitionDelay: '0.12s' }}>
              <h1 className="font-syne font-black leading-[1.05]">
                <span className="block text-5xl md:text-6xl lg:text-7xl text-white overflow-hidden">
                  <SplitReveal text="Hi, I'm" delay={0.2} />
                </span>
                <span className="block text-5xl md:text-6xl lg:text-7xl overflow-hidden">
                  <GlitchName text="Ritik Kumar" />
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-transparent rounded-full" />
                <p className="font-mono text-lg md:text-xl text-white/80 font-medium role-text">
                  {displayed}<span className="cursor-blink text-red-500 ml-0.5">|</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <p className={`hr${mounted ? ' in' : ''} text-[var(--gray,#888)] text-base md:text-lg leading-relaxed max-w-xl font-light`} style={{ transitionDelay: '0.22s' }}>
              MERN Stack Developer <span className="lpu-link text-white font-medium"></span>, building
              AI-powered full stack apps. Passionate about clean code, great UX, and solving real-world problems.
            </p>

            {/* Skill pills */}
            <div className={`hr${mounted ? ' in' : ''}`} style={{ transitionDelay: '0.28s' }}>
              <SkillPills />
            </div>

            {/* Socials */}
            <div className={`hr${mounted ? ' in' : ''} flex items-center gap-3`} style={{ transitionDelay: '0.35s' }}>
              {[
                { href: personalData.github, Icon: BsGithub, label: 'GitHub' },
                { href: personalData.linkedIn, Icon: BsLinkedin, label: 'LinkedIn' },
                { href: personalData.leetcode, Icon: SiLeetcode, label: 'LeetCode' },
                { href: personalData.hackerrank, Icon: FaHackerrank, label: 'HackerRank' },
              ].map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" title={label}
                  className="social-icon p-3 rounded-xl border border-white/8 bg-white/3 text-[var(--gray,#888)] hover:text-white hover:border-red-500/40 hover:bg-red-500/8">
                  <Icon size={20} />
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div className={`hr${mounted ? ' in' : ''} flex flex-wrap gap-4`} style={{ transitionDelay: '0.42s' }}>
              <MagneticBtn
                onClick={(e) => { addRipple(e); scrollTo('contact') }}
                className="group btn-glow relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold text-sm uppercase tracking-wider overflow-hidden transition-all active:scale-95"
              >
                {ripples.map(r => <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />)}
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Let's Connect <RiContactsFill size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </MagneticBtn>
              <MagneticBtn href={personalData.resume} target="_blank" rel="noreferrer"
                className="group relative px-8 py-4 rounded-2xl border border-white/10 bg-white/3 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/8 hover:border-red-500/40 flex items-center gap-2 overflow-hidden transition-all">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">Resume <MdDownload size={18} className="group-hover:translate-y-1 transition-transform" /></span>
              </MagneticBtn>
            </div>

            {/* Stats */}
            <div className={`hr${mounted ? ' in' : ''} flex items-center gap-8 pt-2`} style={{ transitionDelay: '0.52s' }}>
              {[
                { num: '3', suffix: '+', label: 'Projects' },
                { num: '200', suffix: '+', label: 'DSA Solved' },
                { num: '5', suffix: '★', label: 'HackerRank' },
              ].map(({ num, suffix, label }) => (
                <div key={label} className="stat-item flex flex-col group cursor-default">
                  <span className="stat-num font-syne font-black text-2xl text-white"><Counter target={num} suffix={suffix} /></span>
                  <span className="stat-label text-[10px] text-[var(--gray,#888)] uppercase tracking-widest font-medium">{label}</span>
                </div>
              ))}
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />
            </div>
          </div>

          {/* RIGHT — 3D Code Card */}
          <div
            className={`hrr${mounted ? ' in' : ''} flex justify-center`}
            style={{
              transitionDelay: '0.3s',
              transform: mounted ? `translate(${(mousePos.x - 0.5) * -18}px,${(mousePos.y - 0.5) * -12}px)` : 'translateX(50px) scale(.96)',
              transition: 'transform 0.6s ease-out,opacity 0.85s cubic-bezier(.22,1,.36,1)',
            }}
          >
            <TiltCard>
              <div className="float-card">
                {/* Morphing blob behind card */}
                <MorphBlob />

                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-red-600/18 via-transparent to-red-900/12 blur-2xl pointer-events-none" />

                <div className="code-card relative rounded-3xl border border-white/10 bg-[#080810]/95 backdrop-blur-xl overflow-hidden shadow-2xl group" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Corner glows */}
                  <div className="card-corner card-corner-tl rounded-tl-3xl" />
                  <div className="card-corner card-corner-br rounded-br-3xl" />
                  <div className="scan-line" />
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(239,68,68,.07) 0%,transparent 60%)' }} />

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-2">
                      {['bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.8)]', 'bg-red-400/40', 'bg-red-300/15'].map((cls, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${cls} transition-transform duration-200 hover:scale-125`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[var(--gray,#888)] text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />portfolio.js
                    </div>
                  </div>

                  {/* Code */}
                  <div className="p-7 font-mono text-sm leading-8 select-none">
                    {[
                      { n:'1', el:<p><span className="text-red-400">const</span> <span className="text-white">developer</span> <span className="text-red-300">=</span> {'{'}</p> },
                      { n:'2', el:<p className="ml-5"><span className="text-slate-300">name:</span> <span className="text-emerald-400">'Ritik Kumar'</span>,</p> },
                      { n:'3', el:<p className="ml-5"><span className="text-slate-300">university:</span> <span className="text-emerald-400">'LPU'</span>,</p> },
                      { n:'4', el:<p className="ml-5"><span className="text-slate-300">stack:</span> [<span className="text-emerald-400">'React'</span>, <span className="text-emerald-400">'Node'</span>, <span className="text-emerald-400">'MongoDB'</span>],</p> },
                      { n:'5', el:<p className="ml-5"><span className="text-slate-300">dsa:</span> <span className="text-red-400">200</span><span className="text-slate-300">+</span> <span className="text-slate-500">// problems solved</span></p> },
                      { n:'6', el:<p className="ml-5"><span className="text-slate-300">passion:</span> <span className="text-red-400">true</span>,</p> },
                      { n:'7', el:<p className="ml-5"><span className="text-slate-300">motto:</span> <span className="text-emerald-400">"Build. Learn. Repeat."</span></p> },
                      { n:'8', el:<p>{'}'}</p> },
                      { n:'9', el:<p className="mt-3"><span className="text-red-400">developer</span>.<span className="text-white">init</span><span className="text-slate-300">()</span></p> },
                    ].map(({ n, el }) => (
                      <div key={n} className="code-line flex gap-4 text-slate-600 text-xs">
                        <span className="select-none w-3 shrink-0 text-right">{n}</span>{el}
                      </div>
                    ))}
                  </div>

                  {/* Status bar */}
                  <div className="px-6 py-3 border-t border-white/5 bg-white/[0.015] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono"><span className="text-emerald-500">✓</span> No errors</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />JavaScript
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 flex flex-col items-center gap-1 text-[var(--gray,#888)]" style={{ transform: 'translateX(-50%)' }}>
          <div className="scroll-bar w-0.5 h-12 bg-gradient-to-b from-red-500/70 to-transparent rounded-full origin-top" />
        </div>
      </section>
    </>
  )
}