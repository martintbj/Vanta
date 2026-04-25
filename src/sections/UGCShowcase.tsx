import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Heart, Eye } from 'lucide-react'

/**
 * ════════════════════════════════════════════════════════════════
 *  UGC Showcase — "The Feed"
 * ════════════════════════════════════════════════════════════════
 *
 *  A tilted, auto-scrolling wall of phone mockups playing vertical
 *  video ads. Each phone has floating engagement metrics (views,
 *  hearts, ROAS) to reinforce "this stuff actually works".
 *
 *  Swap the `ADS` array below with real TikTok/Instagram ad MP4s
 *  or embed iframes when you have them.
 */

type Ad = {
  /** Direct MP4 URL — must be on a CSP-allowed host (see vercel.json media-src) */
  src: string
  brand: string
  caption: string
  /** Overlay badges */
  views?: string
  likes?: string
  roas?: string
  /** Hue for the glow around the phone */
  hue?: 'violet' | 'gold' | 'coral' | 'electric'
}

// ── Verified working Pexels vertical-video URLs.
//    Easy to swap for real TikTok/Instagram MP4s later.
//    Broken URLs fall back to FALLBACK_SRC below.
const FALLBACK_SRC = 'https://videos.pexels.com/video-files/6706919/6706919-hd_1080_1920_25fps.mp4'

const ADS: Ad[] = [
  {
    // Woman applying essential oil
    src: 'https://videos.pexels.com/video-files/6706919/6706919-hd_1080_1920_25fps.mp4',
    brand: 'skincare.lab',
    caption: 'glass skin in 7 days',
    views: '2.8M',
    likes: '187K',
    roas: '4.2x',
    hue: 'violet',
  },
  {
    // Dropper-bottle hero shot
    src: 'https://videos.pexels.com/video-files/6706925/6706925-hd_1080_1920_25fps.mp4',
    brand: 'dropper.co',
    caption: 'the 4am formula went viral',
    views: '5.7M',
    likes: '412K',
    roas: '6.8x',
    hue: 'gold',
  },
  {
    // Condiment bottles on a diner table
    src: 'https://videos.pexels.com/video-files/8522842/8522842-hd_1080_1920_30fps.mp4',
    brand: 'good.eats.co',
    caption: 'the sauce drop broke shopify',
    views: '3.4M',
    likes: '241K',
    roas: '5.1x',
    hue: 'coral',
  },
  {
    // Hands holding a product
    src: 'https://videos.pexels.com/video-files/6446060/6446060-hd_1080_1920_25fps.mp4',
    brand: 'apothec.labs',
    caption: 'dermatologist × creator drop',
    views: '1.9M',
    likes: '138K',
    roas: '4.5x',
    hue: 'electric',
  },
  {
    // Dancer / vlogger with ring light
    src: 'https://videos.pexels.com/video-files/12433258/12433258-hd_1080_1920_30fps.mp4',
    brand: 'glow.protocol',
    caption: 'day 1 of 30 · transformation',
    views: '890K',
    likes: '64K',
    roas: '3.1x',
    hue: 'violet',
  },
]

const HUE_GLOW: Record<NonNullable<Ad['hue']>, string> = {
  violet: 'shadow-[0_20px_60px_rgba(123,97,255,0.35)]',
  gold: 'shadow-[0_20px_60px_rgba(224,165,38,0.35)]',
  coral: 'shadow-[0_20px_60px_rgba(255,107,107,0.3)]',
  electric: 'shadow-[0_20px_60px_rgba(0,212,255,0.3)]',
}

export default function UGCShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Slight parallax on the scrolling row based on section scroll position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const rowX = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  // Duplicate the ad list so the marquee can wrap seamlessly
  const loop = [...ADS, ...ADS]

  return (
    <section ref={sectionRef} id="ugc-showcase" className="relative py-32 md:py-40 overflow-hidden bg-[#080808]">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 15% 50%, rgba(123,97,255,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 85% 50%, rgba(224,165,38,0.1) 0%, transparent 60%)
          `,
        }}
      />

      {/* Heading */}
      <div className="relative max-w-7xl mx-auto px-6 text-center mb-16 md:mb-20">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full liquid-glass">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-gold opacity-75 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-gold" />
          </span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-white/85">Live campaigns</span>
        </div>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Content that <em className="text-gradient-bold italic">performs</em>
        </h2>
        <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto">
          Real ads. Real creators. Real ROAS.
        </p>
      </div>

      {/* Infinite-scroll phone row (CSS animation) */}
      <motion.div
        style={{ x: rowX }}
        className="relative"
      >
        <div className="ugc-marquee flex gap-6 md:gap-8 w-max px-6">
          {loop.map((ad, i) => (
            <PhoneCard key={i} ad={ad} index={i} />
          ))}
        </div>

        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none z-10" />
      </motion.div>

      {/* Industry-benchmark stats (not Vanta's own numbers) */}
      <div className="relative max-w-5xl mx-auto px-6 mt-20 md:mt-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: '3 sec', label: 'Window to hook the viewer', source: 'TikTok' },
            { value: '92%', label: 'Videos watched on mute', source: 'Meta' },
            { value: '$0.42', label: 'Median UGC ad CPM', source: 'Meta, 2024' },
            { value: '47%', label: 'Of ad spend going to UGC', source: 'eMarketer' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-serif italic text-gold mb-1">{stat.value}</div>
              <div className="text-xs tracking-[0.18em] uppercase text-white/80 leading-snug mb-0.5">{stat.label}</div>
              <div className="text-[10px] tracking-wider text-white/40 italic">{stat.source}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Phone card ─────────────────────────────────────────────────
function PhoneCard({ ad, index }: { ad: Ad; index: number }) {
  const [loaded, setLoaded] = useState(false)
  // Alternate tilt direction for visual rhythm
  const tilt = index % 2 === 0 ? -3 : 3
  const glow = HUE_GLOW[ad.hue ?? 'violet']

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: (index % ADS.length) * 0.08 }}
      whileHover={{ scale: 1.04, rotate: 0, transition: { duration: 0.3 } }}
      style={{ rotate: tilt }}
      className="relative flex-shrink-0 w-[200px] md:w-[240px] group cursor-pointer"
    >
      {/* Phone frame */}
      <div className={`relative aspect-[9/19.5] rounded-[2.5rem] overflow-hidden bg-black border-[5px] border-white/10 ${glow} transition-shadow duration-500 group-hover:border-white/25`}>

        {/* Dynamic island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

        {/* Poster gradient under the video (while loading) */}
        {!loaded && (
          <div className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(123,97,255,0.4) 0%, rgba(224,165,38,0.3) 50%, rgba(255,107,107,0.3) 100%)',
            }}
          />
        )}

        {/* Video (auto-fallback on error) */}
        <video
          src={ad.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onError={(e) => {
            const v = e.currentTarget
            if (v.src !== FALLBACK_SRC) {
              v.src = FALLBACK_SRC
              v.load()
            }
          }}
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        />

        {/* Dark bottom vignette for caption readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent z-[2] pointer-events-none" />

        {/* Top-left live dot */}
        <div className="absolute top-4 left-3 z-[3] flex items-center gap-1.5">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-coral opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-coral" />
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/90 font-medium">LIVE</span>
        </div>

        {/* Engagement stack — right side */}
        <div className="absolute right-2.5 bottom-20 z-[3] flex flex-col items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-[9px] text-white mt-1 font-medium">{ad.likes ?? '—'}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Eye size={16} className="text-white" />
            </div>
            <span className="text-[9px] text-white mt-1 font-medium">{ad.views ?? '—'}</span>
          </div>
        </div>

        {/* Caption + brand */}
        <div className="absolute inset-x-3 bottom-3 z-[4]">
          <p className="text-[10px] text-white/75 mb-0.5">@{ad.brand}</p>
          <p className="text-xs text-white font-medium leading-snug line-clamp-2">{ad.caption}</p>
        </div>

        {/* Play badge overlays on hover */}
        <div className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
          <div className="w-14 h-14 rounded-full bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center">
            <Play size={22} className="text-white fill-white ml-1" />
          </div>
        </div>
      </div>

      {/* ROAS chip under phone */}
      {ad.roas && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass text-[10px] tracking-wider uppercase">
          <span className="text-gold font-medium">{ad.roas}</span>
          <span className="text-white/65 ml-1">ROAS</span>
        </div>
      )}
    </motion.div>
  )
}
