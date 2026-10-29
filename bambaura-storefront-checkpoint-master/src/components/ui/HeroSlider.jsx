import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Sparkles, ShieldCheck, ChefHat } from 'lucide-react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    badge: "Traditional Bamboo Roasting",
    icon: Flame,
    title: "Sea Salt Roasted 9 Times in Bamboo",
    subtitle: "Prepared over 21 days inside mountain bamboo stalks sealed with natural mineral clay and hand-fired over pine firewood.",
    image: "/images/extracted/bambaura_artisans_bamboo_kiln.jpg",
    ctaText: "Explore 9 Roasting Cycles",
    ctaLink: "/process",
    highlight: "9 Roasting Cycles • 21 Days Craft"
  },
  {
    id: 2,
    badge: "Everyday Kitchen & Table Use",
    icon: Sparkles,
    title: "Distinctive Brownish Granules with Smoky Umami",
    subtitle: "Recognisable by its natural brownish-amber mineral crystals. Mellow savoury depth with zero chemical harshness.",
    image: "/images/extracted/bambaura_packaging_showcase_duo.jpg",
    ctaText: "Shop Signature Canisters",
    ctaLink: "/product",
    highlight: "From ₹1,450 / $24 • Free Shipping"
  },
  {
    id: 3,
    badge: "100% Pure & Lab Certified",
    icon: ShieldCheck,
    title: "ISO/IEC 17025 Tested Purity Standards",
    subtitle: "Verified below detection limits for heavy metals, zero microplastics, and naturally alkaline mineral balance.",
    image: "/images/extracted/bambaura_real_crystals_1.jpg",
    ctaText: "View Accredited COA",
    ctaLink: "/science",
    highlight: "Zero Anti-Caking • Lead <0.01 ppm LOD"
  },
  {
    id: 4,
    badge: "Culinary Finishing Ritual",
    icon: ChefHat,
    title: "A Small Pinch is Enough for Gourmet Finishing",
    subtitle: "Sprinkled over morning eggs, grilled paneer, ribeye, fresh watermelon, or cocktail rims for a smoky savoury lift.",
    image: "/images/extracted/recipe_chicken.png",
    ctaText: "View 5 Easy Kitchen Uses",
    ctaLink: "/recipes",
    highlight: "Finishing Salt • Delicate Texture"
  }
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => setCurrent(prev => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length)

  const slide = SLIDES[current]
  const IconComp = slide.icon

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 my-8 select-none"
      aria-label="Bambaura Highlights Showcase Slider"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240808] to-[#380e0e] text-[#f7ebd9] border border-[#b28346]/30 shadow-2xl min-h-[380px] sm:min-h-[420px] flex items-center">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#dfb983]/10 rounded-full blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-12 z-10"
          >
            {/* TEXT SIDE */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#b28346]/40 text-xs font-semibold uppercase tracking-wider text-[#dfb983] backdrop-blur-xs">
                <IconComp className="w-3.5 h-3.5" />
                <span>{slide.badge}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {slide.title}
              </h2>

              <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed max-w-xl">
                {slide.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={slide.ctaLink}
                  className="px-6 py-3 rounded-full bg-[#b28346] hover:bg-[#dfb983] text-[#240808] font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 active:scale-95"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="font-mono text-xs text-amber-200/90 font-semibold border-l border-[#b28346]/40 pl-4 py-1">
                  {slide.highlight}
                </span>
              </div>
            </div>

            {/* VISUAL SIDE */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden border border-[#b28346]/40 shadow-2xl group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-[11px] font-mono text-[#dfb983] bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center justify-between">
                  <span>Slide 0{current + 1} / 0{SLIDES.length}</span>
                  <span className="font-bold">BAMBAURA 9X</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS: PREV / NEXT BUTTONS */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#b28346] text-white hover:text-[#240808] flex items-center justify-center transition-all backdrop-blur-xs border border-white/20 z-20 active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-[#b28346] text-white hover:text-[#240808] flex items-center justify-center transition-all backdrop-blur-xs border border-white/20 z-20 active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* SLIDE INDICATOR DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-8 bg-[#dfb983]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

