import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface VideoTransitionProps {
  src: string
  height?: string
  overlay?: 'dark' | 'fade' | 'none'
  children?: React.ReactNode
}

/**
 * Scroll-driven video section.
 * The video's currentTime is tied to scroll progress —
 * scrolling through this section "scrubs" through the video.
 * Content (children) fades in over the video as you scroll deeper.
 */
export default function VideoTransition({
  src,
  height = '100vh',
  overlay = 'fade',
  children,
}: VideoTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Scrub video to match scroll
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Preload metadata so we know the duration
    video.preload = 'auto'

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (video.duration && isFinite(video.duration)) {
        // Map scroll progress to video timeline
        // We use a narrower range so the video plays through the "visible" portion
        const adjusted = Math.max(0, Math.min(1, (progress - 0.15) / 0.7))
        video.currentTime = adjusted * video.duration
      }
    })

    return unsubscribe
  }, [scrollYProgress])

  // Fade content in earlier so it's visible while video has visual content
  const contentOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1])
  const contentY = useTransform(scrollYProgress, [0.25, 0.45], [60, 0])

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ height }}>
      {/* Sticky video container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1 }}
        />

        {/* Overlay */}
        {overlay === 'fade' && (
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #080808 0%, transparent 15%, transparent 85%, #080808 100%)',
            }}
          />
        )}
        {overlay === 'dark' && (
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        )}

        {/* Optional content that fades in over the video */}
        {children && (
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            {/* Subtle radial glow behind text for readability */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 60% 40% at center, rgba(0,0,0,0.6) 0%, transparent 70%)',
            }} />
            <div className="relative z-10">
              {children}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
