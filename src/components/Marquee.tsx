import { motion } from 'framer-motion'

interface MarqueeProps {
  items: string[]
  speed?: number
  separator?: string
  className?: string
}

export default function Marquee({ items, speed = 30, separator = '✦', className = '' }: MarqueeProps) {
  // Duplicate items enough times to fill the screen + overflow
  const repeated = [...items, ...items, ...items, ...items]
  const content = repeated.map((item, i) => (
    <span key={i} className="flex items-center gap-8 shrink-0">
      <span>{item}</span>
      <span className="text-violet/40 text-lg">{separator}</span>
    </span>
  ))

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="flex items-center gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {content}
      </motion.div>
    </div>
  )
}
