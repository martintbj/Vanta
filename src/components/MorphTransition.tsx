import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface MorphTransitionProps {
  title?: string
  accent?: string
  subtitle?: string
  /** "warm" = gold/coral blobs, "cool" = violet/electric blobs, "mixed" = all */
  palette?: 'warm' | 'cool' | 'mixed'
  height?: string
}

/**
 * Liquid mesh-gradient transition — zero video, pure CSS blobs.
 *
 * Three animated radial-gradient blobs drift via CSS keyframes
 * (GPU-accelerated transform/opacity only → smooth 60fps).
 * Content fades + parallaxes in via spring-smoothed scroll progress.
 */
export default function MorphTransition({
  title,
  accent,
  subtitle,
  palette = 'mixed',
  height = '100vh',
}: MorphTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  const contentOpacity = useTransform(smooth, [0.2, 0.45, 0.7, 0.9], [0, 1, 1, 0])
  const contentY = useTransform(smooth, [0.2, 0.5, 0.8], [40, 0, -40])
  const meshScale = useTransform(smooth, [0, 0.5, 1], [0.9, 1.05, 1])

  const palettes = {
    warm: {
      blob1: 'bg-gold/30',
      blob2: 'bg-coral/25',
      blob3: 'bg-gold/20',
    },
    cool: {
      blob1: 'bg-violet/35',
      blob2: 'bg-electric/25',
      blob3: 'bg-violet-deep/30',
    },
    mixed: {
      blob1: 'bg-violet/35',
      blob2: 'bg-gold/25',
      blob3: 'bg-electric/20',
    },
  }
  const p = palettes[palette]

  return (
    <div ref={ref} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080808]">

        {/* Animated mesh blobs */}
        <motion.div
          style={{ scale: meshScale }}
          className="absolute inset-0 overflow-hidden"
        >
          <div className={`absolute top-[-20%] left-[-15%] w-[70vw] h-[70vw] ${p.blob1} rounded-full blur-[140px] morph-blob-a`} />
          <div className={`absolute top-[30%] right-[-20%] w-[60vw] h-[60vw] ${p.blob2} rounded-full blur-[140px] morph-blob-b`} />
          <div className={`absolute bottom-[-25%] left-[25%] w-[65vw] h-[65vw] ${p.blob3} rounded-full blur-[140px] morph-blob-c`} />
        </motion.div>

        {/* Edge fade to bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #080808 0%, transparent 18%, transparent 82%, #080808 100%)',
          }}
        />

        {/* Content */}
        {(title || subtitle) && (
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-0 flex items-center justify-center z-10 px-6 pointer-events-none"
          >
            <div className="text-center">
              {subtitle && (
                <p className="text-xs tracking-[0.5em] uppercase text-white/70 mb-4"
                  style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                >
                  {subtitle}
                </p>
              )}
              {title && (
                <h2
                  className="text-4xl md:text-6xl lg:text-7xl text-white"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    textShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(123,97,255,0.3)',
                  }}
                >
                  {title}
                  {accent && <> <em className="text-gradient-bold italic">{accent}</em></>}
                </h2>
              )}
            </div>
          </motion.div>
        )}

        {/* Faint grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>
    </div>
  )
}
