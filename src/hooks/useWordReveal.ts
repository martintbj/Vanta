import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'

export function useWordReveal(text: string) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.4'],
  })

  const words = text.split(' ')

  function getWordOpacity(index: number, total: number): MotionValue<number> {
    const start = index / total
    const end = (index + 1) / total
    return useTransform(scrollYProgress, [start, end], [0.15, 1])
  }

  return { ref, words, getWordOpacity }
}
