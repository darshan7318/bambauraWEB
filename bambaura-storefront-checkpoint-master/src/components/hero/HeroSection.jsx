import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, ArrowRight, Flame, ShieldCheck, Check, Award,
  Truck, RotateCcw, Star, ShoppingBag, Eye, Package,
  ChefHat, MessageSquare, Plus, Lock
} from 'lucide-react'
import ShimmerButton from '../ui/ShimmerButton'
import SpotlightCard from '../ui/SpotlightCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import { useStore } from '../../context/StoreContext'
import HOME_DATA from '../../data/homeData.json'

const METRIC_ICONS = {
  cycles: Flame,
  color: Sparkles,
  granulation: Award,
  purity: ShieldCheck
}

export default function HeroSection({ onSelectGram }) {
  const { productData, formatPrice, countryConfig, addToCart, showToast } = useStore()
  const [selectedGramId, setSelectedGramId] = useState('100g')
  const [visualMode, setVisualMode] = useState('canister') // 'canister' | 'crystals' | 'duo'
  const hero = HOME_DATA.hero

  const currentVariant =
    productData.gramVariants.find(v => v.grams === selectedGramId) ||
    productData.gramVariants[0] ||
    productData.gramVariants[1]

  const handleGramSelect = (grams) => {
    setSelectedGramId(grams)
    if (onSelectGram) onSelectGram(grams)
  }

  const handleQuickAdd = () => {
    addToCart({
      id: 'bambaura-9x-salt',
      title: 'Bambaura 9X Bamboo Roasted Salt',
      grams: currentVariant.grams,
      grind: 'Fine Granules',
      priceUSD: currentVariant.priceUSD,
      image: currentVariant.image,
      quantity: 1
    })
    showToast(`Added ${currentVariant.grams} canister to your cart!`, 'success')
  }

  return (
    <section className="relative min-h-[88vh] flex items-center bg-gradient-to-b from-[#faf5ee] via-[#faf5ee]/90 to-[#f5eedf] dark:from-[#120505] dark:via-[#180707] dark:to-[#120404] border-b border-[#e6d8c4] dark:border-[#381616] px-4 sm:px-6 py-12 sm:py-20 transition-colors duration-300 overflow-hidden">
      
      {/* ATMOSPHERIC LUXURY GLOWS & AMBIENCE */}
      <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-[#dfb983]/15 dark:bg-[#b28346]/10 rounded-full blur-[110px] sm:blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[260px] sm:w-[500px] h-[260px] sm:h-[500px] bg-[#401010]/10 dark:bg-[#401010]/30 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* LEFT COLUMN: HERO VALUE PROPOSITION */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* TOP CRAFT BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#200c0c]/90 border border-[#b28346]/40 text-xs font-semibold tracking-wider uppercase text-[#8c6027] dark:text-[#dfb983] shadow-xs backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-[#b28346] dark:text-[#dfb983] shrink-0" />
            <span>Nine Roasting Cycles • Traditional Bamboo Craft</span>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#401010] dark:text-[#f7ebd9] leading-[1.12] tracking-tight">
            Sea salt, roasted nine times <br className="hidden sm:inline" />
            <span className="italic font-normal bg-gradient-to-r from-[#8c6027] via-[#b28346] to-[#dfb983] dark:from-[#dfb983] dark:via-[#f5ebd9] dark:to-[#dfb983] bg-clip-text text-transparent">
              in mountain bamboo.
            </span>
          </h1>

          {/* TASTE & AROMA STATEMENT (EXACT USER SPEC) */}
          <div className="space-y-2 max-w-xl">
            <p className="font-serif font-bold text-base sm:text-lg text-[#401010] dark:text-[#dfb983]">
              Smoky, savoury and mineral-rich, with a hint of umami.
            </p>
            <p className="text-sm sm:text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              Prepared through nine roasting cycles inside bamboo tubes. Recognisable by its distinctive brownish colour and fine granules, this salt brings a unique story and presentation to your kitchen.
            </p>
          </div>

          {/* 4 PROOF BENCHMARKS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-1">
            {hero.metrics.map((metric) => {
              const IconComp = METRIC_ICONS[metric.id] || Sparkles
              const colorClasses = metric.color === 'rose'
                ? 'text-rose-600 dark:text-rose-400'
                : metric.color === 'emerald'
                ? 'text-emerald-600 dark:text-emerald-400'
                : metric.color === 'amber'
                ? 'text-[#b28346] dark:text-[#dfb983]'
                : 'text-sky-600 dark:text-sky-400'

              return (
                <div key={metric.id} className="p-3 sm:p-3.5 rounded-2xl bg-white/80 dark:bg-[#1a0808]/80 border border-[#e6d8c4] dark:border-[#381616] shadow-xs">
                  <div className={`flex items-center gap-1.5 ${colorClasses} mb-1`}>
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">{metric.label}</span>
                  </div>
                  <div className={`font-serif text-lg sm:text-xl font-bold ${colorClasses}`}>
                    {metric.value !== undefined ? (
                      <AnimatedCounter
                        value={metric.value}
                        suffix={metric.suffix}
                        duration={1200}
                      />
                    ) : (
                      <span>{metric.title}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#8c6027] dark:text-[#c2ada4] mt-0.5">{metric.subtext}</p>
                </div>
              )
            })}
          </div>

          {/* INTEGRATED 4-TIER CANISTER PICKER WITH DYNAMIC PRICES */}
          <div className="p-4 rounded-3xl bg-white/90 dark:bg-[#1a0808]/90 border border-[#e6d8c4] dark:border-[#381616] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                Select Canister Size:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  MRP {formatPrice(currentVariant.amazonUSD)}
                </span>
                <span className="font-mono font-bold text-sm text-[#b28346] dark:text-[#dfb983]">
                  {formatPrice(currentVariant.priceUSD)} {countryConfig.code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {productData.gramVariants.map((v) => {
                const isSelected = selectedGramId === v.grams
                return (
                  <button
                    key={v.grams}
                    type="button"
                    onClick={() => handleGramSelect(v.grams)}
                    className={`p-2.5 rounded-2xl border text-xs font-mono transition-all text-center relative flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-[#b28346] bg-[#401010] text-[#f7ebd9] dark:bg-[#dfb983] dark:text-[#120505] shadow-md shadow-[#b28346]/20 font-bold scale-[1.02]'
                        : 'border-[#e6d8c4] dark:border-[#381616] hover:border-[#b28346]/60 bg-[#faf5ee] dark:bg-[#200c0c] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="text-sm font-bold">{v.label}</div>
                    <div className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-[#dfb983] dark:text-[#401010]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatPrice(v.priceUSD)}
                    </div>
                    {v.popular && (
                      <span className={`absolute -top-1.5 -right-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[#dfb983] text-[#401010] dark:bg-[#401010] dark:text-[#dfb983]'
                          : 'bg-[#401010] text-[#dfb983] dark:bg-[#dfb983] dark:text-[#120505]'
                      }`}>
                        ★ Bestseller
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active Variant Subtext */}
            <div className="text-xs text-[#6b534b] dark:text-[#c2ada4] flex items-center justify-between pt-1 border-t border-[#e6d8c4]/60 dark:border-[#381616]">
              <span className="font-semibold text-[#401010] dark:text-[#f7ebd9]">
                {currentVariant.name}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock • Dispatches in 24h
              </span>
            </div>
          </div>

          {/* CALL TO ACTION BUTTONS WITH SHOP NOW & QUICK ADD */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to={`/product?grams=${selectedGramId}`}
                className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#401010] via-[#521415] to-[#401010] dark:from-[#dfb983] dark:via-[#cda265] dark:to-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl group active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop now — {formatPrice(currentVariant.priceUSD)}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
              </Link>

              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border-2 border-[#401010] dark:border-[#dfb983] text-[#401010] dark:text-[#dfb983] hover:bg-[#401010] hover:text-[#f7ebd9] dark:hover:bg-[#dfb983] dark:hover:text-[#140707] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add to cart</span>
              </button>

              <Link
                to="/process"
                className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-[#b28346]/40 hover:border-[#b28346] text-[#401010] dark:text-[#f7ebd9] font-semibold text-xs tracking-wider uppercase transition-all hover:bg-white dark:hover:bg-[#1a0808] text-center shadow-xs flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-[#b28346]" />
                <span>Why 9x?</span>
              </Link>
            </div>

            {/* TRUST SIGNALS NEAR BUY BUTTON (BRIEF ITEM 15) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#6b534b] dark:text-[#c2ada4] pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Lab-tested every batch
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <RotateCcw className="w-4 h-4 text-[#b28346] shrink-0" />
                Easy replacement
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#b28346] shrink-0" />
                Ships in 24–48 hours
              </span>
              <span>•</span>
              <a
                href="https://wa.me/919845012345?text=Hello%20Bambaura,%20I%20have%20an%20inquiry%20about%20the%209X%20bamboo%20salt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Care</span>
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SPOTLIGHT PRODUCT VISUAL WITH 3-WAY STAGE TOGGLE */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
          <SpotlightCard className="w-full max-w-sm sm:max-w-md aspect-square p-6 sm:p-10 flex items-center justify-center relative shadow-2xl border-[#e6d8c4] dark:border-[#381616]">
            
            {/* FLOATING TOP-LEFT GRAM BADGE */}
            <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#200c0c]/95 border border-[#b28346]/40 text-[#401010] dark:text-[#dfb983] rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#b28346]" />
              <span>{currentVariant.label} Reserve</span>
            </div>

            {/* FLOATING TOP-RIGHT BENCHMARK PILL */}
            <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#200c0c]/95 border border-[#b28346]/40 text-[#401010] dark:text-[#dfb983] rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>0% Microplastics</span>
            </div>

            {/* PRODUCT IMAGE WITH DYNAMIC 3-WAY STAGE SYNC */}
            <AnimatePresence mode="wait">
              {visualMode === 'canister' ? (
                <motion.img
                  key={currentVariant.image}
                  src={currentVariant.image}
                  alt={currentVariant.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full object-contain filter drop-shadow-2xl rounded-2xl"
                />
              ) : visualMode === 'crystals' ? (
                <motion.div
                  key="real-crystals"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <img
                    src="/images/extracted/bambaura_real_crystals_1.jpg"
                    alt="Real Bambaura 9X Brownish Roasted Salt Crystals"
                    className="w-full h-4/5 object-cover rounded-2xl shadow-xl border border-[#b28346]/40"
                  />
                  <span className="text-xs font-serif font-bold text-[#401010] dark:text-[#dfb983] mt-2">
                    Actual 9X Brownish Roasted Crystals
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="packaging-duo"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  <img
                    src="/images/extracted/bambaura_packaging_showcase_duo.jpg"
                    alt="100g & 250g Canisters with Gold Barrier Pouch"
                    className="w-full h-4/5 object-cover rounded-2xl shadow-xl border border-[#b28346]/40"
                  />
                  <span className="text-xs font-serif font-bold text-[#401010] dark:text-[#dfb983] mt-2">
                    Canisters + Gold Barrier Freshness Pouch
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLOATING BOTTOM-LEFT CRAFT BADGE */}
            <div className="absolute -bottom-3 sm:-bottom-4 -left-2 sm:-left-4 bg-white/95 dark:bg-[#200c0c]/95 border border-[#e6d8c4] dark:border-[#381616] rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3 backdrop-blur-md">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#401010] text-[#dfb983] flex items-center justify-center font-bold text-sm shadow">
                9X
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-[#401010] dark:text-[#f7ebd9]">Nine Roasting Cycles</p>
                <p className="text-[11px] text-[#6b534b] dark:text-[#c2ada4]">Inside Bamboo Tubes</p>
              </div>
            </div>

            {/* FLOATING BOTTOM-RIGHT RATING CHIP */}
            <div className="absolute -bottom-3 sm:-bottom-4 -right-2 sm:-right-4 bg-white/95 dark:bg-[#200c0c]/95 border border-[#e6d8c4] dark:border-[#381616] rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-1.5 backdrop-blur-md text-xs">
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="font-mono font-bold text-[#401010] dark:text-[#f7ebd9]">4.96</span>
              <span className="text-xs text-[#6b534b] dark:text-[#c2ada4]">(489)</span>
            </div>

          </SpotlightCard>

          {/* 3-WAY VISUAL TOGGLE PILLS */}
          <div className="mt-6 flex items-center gap-1.5 bg-white/90 dark:bg-[#1a0808]/90 p-1 rounded-full border border-[#e6d8c4] dark:border-[#381616] shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setVisualMode('canister')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                visualMode === 'canister'
                  ? 'bg-[#401010] text-[#dfb983] dark:bg-[#dfb983] dark:text-[#120505] font-bold shadow-xs'
                  : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010]'
              }`}
            >
              Canister
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('crystals')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                visualMode === 'crystals'
                  ? 'bg-[#401010] text-[#dfb983] dark:bg-[#dfb983] dark:text-[#120505] font-bold shadow-xs'
                  : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Real Crystals</span>
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('duo')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                visualMode === 'duo'
                  ? 'bg-[#401010] text-[#dfb983] dark:bg-[#dfb983] dark:text-[#120505] font-bold shadow-xs'
                  : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010]'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>Packaging Duo</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
