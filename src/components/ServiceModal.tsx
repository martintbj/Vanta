import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useEffect, type ComponentType } from 'react'

export type ServiceDetail = {
  icon: ComponentType<{ size?: number; className?: string }>
  title: string
  /** Hex accent for the phone glow + gradient highlights */
  accent: string
  handle: string
  tagline: string
  /** Background video URL inside the phone (empty = pure gradient) */
  video: string
  features: string[]
  proof: { stat: string; label: string }
  highlight: string
}

interface ServiceModalProps {
  services: ServiceDetail[]
  currentIndex: number
  onClose: () => void
  onChangeIndex: (newIndex: number) => void
}

/**
 * Phone position map by offset from current.
 *  0  = focused phone (full size, sharp, on top)
 * -1  = prev phone peeking from left (smaller, tilted, blurred, faded)
 *  1  = next phone peeking from right
 *  Other offsets render with opacity 0 (offstage).
 */
function getPosition(offset: number) {
  if (offset === 0) return { x: 0, scale: 1, opacity: 1, blur: 0, zIndex: 20, rotateY: -2 }
  if (offset === -1)
    return { x: -240, scale: 0.7, opacity: 0.32, blur: 3, zIndex: 10, rotateY: 22 }
  if (offset === 1)
    return { x: 240, scale: 0.7, opacity: 0.32, blur: 3, zIndex: 10, rotateY: -22 }
  return { x: 0, scale: 0.5, opacity: 0, blur: 6, zIndex: 0, rotateY: 0 }
}

export default function ServiceModal({
  services,
  currentIndex,
  onClose,
  onChangeIndex,
}: ServiceModalProps) {
  const service = services[currentIndex]
  const onPrev = currentIndex > 0 ? () => onChangeIndex(currentIndex - 1) : undefined
  const onNext =
    currentIndex < services.length - 1 ? () => onChangeIndex(currentIndex + 1) : undefined

  // ESC + ← / → keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Ambient color wash from focused service */}
      <motion.div
        key={`bg-${service.title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, ${service.accent}22 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 80%, ${service.accent}15 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 20%, ${service.accent}15 0%, transparent 70%)
          `,
        }}
      />

      {/* Close X */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-8 md:right-8 z-30 w-11 h-11 rounded-full glass flex items-center justify-center text-white hover:text-gold transition-colors"
      >
        <X size={18} />
      </button>

      {/* Prev arrow */}
      {onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous service"
          className="absolute left-3 md:left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white hover:text-gold hover:scale-110 transition-all"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next arrow */}
      {onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next service"
          className="absolute right-3 md:right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full glass flex items-center justify-center text-white hover:text-gold hover:scale-110 transition-all"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Phone stack — focused phone center, prev/next peek at sides */}
      <div
        className="relative pointer-events-none"
        style={{ width: '300px', height: '650px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 md:hidden">
          {/* Mobile: only render the focused phone */}
          <ServicePhone
            key={service.title}
            service={service}
            inFocus
            isMounting
            position={getPosition(0)}
          />
        </div>

        <div className="hidden md:block">
          {services.map((s, i) => {
            const offset = i - currentIndex
            if (Math.abs(offset) > 1) return null
            const pos = getPosition(offset)
            const isFocus = offset === 0
            return (
              <ServicePhone
                key={s.title}
                service={s}
                inFocus={isFocus}
                position={pos}
                onClick={
                  isFocus
                    ? undefined
                    : (e) => {
                        e.stopPropagation()
                        onChangeIndex(i)
                      }
                }
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

interface ServicePhoneProps {
  service: ServiceDetail
  inFocus: boolean
  position: ReturnType<typeof getPosition>
  onClick?: (e: React.MouseEvent) => void
  isMounting?: boolean
}

function ServicePhone({ service, inFocus, position, onClick, isMounting }: ServicePhoneProps) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformPerspective: 1200, pointerEvents: 'auto' }}
      initial={
        isMounting
          ? { opacity: 0, y: 60, scale: position.scale, x: position.x }
          : { opacity: 0, scale: position.scale * 0.9, x: position.x * 1.4 }
      }
      animate={{
        opacity: position.opacity,
        y: 0,
        scale: position.scale,
        x: position.x,
        rotateY: position.rotateY,
        filter: `blur(${position.blur}px)`,
        zIndex: position.zIndex,
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 rounded-[3rem] overflow-hidden bg-black border-[6px] border-white/10"
        style={{
          boxShadow: `0 30px 80px ${service.accent}40, 0 0 0 1px rgba(255,255,255,0.05)`,
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30" />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-20 px-7 pt-2 flex items-center justify-between text-white text-[11px] font-medium pointer-events-none">
          <span>9:41</span>
          <span className="opacity-70">●●● 􀙇</span>
        </div>

        {/* Background video — only on focused phone for performance */}
        {inFocus && service.video ? (
          <video
            src={service.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${service.accent} 0%, ${service.accent}80 40%, #080808 100%)`,
            }}
          />
        )}

        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.85) 60%, ${service.accent}25 100%)`,
          }}
        />

        {/* Scrollable content */}
        <div
          className="absolute inset-0 z-10 pt-12 pb-6 px-5 overflow-y-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="space-y-5">
            {/* Service header — story-circle style icon + handle */}
            <div className="flex items-center gap-3 mt-2">
              <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}, ${service.accent}88)`,
                  boxShadow: `0 0 24px ${service.accent}55`,
                }}
              >
                <service.icon size={20} className="text-white" />
                <div
                  className="absolute -inset-1 rounded-full pointer-events-none"
                  style={{ border: `1.5px solid ${service.accent}` }}
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 leading-none mb-1">
                  Vanta
                </p>
                <p className="text-sm text-white font-medium leading-none">{service.handle}</p>
              </div>
            </div>

            {/* Title + tagline */}
            <div>
              <h3
                className="text-[26px] text-white leading-tight mb-2"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {service.title}
              </h3>
              <p className="text-xs text-white/75 leading-relaxed">{service.tagline}</p>
            </div>

            {/* Proof / hero stat */}
            <div className="liquid-glass rounded-2xl px-4 py-3">
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold/85 mb-1.5 font-medium">
                Proof
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif italic text-gold leading-none">
                  {service.proof.stat}
                </span>
                <span className="text-[10px] text-white/65 leading-snug">
                  {service.proof.label}
                </span>
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold/85 mb-2.5 font-medium">
                Includes
              </p>
              <ul className="space-y-2">
                {service.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2 text-[12px] text-white/85 leading-snug"
                  >
                    <Check size={12} className="text-gold/85 shrink-0 mt-[3px]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlight quote */}
            <div className="liquid-glass rounded-2xl px-4 py-3">
              <p className="text-[12px] text-white/85 italic leading-relaxed">
                &ldquo;{service.highlight}&rdquo;
              </p>
            </div>

            {/* CTA — goes to pricing and closes modal */}
            <a
              href="#pricing"
              onClick={(e) => {
                // Close modal via parent key listener trick — do nothing here, parent handles
                if (!inFocus) e.preventDefault()
              }}
              className="block py-3 rounded-2xl text-white text-center text-sm font-medium border border-white/15 transition-all hover:border-white/30"
              style={{
                background: `linear-gradient(90deg, ${service.accent}40 0%, ${service.accent}25 100%)`,
              }}
            >
              Add to my plan →
            </a>

            {inFocus && (
              <p className="text-center text-[10px] text-white/40 pt-1">
                ← / → to browse all services
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
