import { motion } from 'framer-motion'
import { useState } from 'react'
import { Send, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { CONFIG } from '../config'

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
    _gotcha: '', // honeypot
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData._gotcha) return

    // Rate limiting
    const lastSubmit = parseInt(localStorage.getItem('vanta_last_contact') || '0')
    if (Date.now() - lastSubmit < 60000) {
      alert('Please wait a moment before submitting again.')
      return
    }

    setFormState('sending')

    const payload = {
      name: formData.name,
      email: formData.email,
      business: formData.business,
      message: formData.message,
      source: 'contact-form',
      timestamp: new Date().toISOString(),
    }

    try {
      // Send to Formspree (email notification) — primary
      if (CONFIG.FORMSPREE_URL) {
        const res = await fetch(CONFIG.FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Formspree failed')
      }

      // Send to Google Sheets (lead logging + Twilio SMS) — fire-and-forget
      if (CONFIG.GOOGLE_SHEET_URL) {
        fetch(CONFIG.GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {}) // Fail gracefully
      }

      localStorage.setItem('vanta_last_contact', String(Date.now()))
      setFormState('sent')
      setFormData({ name: '', email: '', business: '', message: '', _gotcha: '' })
    } catch {
      setFormState('error')
    }
  }

  return (
    <section id="contact" className="relative py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side — heading + info */}
          <div>
            <SectionHeading
              eyebrow="Get in Touch"
              title="Ready to"
              titleAccent="start?"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-warm-white/50 text-lg leading-relaxed">
                Tell us about your brand and where you want to go.
                We'll get back within 24 hours with a bold game plan.
              </p>

              <div className="space-y-3">
                <a
                  href={`mailto:${CONFIG.EMAIL}`}
                  className="flex items-center gap-3 text-warm-white/60 hover:text-gold transition-colors group"
                >
                  <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm">{CONFIG.EMAIL}</span>
                </a>

                {CONFIG.CALENDLY_URL && (
                  <a
                    href={CONFIG.CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-warm-white/60 hover:text-gold transition-colors group"
                  >
                    <ArrowRight size={14} className="text-gold group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Book a free strategy call</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right side — form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {formState === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-2xl p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <Send size={24} className="text-gold" />
                </div>
                <h3 className="text-2xl font-serif mb-3">Message Sent</h3>
                <p className="text-warm-white/50">
                  We'll be in touch within 24 hours. Exciting things ahead.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 md:p-10 space-y-6">
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="_gotcha"
                  value={formData._gotcha}
                  onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-wider uppercase text-warm-white/70 mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-warm-white placeholder-warm-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider uppercase text-warm-white/70 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-warm-white placeholder-warm-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-wider uppercase text-warm-white/70 mb-2 block">
                    Business
                  </label>
                  <input
                    type="text"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-warm-white placeholder-warm-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="Your brand / business name"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-wider uppercase text-warm-white/70 mb-2 block">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-warm-white placeholder-warm-white/20 focus:outline-none focus:border-gold/40 transition-colors resize-none"
                    placeholder="Tell us about your goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-violet/25 to-gold/25 border border-violet/30 text-warm-white font-medium hover:from-violet/35 hover:to-gold/35 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formState === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {formState === 'error' && (
                  <p className="text-red-400/80 text-sm text-center">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
