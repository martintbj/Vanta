import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { X, Monitor, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import SectionHeading from '../components/SectionHeading'

const projects = [
  {
    title: 'Koi Boba',
    category: 'Web + Social',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    color: 'from-amber-900/40 to-orange-900/40',
    description: 'Complete rebrand and social media takeover for an artisan boba tea shop.',
    demo: '/gallery-demo/boba-shop.html',
    social: '/gallery-demo/social-fake.html',
  },
  {
    title: 'Maison Noir',
    category: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    color: 'from-stone-900/40 to-neutral-900/40',
    description: 'Luxury fashion e-commerce with a bold visual identity system.',
    demo: '/gallery-demo/boutique.html',
    social: '/gallery-demo/social-boutique.html',
  },
  {
    title: 'Ember & Vine',
    category: 'Full Service',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    color: 'from-red-900/40 to-amber-900/40',
    description: 'Farm-to-table restaurant — web, social, UGC, and paid media campaign.',
    demo: '/gallery-demo/restaurant.html',
    social: '/gallery-demo/social-restaurant.html',
  },
  {
    title: 'FORM Athletics',
    category: 'UGC + Paid',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    color: 'from-slate-900/40 to-zinc-900/40',
    description: 'Performance fitness brand scaled to 6 figures with creator-led campaigns.',
    demo: '/gallery-demo/fitness.html',
    social: '/gallery-demo/social-fitness.html',
  },
]

export default function Work() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  return (
    <section id="work" className="relative py-32 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Our Work"
          title="Results that"
          titleAccent="speak"
          subtitle="Real brands. Real results. Click to explore live demos."
        />

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              onClick={() => setSelectedProject(i)}
            />
          ))}
        </div>
      </div>

      {/* Project detail modal with live demo */}
      <AnimatePresence>
        {selectedProject !== null && (
          <DemoModal
            project={projects[selectedProject]}
            onClose={() => setSelectedProject(null)}
            onNext={() => setSelectedProject((selectedProject + 1) % projects.length)}
            onPrev={() => setSelectedProject((selectedProject - 1 + projects.length) % projects.length)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: typeof projects[number]
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3]"
    >
      {/* Image with parallax */}
      <motion.div style={{ y }} className="absolute inset-[-20%]">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${project.color} to-transparent opacity-60`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <span className="text-xs tracking-[0.3em] uppercase text-gold/80 mb-2 block">
          {project.category}
        </span>
        <h3
          className="text-2xl md:text-3xl mb-2 group-hover:text-gold transition-colors duration-300"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {project.title}
        </h3>
        <p className="text-warm-white/50 text-sm max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          {project.description}
        </p>
      </div>

      {/* Hover badge */}
      <div className="absolute top-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-white text-xs">
          <Monitor size={14} />
          View Demo
        </div>
      </div>
    </motion.div>
  )
}

function DemoModal({
  project,
  onClose,
  onNext,
  onPrev,
}: {
  project: typeof projects[number]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  const [view, setView] = useState<'site' | 'social'>('site')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Top bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="flex items-center justify-between px-6 py-4 border-b border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          {/* Nav arrows */}
          <button onClick={onPrev} className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={onNext} className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>

          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-gold/80">{project.category}</span>
            <h3 className="text-lg text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {project.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle: Site / Social */}
          <div className="liquid-glass rounded-full flex overflow-hidden">
            <button
              onClick={() => setView('site')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                view === 'site' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
              }`}
            >
              Website
            </button>
            <button
              onClick={() => setView('social')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                view === 'social' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
              }`}
            >
              Social Media
            </button>
          </div>

          {/* Device toggle */}
          <div className="hidden md:flex liquid-glass rounded-full overflow-hidden">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 transition-colors ${
                device === 'desktop' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
              }`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 transition-colors ${
                device === 'mobile' ? 'text-white bg-white/10' : 'text-white/50 hover:text-white'
              }`}
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="liquid-glass rounded-full p-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>

      {/* Demo iframe */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 flex items-center justify-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative transition-all duration-500 ${
            device === 'desktop'
              ? 'w-full max-w-5xl h-full'
              : 'w-[375px] h-[700px]'
          }`}
        >
          {/* Device frame */}
          <div className={`w-full h-full rounded-xl overflow-hidden border border-white/10 ${
            device === 'mobile' ? 'shadow-2xl' : ''
          }`}>
            <iframe
              src={view === 'site' ? project.demo : project.social}
              className="w-full h-full bg-white"
              title={`${project.title} ${view === 'site' ? 'demo' : 'social media'}`}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
        <a
          href="#contact"
          onClick={onClose}
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white font-medium hover:bg-white/5 transition-colors"
        >
          Want something like this? →
        </a>
      </div>
    </motion.div>
  )
}
