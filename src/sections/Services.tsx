import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Camera, BarChart3, Palette, Megaphone, Globe, Sparkles, ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import ServiceModal, { type ServiceDetail } from '../components/ServiceModal'

const services: (ServiceDetail & { description: string; glow: string })[] = [
  {
    icon: Camera,
    title: 'UGC Creation',
    description: 'Authentic creator content that converts. Real people, real results.',
    glow: 'rgba(123, 97, 255, 0.18)',
    accent: '#7B61FF',
    handle: '@ugc.studio',
    tagline: 'Authentic creators. Conversion-grade content.',
    video: 'https://videos.pexels.com/video-files/12433258/12433258-hd_1080_1920_30fps.mp4',
    features: [
      '3–16 edited video ads / month',
      '15–60 image creatives / month',
      '1–4 content shoots / month',
      'UGC + testimonial style',
      'Trend / reaction fast-posting',
    ],
    proof: { stat: '4.5×', label: 'TikTok CTR lift vs studio ads' },
    highlight: 'We cast for product fit, not follower count.',
  },
  {
    icon: BarChart3,
    title: 'Paid Media',
    description: 'Data-driven ad campaigns across Meta, TikTok, and Google.',
    glow: 'rgba(0, 212, 255, 0.15)',
    accent: '#00D4FF',
    handle: '@paid.lab',
    tagline: 'Meta + TikTok ads that actually return.',
    video: 'https://videos.pexels.com/video-files/6706925/6706925-hd_1080_1920_25fps.mp4',
    features: [
      'Meta + TikTok ads management',
      'Retargeting funnels',
      'Weekly ad testing cycles',
      'Hook / offer / split testing',
      'Creator + studio ad mix',
    ],
    proof: { stat: '$0.42', label: 'Median UGC CPM (Meta, 2024)' },
    highlight: 'We test weekly. Most agencies test monthly.',
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that make your brand unmistakable.',
    glow: 'rgba(255, 107, 107, 0.18)',
    accent: '#FF6B6B',
    handle: '@brand.system',
    tagline: 'A look that makes you unmistakable.',
    video: 'https://videos.pexels.com/video-files/8522842/8522842-hd_1080_1920_30fps.mp4',
    features: [
      'Logo system + variants',
      'Color palette + typography',
      'Brand voice + messaging guide',
      'Social templates (IG / TikTok / FB)',
      'Print + digital asset kit',
    ],
    proof: { stat: '23%', label: 'Revenue lift from consistent branding' },
    highlight: 'Cohesive across every touchpoint.',
  },
  {
    icon: Megaphone,
    title: 'Social Strategy',
    description: 'Content calendars, engagement systems, community growth.',
    glow: 'rgba(224, 165, 38, 0.15)',
    accent: '#E0A526',
    handle: '@social.team',
    tagline: 'Daily posts. Story rhythm. Real community.',
    video: 'https://videos.pexels.com/video-files/6706919/6706919-hd_1080_1920_25fps.mp4',
    features: [
      'Full IG / TikTok / Facebook management',
      'Daily posting + stories',
      'Caption writing + hashtag strategy',
      'Comment / DM monitoring',
      'Community growth strategy',
    ],
    proof: { stat: '84%', label: 'Trust peer content over brand ads' },
    highlight: 'We become your team, not a vendor.',
  },
  {
    icon: Globe,
    title: 'Web Design',
    description: 'Conversion-focused sites that look as good as they perform.',
    glow: 'rgba(91, 63, 212, 0.18)',
    accent: '#5B3FD4',
    handle: '@web.lab',
    tagline: 'Landing pages that earn their CPM back.',
    video: 'https://videos.pexels.com/video-files/6446060/6446060-hd_1080_1920_25fps.mp4',
    features: [
      'Free landing page (Launch) or 3-page site (Growth)',
      'Premium funnel + CRO system (Scale)',
      'GA4 + Hotjar setup',
      'Heatmap + funnel analysis',
      'Monthly CRO improvements',
    ],
    proof: { stat: '+18%', label: 'Avg conversion lift in first 90 days' },
    highlight: 'Tracking in. Decisions out.',
  },
  {
    icon: Sparkles,
    title: 'Full Service',
    description: 'Every service we offer, running together as one coordinated team.',
    glow: 'rgba(224, 165, 38, 0.18)',
    accent: '#E0A526',
    handle: '@vanta.team',
    tagline: 'All-in-one execution across every channel.',
    video: '', // pure gradient inside the phone for the premium tier
    features: [
      'Everything in our other services',
      'Monthly growth strategy call',
      'Weekly meetings + reports',
      'Priority support',
      'Faster turnaround on every deliverable',
    ],
    proof: { stat: '6', label: 'Services running in sync, one team' },
    highlight: 'One team across every channel — always in sync.',
  },
]

export default function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <section id="services" className="relative py-32 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="What We Do"
            title="Services built for"
            titleAccent="growth"
            subtitle="Everything your brand needs to dominate — under one roof. Tap any card to see how we deliver."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <TiltCard
                key={service.title}
                service={service}
                index={i}
                onClick={() => setOpenIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {openIndex !== null && (
          <ServiceModal
            services={services}
            currentIndex={openIndex}
            onClose={() => setOpenIndex(null)}
            onChangeIndex={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function TiltCard({
  service,
  index,
  onClick,
}: {
  service: ServiceDetail & { description: string; glow: string }
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  })
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 20,
  })
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 20,
  })

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
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
      className="liquid-glass rounded-2xl p-8 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
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
        {/* Icon + arrow corner indicator */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-xl liquid-glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <service.icon size={22} className="text-gold" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={18} className="text-gold/70" />
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl mb-3 group-hover:text-gold transition-colors duration-300"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-warm-white/70 text-sm leading-relaxed group-hover:text-warm-white/95 transition-colors duration-300 mb-4">
          {service.description}
        </p>

        {/* "See more" hint */}
        <div className="text-[11px] tracking-[0.2em] uppercase text-gold/50 group-hover:text-gold transition-colors duration-300">
          Tap to explore →
        </div>
      </div>
    </motion.div>
  )
}
