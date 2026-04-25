import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface KineticTransitionProps {
  /** Big scrolling background word, e.g. "PORTFOLIO" */
  label: string
  /** Centered headline */
  title: string
  /** Optional gold accent word */
  accent?: string
  /** Optional subtitle above the title */
  subtitle?: string
  /** Optional background video (plays naturally, NOT scroll-scrubbed) */
  videoSrc?: string
  /** Total section height. 150vh = 1.5 viewports of scroll */
  height?: string
}

/**
 * Experimental kinetic typography transition.
 *
 * NO scroll-scrubbed video — just GPU-accelerated transforms on text,
 * so it runs smoothly at 60fps even on mobile.
 *
 * Layers (back → front):
 *   1. Natural-playing background video (optional) + parallax scale
 *   2. Violet/gold mesh gradient wash
 *   3. Massive horizontal-marquee word (scroll-parallax X)
 *   4. Centered headline with chromatic-aberration & glow
 *   5. Subtle noise overlay
 */
export default function KineticTransition({
  label,
  title,
  accent,
  subtitle,
  videoSrc,
  height = '150vh',
}: KineticTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Spring-smoothed progress for butter-smooth parallax
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Big word marquees — horizontal parallax
  const x1 = useTransform(smooth, [0, 1], ['0%', '-40%'])
  const x2 = useTransform(smooth, [0, 1], ['-40%', '0%'])
  const x3 = useTransform(smooth, [0, 1], ['10%', '-30%'])

  // Headline — fade in, scale, then fade out
  const titleOpacity = useTransform(smooth, [0.15, 0.45, 0.7, 0.9], [0, 1, 1, 0])
  const titleScale = useTransform(smooth, [0.15, 0.5, 0.9], [0.85, 1, 1.08])
  const titleBlurPx = useTransform(smooth, [0.15, 0.45, 0.7, 0.9], [20, 0, 0, 20])
  const titleFilter = useTransform(titleBlurPx, (b) => `blur(${b}px)`)

  // Background video — natural play, just parallax/opacity
  const bgOpacity = useTransform(smooth, [0, 0.25, 0.75, 1], [0, 0.45, 0.45, 0])
  const bgScale = useTransform(smooth, [0, 1], [1.15, 1])

  // Mesh gradient rotation
  const meshRotate = useTransform(smooth, [0, 1], [0, 45])

  return (
    <div ref={ref} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080808]">

        {/* 1. Background video — plays naturally, no scrubbing */}
        {videoSrc && (
          <motion.video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ opacity: bgOpacity, scale: bgScale }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* 2. Mesh gradient wash (rotating) */}
        <motion.div
          style={{ rotate: meshRotate }}
          className="absolute inset-[-30%] pointer-events-none"
        >
          <div className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 50% 40% at 20% 30%, rgba(123,97,255,0.35) 0%, transparent 60%),
                radial-gradient(ellipse 40% 30% at 80% 70%, rgba(224,165,38,0.25) 0%, transparent 60%),
                radial-gradient(ellipse 30% 40% at 50% 90%, rgba(255,107,107,0.15) 0%, transparent 60%)
              `,
            }}
          />
        </motion.div>

        {/* 3. Background vignette to keep edges dark */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #080808 0%, transparent 20%, transparent 80%, #080808 100%)',
          }}
        />

        {/* 4. Massive horizontal marquee words — parallax X */}
        <motion.div
          style={{ x: x1 }}
          className="absolute top-[15%] left-0 w-[220%] flex whitespace-nowrap pointer-events-none"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-[18vw] md:text-[16vw] font-serif italic text-white/[0.06] mx-8 select-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          style={{ x: x2 }}
          className="absolute bottom-[15%] left-0 w-[220%] flex whitespace-nowrap pointer-events-none"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-[18vw] md:text-[16vw] font-serif italic text-white/[0.06] mx-8 select-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {label}
            </span>
          ))}
        </motion.div>

        {/* Middle slender marquee — small caps sans */}
        <motion.div
          style={{ x: x3 }}
          className="absolute top-1/2 -translate-y-1/2 left-0 w-[220%] flex whitespace-nowrap pointer-events-none opacity-40"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="text-xs md:text-sm tracking-[0.5em] uppercase text-white/30 mx-12 select-none"
            >
              Vanta Creatives // {label} // Built for the bold //
            </span>
          ))}
        </motion.div>

        {/* 5. Centered headline — chromatic aberration glow */}
        <motion.div
          style={{
            opacity: titleOpacity,
            scale: titleScale,
            filter: titleFilter,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 pointer-events-none"
        >
          {subtitle && (
            <p className="text-xs tracking-[0.5em] uppercase text-white/60 mb-6"
              style={{ textShadow: '0 0 20px rgba(0,0,0,0.8)' }}
            >
              {subtitle}
            </p>
          )}
          <h2
            className="relative text-5xl md:text-7xl lg:text-8xl text-white text-center leading-[1.05]"
            style={{
              fontFamily: "'Instrument Serif', serif",
              textShadow: '0 0 40px rgba(123,97,255,0.5), 0 0 80px rgba(224,165,38,0.25), 0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            {/* Chromatic aberration — layered red/blue offsets */}
            <span aria-hidden="true" className="absolute inset-0 text-coral/40 mix-blend-screen" style={{ transform: 'translate(-2px, 0)' }}>
              {title}{accent ? <> <em>{accent}</em></> : null}
            </span>
            <span aria-hidden="true" className="absolute inset-0 text-electric/40 mix-blend-screen" style={{ transform: 'translate(2px, 0)' }}>
              {title}{accent ? <> <em>{accent}</em></> : null}
            </span>
            <span className="relative">
              {title}
              {accent && <> <em className="text-gradient-bold italic">{accent}</em></>}
            </span>
          </h2>
        </motion.div>

        {/* 6. Subtle scan-line / grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, transparent 1px, transparent 3px)',
          }}
        />
      </div>
    </div>
  )
}
