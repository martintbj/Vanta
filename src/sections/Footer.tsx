import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CONFIG } from '../config'

export default function Footer({ onOpenUGC }: { onOpenUGC?: () => void }) {
  return (
    <footer className="relative py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl font-serif italic text-gradient">V</span>
              <span className="text-sm tracking-[0.3em] uppercase text-warm-white/50">anta Creatives</span>
            </div>
            <p className="text-warm-white/60 text-sm leading-relaxed max-w-xs">
              Bold creative for brands that refuse to blend in.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-warm-white/70 mb-4">Navigate</h4>
              <div className="space-y-3">
                {['Work', 'Services', 'Pricing', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-sm text-warm-white/75 hover:text-warm-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-warm-white/70 mb-4">More</h4>
              <div className="space-y-3">
                <button
                  onClick={onOpenUGC}
                  className="block text-sm text-warm-white/75 hover:text-warm-white transition-colors text-left"
                >
                  Join as Creator
                </button>
                {['Privacy', 'Terms'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-sm text-warm-white/75 hover:text-warm-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs tracking-[0.3em] uppercase text-warm-white/70 mb-4">Connect</h4>
            <div className="flex gap-3">
              {Object.entries(CONFIG.SOCIALS).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors group"
                >
                  <ArrowUpRight size={16} className="text-warm-white/50 group-hover:text-gold transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-warm-white/45 text-xs">
            &copy; {new Date().getFullYear()} Vanta Creatives. All rights reserved.
          </p>
          <p className="text-warm-white/45 text-xs">
            Designed & built with intention.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
