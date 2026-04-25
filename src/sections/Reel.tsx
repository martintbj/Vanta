import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ParticleField from '../components/ParticleField'

const statement =
  "We don't follow trends. We set them. Every brand we touch becomes impossible to ignore — bold visuals, sharp strategy, relentless creativity. That's Vanta."

/**
 * Industry-sourced UGC research stats.
 * All numbers below are from published third-party studies, not Vanta's
 * internal metrics — safer than "we scaled X brands / managed $Ym" claims.
 */
const UGC_STATS = [
  {
    value: '2.4×',
    label: 'UGC vs brand conversion',
    source: 'Nosto, 2023',
  },
  {
    value: '79%',
    label: 'Purchase decisions UGC influences',
    source: 'Stackla',
  },
  {
    value: '4.5×',
    label: 'TikTok CTR lift with UGC',
    source: 'TikTok for Business',
  },
  {
    value: '84%',
    label: 'Trust peer content over brand ads',
    source: 'Nielsen',
  },
] as const

export default function Reel() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  const words = statement.split(' ')

  return (
    <section ref={ref} className="relative py-40 md:py-56 px-6 overflow-hidden">
      {/* Interactive particle constellation */}
      <div className="absolute inset-0 opacity-40">
        <ParticleField />
      </div>

      {/* Ghost text parallax */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-serif italic text-white/[0.015] whitespace-nowrap pointer-events-none select-none"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [100, -100]),
        }}
      >
        VANTA CREATIVES
      </motion.div>

      {/* Word-by-word manifesto */}
      <div className="max-w-5xl mx-auto relative z-10">
        <p className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.3] tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length
            const end = (i + 1) / words.length
            return (
              <Word
                key={i}
                word={word}
                progress={scrollYProgress}
                start={start}
                end={end}
              />
            )
          })}
        </p>
      </div>

      {/* ── UGC Research stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto mt-24 md:mt-28 relative z-10"
      >
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.4em] uppercase text-gold/90 mb-2">
            The Science
          </p>
          <p className="text-sm text-white/70 max-w-md mx-auto">
            Why UGC outperforms polished studio ads — straight from the research.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {UGC_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-gold mb-2">
                {stat.value}
              </div>
              <div className="text-xs tracking-[0.18em] uppercase text-warm-white/85 leading-snug mb-1">
                {stat.label}
              </div>
              <div className="text-[10px] tracking-wider text-white/40 italic">
                {stat.source}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.12, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.3em]">
      {word}
    </motion.span>
  )
}
