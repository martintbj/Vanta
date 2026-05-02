import { motion } from 'framer-motion'
import { Check, Star, Sparkles } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { CONFIG } from '../config'

type Tier = {
  name: string
  price: string
  period: string
  description: string
  cta: string
  stripeLink: string
  popular: boolean
  groups: { title: string; items: string[] }[]
}

const tiers: Tier[] = [
  {
    name: 'Launch',
    price: '1,250',
    period: '/mo',
    description: 'Establish presence, test paid ads, and build consistent content without a heavy commitment.',
    cta: 'Get Started',
    stripeLink: CONFIG.STRIPE_TIER1,
    popular: false,
    groups: [
      {
        title: 'Content Creation',
        items: [
          '3 edited video ads / month',
          '15 image creatives / month',
          '1 content shoot / month',
        ],
      },
      {
        title: 'Website + Tracking',
        items: [
          'Free landing page website',
          'GA4 setup',
          'Hotjar setup',
          'Deployment management',
        ],
      },
      {
        title: 'Reporting + Support',
        items: [
          'Weekly meetings',
          'Weekly website performance reports',
        ],
      },
    ],
  },
  {
    name: 'Growth',
    price: '2,497',
    period: '/mo',
    description: 'Scale your brand consistently and outsource content + marketing management.',
    cta: 'Scale Up',
    stripeLink: CONFIG.STRIPE_TIER2,
    popular: true,
    groups: [
      {
        title: 'Content Creation',
        items: [
          '8 edited video ads / month',
          '30 image creatives / month',
          '2 content shoots / month',
          'Daily story content',
        ],
      },
      {
        title: 'Social Media Management',
        items: [
          'Full social posting management',
          'Daily story uploads',
          'Content scheduling',
        ],
      },
      {
        title: 'Paid Ads Management',
        items: [
          'Meta ads management',
          'TikTok ads management',
        ],
      },
      {
        title: 'Website + Tracking',
        items: [
          'Free 3-page website',
          'GA4 setup',
          'Hotjar setup',
          'Deployment management',
        ],
      },
      {
        title: 'Reporting + Support',
        items: [
          'Weekly meetings',
          'Weekly post + ad reports',
          'Weekly website reports',
        ],
      },
    ],
  },
  {
    name: 'Scale',
    price: '4,997',
    period: '/mo',
    description: 'Aggressive growth — dominate social and replace the need for an internal marketing team.',
    cta: 'Go Premium',
    stripeLink: CONFIG.STRIPE_TIER3,
    popular: false,
    groups: [
      {
        title: 'Content Creation',
        items: [
          '16 edited video ads / month',
          '60 image creatives / month',
          '4 content shoots / month',
          'Daily stories + engagement content',
          'UGC / testimonial content',
          'Product launch campaigns',
          'Trend / reaction fast-posting',
        ],
      },
      {
        title: 'Social Media Management',
        items: [
          'Full IG / TikTok / Facebook management',
          'Daily posting',
          'Caption writing + hashtag strategy',
          'Comment / DM monitoring',
          'Community growth strategy',
        ],
      },
      {
        title: 'Paid Ads Management',
        items: [
          'Meta + TikTok ads management',
          'Retargeting funnels',
          'Weekly ad testing cycles',
          'Offer / hook testing',
          'Landing page split tests',
        ],
      },
      {
        title: 'Website + Funnel Optimization',
        items: [
          'Premium funnel + CRO system',
          'GA4 + Hotjar monitoring',
          'Heatmap + funnel analysis',
          'Monthly CRO improvements',
        ],
      },
      {
        title: 'Priority Support',
        items: [
          'Weekly meetings + reports',
          'Monthly growth strategy call',
          'Faster turnaround times',
        ],
      },
    ],
  },
]

export default function Pricing({ onOpenQuestionnaire }: { onOpenQuestionnaire?: () => void }) {
  return (
    <section id="pricing" className="relative py-32 md:py-40 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <SectionHeading
          eyebrow="Pricing"
          title="Invest in"
          titleAccent="growth"
          subtitle="Transparent pricing. No hidden fees. Cancel anytime."
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.popular
                  ? 'glass-strong border-gold/20'
                  : 'glass'
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet/20 to-gold/20 border border-violet/30 rounded-full flex items-center gap-1.5">
                  <Star size={12} className="text-violet fill-violet" />
                  <span className="text-xs tracking-wider uppercase text-warm-white/90 font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier name */}
              <h3 className="text-lg font-sans font-medium text-warm-white/90 mb-4">
                {tier.name}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-warm-white/60 text-lg">$</span>
                <span className="text-4xl md:text-5xl font-serif italic text-warm-white">
                  {tier.price}
                </span>
                <span className="text-warm-white/60 text-sm">{tier.period}</span>
              </div>

              <p className="text-warm-white/70 text-sm mb-8 leading-relaxed">
                {tier.description}
              </p>

              {/* Grouped feature lists with category headers */}
              <div className="space-y-5 mb-8 flex-1">
                {tier.groups.map((group) => (
                  <div key={group.title}>
                    <h4 className="text-[10px] tracking-[0.2em] uppercase text-gold/85 mb-2.5 font-medium">
                      {group.title}
                    </h4>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] text-warm-white/80 leading-snug">
                          <Check size={14} className="text-gold/80 shrink-0 mt-[3px]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* CTA logic:
                  - Stripe Payment Link configured → buy now
                  - Otherwise → open questionnaire (qualifies the lead)
                  - Last resort → scroll to contact */}
              {(() => {
                const ctaClasses = `block text-center py-3.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-violet/30 to-gold/30 text-warm-white border border-violet/30 hover:from-violet/40 hover:to-gold/40'
                    : 'glass hover:bg-white/10 text-warm-white/90'
                }`

                if (tier.stripeLink) {
                  return (
                    <a href={tier.stripeLink} target="_blank" rel="noopener noreferrer" className={ctaClasses}>
                      {tier.cta}
                    </a>
                  )
                }

                if (onOpenQuestionnaire) {
                  return (
                    <button type="button" onClick={onOpenQuestionnaire} className={`w-full ${ctaClasses}`}>
                      {tier.cta}
                    </button>
                  )
                }

                return (
                  <a href="#contact" className={ctaClasses}>
                    {tier.cta}
                  </a>
                )
              })()}
            </motion.div>
          ))}
        </div>

        {/* ── Custom Plan — quote-based 4th option, distinct horizontal treatment ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto mt-10 md:mt-14"
        >
          <div className="relative glass-strong rounded-2xl p-8 md:p-10 overflow-hidden">
            {/* Subtle gradient wash */}
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(123,97,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 0% 50%, rgba(224,165,38,0.12) 0%, transparent 60%)',
              }}
            />

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-gold" />
                  <span className="text-[10px] tracking-[0.3em] uppercase text-gold/90 font-medium">
                    Custom Plan
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-3xl lg:text-4xl text-warm-white mb-3 leading-tight"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Get a plan made <em className="text-gradient-bold">just for you</em>.
                </h3>
                <p className="text-warm-white/75 text-sm md:text-base max-w-2xl leading-relaxed">
                  Whether it's a multi-brand portfolio, a product launch, white-label work, or something
                  no one's tried before — we'll design a plan that fits like it was made for you. Because
                  it was.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full lg:w-auto">
                {onOpenQuestionnaire ? (
                  <button
                    type="button"
                    onClick={onOpenQuestionnaire}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-violet/30 to-gold/30 text-warm-white border border-violet/30 text-sm font-medium hover:from-violet/40 hover:to-gold/40 transition-all duration-300 whitespace-nowrap"
                  >
                    Talk to Us →
                  </button>
                ) : (
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-violet/30 to-gold/30 text-warm-white border border-violet/30 text-sm font-medium hover:from-violet/40 hover:to-gold/40 transition-all duration-300 text-center whitespace-nowrap"
                  >
                    Talk to Us →
                  </a>
                )}
                <a
                  href={CONFIG.CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/65 hover:text-gold transition-colors text-center"
                >
                  Or book a call directly
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Helper link below all options */}
        {onOpenQuestionnaire && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={onOpenQuestionnaire}
              className="text-sm text-white/65 hover:text-gold transition-colors underline-offset-4 hover:underline"
            >
              Not sure which plan? Take our 2-minute planner →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
