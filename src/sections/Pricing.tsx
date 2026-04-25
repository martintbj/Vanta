import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { CONFIG } from '../config'

const tiers = [
  {
    name: 'Starter',
    price: '1,500',
    period: '/mo',
    description: 'For brands ready to start building presence.',
    features: [
      'Social media management (2 platforms)',
      '12 posts per month',
      'Basic analytics dashboard',
      'Monthly strategy call',
      'Content calendar',
    ],
    cta: 'Get Started',
    stripeLink: CONFIG.STRIPE_TIER1,
    popular: false,
  },
  {
    name: 'Growth',
    price: '3,500',
    period: '/mo',
    description: 'For brands ready to scale aggressively.',
    features: [
      'Everything in Starter',
      'UGC creator network (5 creators)',
      'Paid media management',
      'Advanced analytics + reporting',
      'Bi-weekly strategy calls',
      'A/B creative testing',
      'Email marketing setup',
    ],
    cta: 'Scale Now',
    stripeLink: CONFIG.STRIPE_TIER2,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Full-service creative partnership.',
    features: [
      'Everything in Growth',
      'Dedicated creative director',
      'Unlimited creator network',
      'Multi-platform ad campaigns',
      'Brand identity & web design',
      'Weekly strategy sessions',
      'Priority turnaround',
      'Custom integrations',
    ],
    cta: "Let's Talk",
    stripeLink: '', // Enterprise is always quote-based
    popular: false,
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

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl p-8 ${
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
                {tier.price !== 'Custom' && (
                  <span className="text-warm-white/60 text-lg">$</span>
                )}
                <span className="text-4xl md:text-5xl font-serif italic text-warm-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-warm-white/60 text-sm">{tier.period}</span>
                )}
              </div>

              <p className="text-warm-white/70 text-sm mb-8">
                {tier.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-warm-white/80">
                    <Check size={16} className="text-gold shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA logic:
                  - Stripe Payment Link configured → buy now
                  - Otherwise → open questionnaire (qualifies the lead)
                  - Last resort (no questionnaire callback) → scroll to contact */}
              {(() => {
                const ctaClasses = `block text-center py-3.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-violet/30 to-gold/30 text-warm-white border border-violet/30 hover:from-violet/40 hover:to-gold/40'
                    : 'glass hover:bg-white/10 text-warm-white/80'
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

        {/* Helper CTA — opens questionnaire for plan recommendation */}
        {onOpenQuestionnaire && (
          <div className="text-center mt-12">
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
