import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { personalData } from '../data/data'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { BsGithub, BsLinkedin } from 'react-icons/bs'
import { SiLeetcode } from 'react-icons/si'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function Contact() {
  const sectionRef = useRef(null)
  const btnRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({ email: false, required: false })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // 🔥 GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      })

      const btn = btnRef.current
      if (btn) {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2

          gsap.to(btn, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3
          })
        })

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.3 })
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ✅ SEND EMAIL
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.message) {
      setErrors({ required: true, email: false })
      return
    }

    if (!isValidEmail(form.email)) {
      setErrors({ required: false, email: true })
      return
    }

    setLoading(true)

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setErrors({ email: false, required: false })

    } catch (err) {
      console.error(err)
      alert("Failed to send ❌")
    } finally {
      setLoading(false)
    }
  }

  const infoCards = [
    { icon: Mail, value: personalData.email },
    { icon: Phone, value: personalData.phone },
    { icon: MapPin, value: personalData.address },
  ]

  const socials = [
    { Icon: BsGithub, href: personalData.github },
    { Icon: BsLinkedin, href: personalData.linkedIn },
    { Icon: SiLeetcode, href: personalData.leetcode },
  ]

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 lg:py-40 overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-500/8 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-20 fade-up">
          <div className="flex items-center gap-3 text-red-500">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.35em] font-mono">Get In Touch</span>
          </div>

          <h2 className="font-syne font-black text-4xl md:text-5xl text-white text-center">
            Let's <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">Connect</span>
          </h2>

          <p className="text-[var(--gray)] text-center max-w-xl">
            Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* FORM */}
          <div className="lg:col-span-7 fade-up">
            <div className="relative p-8 lg:p-10 rounded-3xl border border-white/6 bg-white/[0.025] shadow-2xl overflow-hidden">

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 gap-6 animate-fadeIn">

                  {/* Glow Circle */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>

                    <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center animate-scaleIn">
                      <svg className="w-12 h-12 text-green-500" viewBox="0 0 52 52">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          d="M14 27 L22 35 L38 18"
                          className="animate-check"
                        />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-green-400 text-xl font-bold animate-slideUp">
                    Message Sent Successfully 🚀
                  </h3>

                  <p className="text-gray-400 text-sm">
                    I’ll get back to you soon.
                  </p>
                  <button onClick={() => setSent(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition text-white font-semibold">
                    Send Another Message</button>
                  

                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                  />

                  <input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none"
                  />

                  <textarea
                    rows={5}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none resize-none"
                  />

                  {errors.required && <p className="text-red-400 text-sm">All fields are required</p>}
                  {errors.email && <p className="text-red-400 text-sm">Invalid email format</p>}

                  <button
                    ref={btnRef}
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-red-600 to-red-800 py-4 text-white font-bold"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                </form>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-5 flex flex-col gap-10 fade-up text-white">

            <div>
              <h3 className="text-lg mb-4">Direct Contact</h3>
              {infoCards.map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-center gap-3 mb-3">
                  <Icon />
                  {value}
                </div>
              ))}
            </div>

            <div>
              <h3 className="mb-3">Social Presence</h3>
              <div className="flex gap-4">
                {socials.map(({ Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="text-2xl hover:text-red-500 transition" />
                  </a>
                ))}
              </div>
            </div>

            <div className="italic">
              "Always excited to work on challenging problems and build things that make a difference."
              <br />— Ritik Kumar
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}