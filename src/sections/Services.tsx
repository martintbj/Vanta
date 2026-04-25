import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Camera, BarChart3, Palette, Megaphone, Globe, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import SectionHeading from '../components/SectionHeading'

const services = [
  {
    icon: Camera,
    title: 'UGC Creation',
    description: 'Authentic creator content that converts. Real people, real results.',
    glow: 'rgba(123, 97, 255, 0.15)',
  },
  {
    icon: BarChart3,
    title: 'Paid Media',
    description: 'Data-driven ad campaigns across Meta, TikTok, and Google.',
    glow: 'rgba(0, 212, 255, 0.12)',
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that make your brand unmistakable.',
    glow: 'rgba(255, 107, 107, 0.15)',
  },
  {
    icon: Megaphone,
    title: 'Social Strategy',
    description: 'Content calendars, engagement systems, community growth.',
    glow: 'rgba(224, 165, 38, 0.12)',
  },
  {
    icon: Globe,
    title: 'Web Design',
    description: 'Conversion-focused sites that look as good as they perform.',
    glow: 'rgba(91, 63, 212, 0.15)',
  },
  {
    icon: Sparkles,
    title: 'Full Service',
    description: 'End-to-end creative direction. We become your marketing team.',
    glow: 'rgba(224, 165, 38, 0.15)',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="What We Do"
          title="Services built for"
          titleAccent="growth"
          subtitle="Everything your brand needs to dominate — under one roof."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <TiltCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TiltCard({ service, index }: { service: typeof services[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 20 })
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className="liquid-glass rounded-2xl p-8 group cursor-default"
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${service.glow}, transparent 60%)`
          ),
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <service.icon size={22} className="text-gold" />
        </div>

        {/* Title */}
        <h3
          className="text-xl mb-3 group-hover:text-gold transition-colors duration-300"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-warm-white/70 text-sm leading-relaxed group-hover:text-warm-white/95 transition-colors duration-300">
          {service.description}
        </p>
      </div>
    </motion.div>
  )
}
