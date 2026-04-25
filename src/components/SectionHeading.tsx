import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  titleAccent?: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  align = 'left',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-4 mb-16 md:mb-20 ${alignment}`}>
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: align === 'center' ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3"
      >
        <span className="w-8 h-px bg-gold" />
        <span className="text-xs tracking-[0.4em] uppercase text-gold font-sans">
          {eyebrow}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1]"
      >
        {title}
        {titleAccent && (
          <span className="italic text-gold"> {titleAccent}</span>
        )}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-warm-white/50 text-lg md:text-xl max-w-2xl font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
