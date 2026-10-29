import React from 'react'
import { motion } from 'framer-motion'
import {
  Flame, ShieldCheck, Sparkles, Droplet, Award, Zap,
  CheckCircle2, Heart, Scale, Activity
} from 'lucide-react'
import SpotlightCard from './ui/SpotlightCard'

const BENEFITS = [
  {
    icon: Flame,
    title: "Nine Roasting Cycles in Bamboo",
    badge: "Traditional Craft",
    color: "amber",
    description: "Packed into mountain bamboo stalks, sealed with mineral-rich yellow clay, and hand-fired over natural pine firewood across 21 days."
  },
  {
    icon: Activity,
    title: "Naturally Alkaline Mineral Profile",
    badge: "pH 9+ Alkaline",
    color: "emerald",
    description: "Repeated kiln heat infuses alkaline bamboo sap and clay minerals, offering a gentle, balanced mineral finish compared to acidic refined salts."
  },
  {
    icon: ShieldCheck,
    title: "0% Microplastics & Clean Purity",
    badge: "ISO/IEC 17025 Tested",
    color: "sky",
    description: "High-temperature kiln firings vaporize volatile impurities and synthetic microplastics commonly present in industrial marine table salts."
  },
  {
    icon: Droplet,
    title: "Zero Anti-Caking Agents",
    badge: "100% Additive-Free",
    color: "rose",
    description: "Contains zero sodium ferrocyanide (E535), silicon dioxide (E551), or bleaching chemicals. Just pure, natural brownish mineral salt granules."
  },
  {
    icon: Sparkles,
    title: "Rich Smoky Umami Finish",
    badge: "Distinctive Taste",
    color: "amber",
    description: "Subtle egg-like organic sulfur aroma and gentle smoky finish that elevates fried eggs, grilled meats, paneer, and fresh fruit with just a tiny pinch."
  },
  {
    icon: Scale,
    title: "60+ Essential Trace Minerals",
    badge: "Mineral-Rich",
    color: "emerald",
    description: "Naturally enriched with potassium, magnesium, calcium, and iron drawn from the bamboo stalks and mineral clay during repeated firings."
  }
]

export default function BenefitsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6" aria-label="Bambaura 9X Bamboo Roasted Salt Benefits">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
          Natural Integrity & Craft
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
          The Distinctive Qualities of 9X Bamboo Roasted Salt
        </h2>
        <p className="text-xs sm:text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          Crafted without exaggerated promises—just honest traditional bamboo roasting that transforms pure sea salt into a mineral-dense, smoky culinary ingredient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map((item, idx) => {
          const IconComp = item.icon
          const colorStyles =
            item.color === 'emerald'
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : item.color === 'rose'
              ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
              : item.color === 'sky'
              ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10'
              : 'text-[#b28346] dark:text-[#dfb983] bg-amber-500/10'

          return (
            <SpotlightCard key={idx} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] text-[#8c6027] dark:text-[#dfb983]">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-lg text-[#401010] dark:text-[#f7ebd9]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </section>
  )
}

