import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, Calendar, Check } from 'lucide-react'
import { CONFIG } from '../config'

const steps = [
  { title: 'About You', fields: ['name', 'email', 'phone'] },
  { title: 'Your Business', fields: ['business', 'industry', 'revenue'] },
  { title: 'Your Goals', fields: ['goals', 'channels'] },
  { title: 'Your Challenge', fields: ['challenge', 'timeline'] },
  { title: 'Almost Done', fields: ['budget', 'agency_before'] },
]

const goalOptions = ['Brand Awareness', 'Lead Generation', 'Sales / Revenue', 'Customer Retention', 'Social Growth', 'Content Production']
const channelOptions = ['Instagram', 'TikTok', 'Facebook', 'Google Ads', 'Email', 'YouTube', 'LinkedIn', 'None yet']
const revenueOptions = ['Under $10k/mo', '$10k–$50k/mo', '$50k–$100k/mo', '$100k–$500k/mo', '$500k+/mo', 'Prefer not to say']
const budgetOptions = ['Under $1k/mo', '$1k–$3k/mo', '$3k–$5k/mo', '$5k–$10k/mo', '$10k+/mo', 'Not sure yet']
const timelineOptions = ['ASAP', '1–2 months', '3–6 months', 'Just exploring']

export default function QuestionnaireModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business: '', industry: '',
    revenue: '', goals: [] as string[], channels: [] as string[],
    challenge: '', timeline: '', budget: '', agency_before: '',
  })

  const toggleGoal = (g: string) => {
    setForm(prev => ({
      ...prev,
      goals: prev.goals.includes(g) ? prev.goals.filter(x => x !== g) : [...prev.goals, g],
    }))
  }

  const toggleChannel = (c: string) => {
    setForm(prev => ({
      ...prev,
      channels: prev.channels.includes(c) ? prev.channels.filter(x => x !== c) : [...prev.channels, c],
    }))
  }

  const handleSubmit = async () => {
    setSending(true)
    const payload = {
      ...form,
      goals: form.goals.join(', '),
      channels: form.channels.join(', '),
      source: 'questionnaire',
      timestamp: new Date().toISOString(),
    }

    try {
      if (CONFIG.FORMSPREE_URL) {
        await fetch(CONFIG.FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      if (CONFIG.GOOGLE_SHEET_URL) {
        fetch(CONFIG.GOOGLE_SHEET_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {})
      }
      localStorage.setItem('vanta_questionnaire_done', 'true')
      setDone(true)
    } catch {
      setDone(true) // Still mark as done even if submit fails
    }
    setSending(false)
  }

  const skipToCalendly = () => {
    if (CONFIG.CALENDLY_URL) window.open(CONFIG.CALENDLY_URL, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="glass-strong rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-lg" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {done ? 'All Set!' : steps[step].title}
            </h3>
            {!done && (
              <p className="text-xs text-white/60 mt-1">Step {step + 1} of {steps.length} — all fields optional</p>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Skip banner */}
        {!done && CONFIG.CALENDLY_URL && (
          <button
            onClick={skipToCalendly}
            className="w-full px-6 py-3 bg-gold/5 border-b border-white/5 text-sm text-gold/80 hover:text-gold hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
          >
            <Calendar size={14} />
            Skip to booking — schedule directly on Calendly
          </button>
        )}

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-gold" />
                </div>
                <p className="text-white/50 mb-6">Your answers help us prepare the perfect strategy. We'll be in touch soon.</p>
                {CONFIG.CALENDLY_URL && (
                  <a
                    href={CONFIG.CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 liquid-glass rounded-full px-6 py-3 text-white text-sm hover:bg-white/5 transition-colors"
                  >
                    <Calendar size={16} />
                    Book your strategy call now
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <QInput label="Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="Your name" />
                    <QInput label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} placeholder="you@company.com" />
                    <QInput label="Phone" type="tel" value={form.phone} onChange={v => setForm({...form, phone: v})} placeholder="(optional)" />
                  </>
                )}
                {step === 1 && (
                  <>
                    <QInput label="Business Name" value={form.business} onChange={v => setForm({...form, business: v})} placeholder="Your brand" />
                    <QInput label="Industry" value={form.industry} onChange={v => setForm({...form, industry: v})} placeholder="e.g. Fashion, F&B, Fitness..." />
                    <QChips label="Monthly Revenue" options={revenueOptions} selected={form.revenue ? [form.revenue] : []}
                      onToggle={v => setForm({...form, revenue: v})} single />
                  </>
                )}
                {step === 2 && (
                  <>
                    <QChips label="Primary Goals" options={goalOptions} selected={form.goals} onToggle={toggleGoal} />
                    <QChips label="Current Marketing Channels" options={channelOptions} selected={form.channels} onToggle={toggleChannel} />
                  </>
                )}
                {step === 3 && (
                  <>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-white/70 mb-2">Biggest Marketing Challenge</label>
                      <textarea rows={3} value={form.challenge}
                        onChange={e => setForm({...form, challenge: e.target.value})}
                        placeholder="What's holding your brand back?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-gold/40 transition-colors resize-none"
                      />
                    </div>
                    <QChips label="Timeline" options={timelineOptions} selected={form.timeline ? [form.timeline] : []}
                      onToggle={v => setForm({...form, timeline: v})} single />
                  </>
                )}
                {step === 4 && (
                  <>
                    <QChips label="Monthly Marketing Budget" options={budgetOptions} selected={form.budget ? [form.budget] : []}
                      onToggle={v => setForm({...form, budget: v})} single />
                    <QChips label="Worked with an Agency Before?" options={['Yes', 'No']} selected={form.agency_before ? [form.agency_before] : []}
                      onToggle={v => setForm({...form, agency_before: v})} single />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!done && (
          <div className="flex items-center justify-between p-6 border-t border-white/5">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-gold' : i < step ? 'bg-gold/40' : 'bg-white/10'}`} />
              ))}
            </div>

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 text-sm text-white hover:text-gold transition-colors"
              >
                Next <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Submit'} <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function QInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-white/70 mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none focus:border-gold/40 transition-colors" />
    </div>
  )
}

function QChips({ label, options, selected, onToggle }: {
  label: string; options: string[]; selected: string[]; onToggle: (v: string) => void; single?: boolean
}) {
  return (
    <div>
      <label className="block text-xs tracking-wider uppercase text-white/70 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onToggle(opt)}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              selected.includes(opt)
                ? 'bg-gold/15 border border-gold/30 text-gold'
                : 'bg-white/3 border border-white/8 text-white/50 hover:border-white/15'
            }`}
          >
            {selected.includes(opt) && <Check size={11} className="inline mr-1" />}
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
