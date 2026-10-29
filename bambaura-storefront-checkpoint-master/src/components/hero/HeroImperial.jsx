import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Flame, ShieldCheck } from 'lucide-react'
import ShimmerButton from '../ui/ShimmerButton'
import SpotlightCard from '../ui/SpotlightCard'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function HeroImperial({ productData, onSelectGram }) {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      badge: 'Imperial 9X Roasting Alchemy',
      title: 'Himalayan Primal Salt, Fired in Mountain Bamboo.',
      subtitle:
        'Nine iterative cycles at 1,500°C over natural pine wood. Imbuing finishing crystals with bio-active sulfur, negative ORP -400 mV antioxidant potential, and alkaline pH 10.5+.',
      image: '/images/extracted/hero_product_clean.png',
      ctaText: 'Explore The Flagship Reserve',
      ctaLink: '/product',
      stats: [
        { label: 'ORP Potential', value: -400, prefix: '', suffix: ' mV' },
        { label: 'Alkaline pH', value: 10.5, prefix: 'pH ', suffix: '+' },
        { label: 'Ionic Minerals', value: 84, prefix: '', suffix: '+' },
        { label: 'Microplastics', value: 0, prefix: '', suffix: '%' }
      ]
    },
    {
      badge: 'Michelin Chef Secret',
      title: 'The Crowning Glory of Prime Culinary Finishing.',
      subtitle:
        'Unlocks deep umami with delicate smoky-sulfur aromas that melt on A5 Wagyu, grilled wild greens, burrata salads, and bone broths without sharp harshness.',
      image: '/images/extracted/hi_salt_bowl.png',
      ctaText: 'Discover Chef Pairings',
      ctaLink: '/recipes',
      stats: [
        { label: 'Peak Heat', value: 1500, prefix: '', suffix: '°C' },
        { label: 'Aging Bamboo', value: 3, prefix: '', suffix: ' Yrs' },
        { label: 'Roast Iterations', value: 9, prefix: '', suffix: ' Cycles' },
        { label: 'Heavy Metals', value: 0, prefix: '', suffix: '.00%' }
      ]
    },
    {
      badge: 'Purity Standard',
      title: 'Free from Microplastics, Heavy Metals & Additives.',
      subtitle:
        'Yellow mountain clay seals each giant bamboo culm. The extreme pine fire incinerates impurities, resulting in a crystalline nutrient reservoir that supports cellular hydration.',
      image: '/images/extracted/hi_canister_250g.png',
      ctaText: 'Examine Scientific Lab Data',
      ctaLink: '/science',
      stats: [
        { label: 'Antioxidant Power', value: 400, prefix: 'Max ', suffix: ' ORP' },
        { label: 'Micro-ground', value: 100, prefix: '', suffix: '% Silky' },
        { label: 'Crystals', value: 100, prefix: '', suffix: '% Pure' },
        { label: 'Satisfaction', value: 100, prefix: '', suffix: '% Assured' }
      ]
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [slides.length])

  const current = slides[activeSlide]

  return (
    <div className="relative w-full py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 sm:space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#401010]/10 dark:bg-[#dfb983]/10 border border-[#b28346]/40 text-xs font-semibold tracking-wider uppercase text-[#8c6027] dark:text-[#dfb983] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#b28346] dark:text-[#dfb983]" />
              <span>{current.badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#401010] dark:text-[#f7ebd9] leading-[1.15] tracking-tight">
              {current.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#6b534b] dark:text-[#c2ada4] leading-relaxed max-w-xl">
              {current.subtitle}
            </p>

            {/* STATS STRIP WITH 21ST.DEV ANIMATED COUNTER */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-y border-[#e6d8c4] dark:border-[#381616]">
              {current.stats.map((s, i) => (
                <div key={i} className="text-left">
                  <p className="font-serif text-lg sm:text-2xl font-bold text-[#401010] dark:text-[#dfb983]">
                    {typeof s.value === 'number' ? (
                      <AnimatedCounter
                        value={s.value}
                        prefix={s.prefix}
                        suffix={s.suffix}
                        duration={1200}
                      />
                    ) : (
                      s.value
                    )}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#8c6027] dark:text-[#c2ada4] uppercase tracking-wider font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to={current.ctaLink} className="w-full sm:w-auto">
                <ShimmerButton className="w-full sm:w-auto shadow-2xl justify-center">
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </ShimmerButton>
              </Link>

              <Link
                to="/process"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#b28346]/50 hover:border-[#b28346] text-[#401010] dark:text-[#f7ebd9] font-semibold text-xs tracking-wider uppercase transition-all hover:bg-black/5 dark:hover:bg-white/5 text-center"
              >
                The 9-Cycle Journey
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* SLIDE PROGRESS CONTROLS */}
        <div className="flex items-center gap-3 pt-3 sm:pt-4">
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? 'w-8 bg-[#401010] dark:bg-[#dfb983]'
                    : 'w-2 bg-[#e6d8c4] dark:bg-[#381616]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-xs text-[#8c6027] dark:text-[#dfb983] font-mono ml-2 font-bold">
            0{activeSlide + 1} / 0{slides.length}
          </span>
        </div>
      </div>

      {/* RIGHT PRODUCT MEDIA */}
      <div className="lg:col-span-5 flex justify-center relative">
        <SpotlightCard className="w-full max-w-sm sm:max-w-md aspect-square p-6 sm:p-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide}
              src={current.image}
              alt={current.title}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </AnimatePresence>

          {/* FLOATING BADGE */}
          <div className="absolute -bottom-3 sm:-bottom-4 -left-2 sm:-left-4 bg-white/95 dark:bg-[#200c0c]/95 border border-[#e6d8c4] dark:border-[#381616] rounded-2xl p-3 shadow-xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-[#401010] text-[#dfb983] flex items-center justify-center font-bold text-sm shadow">
              9X
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-[#401010] dark:text-[#f7ebd9]">1,500°C Roasted</p>
              <p className="text-[10px] text-[#6b534b] dark:text-[#c2ada4]">Pine Wood Mountain Kiln</p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  )
}

