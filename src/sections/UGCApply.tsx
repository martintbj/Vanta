import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Send, Check } from 'lucide-react'
import { CONFIG } from '../config'

const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'Pinterest', 'LinkedIn']
const availability = ['Full-time', 'Part-time', 'Weekends', 'Project-based']
const contentTypes = ['Product Reviews', 'Unboxings', 'Tutorials', 'Lifestyle', 'Testimonials', 'Day-in-my-life', 'Before & After']

export default function UGCApply({ onClose }: { onClose: () => void }) {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    instagram: '',
    tiktok: '',
    portfolio: '',
    platforms: [] as string[],
    contentTypes: [] as string[],
    availability: '',
    experience: '',
    why: '',
    _gotcha: '',
  })

  const toggleArray = (field: 'platforms' | 'contentTypes', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form._gotcha) return

    const lastSubmit = parseInt(localStorage.getItem('vanta_ugc_submit') || '0')
    if (Date.now() - lastSubmit < 60000) {
      alert('Please wait a moment before submitting again.')
      return
    }

    setFormState('sending')

    const payload = {
      ...form,
      source: 'ugc-application',
      platforms: form.platforms.join(', '),
      contentTypes: form.contentTypes.join(', '),
      timestamp: new Date().toISOString(),
    }

    try {
      if (CONFIG.FORMSPREE_URL) {
        const res = await fetch(CONFIG.FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed')
      }

      if (CONFIG.GOOGLE_SHEET_URL) {
        fetch(CONFIG.GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {})
      }

      localStorage.setItem('vanta_ugc_submit', String(Date.now()))
      setFormState('sent')
    } catch {
      setFormState('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-[#080808] overflow-y-auto"
    >
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 sticky top-0 bg-[#080808]/90 backdrop-blur-lg z-10">
        <button onClick={onClose} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} />
          Back to site
        </button>
        <span className="text-sm tracking-[0.2em] uppercase text-white/60" style={{ fontFamily: "'Instrument Serif', serif" }}>
          <em>V</em>anta Creatives
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {formState === 'sent' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <Send size={24} className="text-gold" />
              </div>
              <h2 className="text-3xl mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Application <em>received</em>
              </h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                We review applications weekly. If you're a fit, we'll reach out within 7 days.
              </p>
              <button
                onClick={onClose}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm hover:bg-white/5 transition-colors"
              >
                Back to Vanta
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-xs tracking-[0.3em] uppercase text-gold">Waitlist Open</span>
                </div>
                <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Join our <em className="text-gold">creator network</em>
                </h1>
                <p className="text-white/70 leading-relaxed">
                  We partner with authentic creators who love making content. No follower minimums.
                  Just talent, energy, and a camera.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" name="_gotcha" value={form._gotcha}
                  onChange={e => setForm({...form, _gotcha: e.target.value})}
                  style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off"
                />

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <input type="text" required value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Your name" className="form-input" />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" required value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="you@email.com" className="form-input" />
                  </Field>
                </div>

                {/* Phone + Location */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Phone">
                    <input type="tel" value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="(optional)" className="form-input" />
                  </Field>
                  <Field label="Location">
                    <input type="text" value={form.location}
                      onChange={e => setForm({...form, location: e.target.value})}
                      placeholder="City, State" className="form-input" />
                  </Field>
                </div>

                {/* Social links */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Instagram Handle">
                    <input type="text" value={form.instagram}
                      onChange={e => setForm({...form, instagram: e.target.value})}
                      placeholder="@yourhandle" className="form-input" />
                  </Field>
                  <Field label="TikTok Handle">
                    <input type="text" value={form.tiktok}
                      onChange={e => setForm({...form, tiktok: e.target.value})}
                      placeholder="@yourhandle" className="form-input" />
                  </Field>
                </div>

                <Field label="Portfolio / Website">
                  <input type="url" value={form.portfolio}
                    onChange={e => setForm({...form, portfolio: e.target.value})}
                    placeholder="https://..." className="form-input" />
                </Field>

                {/* Platforms */}
                <Field label="Platforms You Create On">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {platforms.map(p => (
                      <ChipToggle key={p} label={p} selected={form.platforms.includes(p)}
                        onClick={() => toggleArray('platforms', p)} />
                    ))}
                  </div>
                </Field>

                {/* Content types */}
                <Field label="Content You Specialize In">
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map(c => (
                      <ChipToggle key={c} label={c} selected={form.contentTypes.includes(c)}
                        onClick={() => toggleArray('contentTypes', c)} />
                    ))}
                  </div>
                </Field>

                {/* Availability */}
                <Field label="Availability">
                  <div className="grid grid-cols-2 gap-2">
                    {availability.map(a => (
                      <ChipToggle key={a} label={a} selected={form.availability === a}
                        onClick={() => setForm({...form, availability: a})} />
                    ))}
                  </div>
                </Field>

                {/* Experience */}
                <Field label="UGC Experience">
                  <textarea rows={3} value={form.experience}
                    onChange={e => setForm({...form, experience: e.target.value})}
                    placeholder="Tell us about your experience creating content for brands..."
                    className="form-input resize-none" />
                </Field>

                {/* Why Vanta */}
                <Field label="Why Vanta?">
                  <textarea rows={3} value={form.why}
                    onChange={e => setForm({...form, why: e.target.value})}
                    placeholder="What excites you about working with us?"
                    className="form-input resize-none" />
                </Field>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-violet/25 to-gold/25 border border-violet/30 text-white font-medium hover:from-violet/35 hover:to-gold/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formState === 'sending' ? 'Submitting...' : (
                    <>Submit Application <Send size={16} /></>
                  )}
                </button>

                {formState === 'error' && (
                  <p className="text-red-400/80 text-sm text-center">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #FAF8F5;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-color: rgba(224, 165, 38, 0.4);
        }
        .form-input::placeholder {
          color: rgba(250, 248, 245, 0.2);
        }
      `}</style>
    </motion.div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-[0.15em] uppercase text-white/70 mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
    </div>
  )
}

function ChipToggle({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-sm text-left transition-all ${
        selected
          ? 'bg-gold/15 border border-gold/30 text-gold'
          : 'bg-white/3 border border-white/8 text-white/50 hover:border-white/15'
      }`}
    >
      {selected && <Check size={12} className="inline mr-1.5" />}
      {label}
    </button>
  )
}
