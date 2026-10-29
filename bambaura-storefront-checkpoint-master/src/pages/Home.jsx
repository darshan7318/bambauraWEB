import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, ShieldCheck, ArrowRight, Star, Sparkles, Check, ChevronRight,
  Award, Clock, Heart, Truck, Eye, ChefHat, Activity, ShoppingBag,
  HelpCircle, ChevronDown, CheckCircle2, Droplet
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

// 21st.dev Component Library Suite
import Marquee from '../components/ui/Marquee'
import ShineBorder from '../components/ui/ShineBorder'
import SpotlightCard from '../components/ui/SpotlightCard'
import ShimmerButton from '../components/ui/ShimmerButton'
import AnimatedPillTabs from '../components/ui/AnimatedPillTabs'
import HeroSection from '../components/hero/HeroSection'
import HeroSlider from '../components/ui/HeroSlider'
import BenefitsSection from '../components/BenefitsSection'
import SaltComparison from '../components/SaltComparison'
import HOME_DATA from '../data/homeData.json'
import FAQS_DATA from '../data/faqs.json'
import RECIPES_DATA from '../data/recipes.json'

const iconMap = {
  Flame,
  Sparkles,
  ShieldCheck,
  Check,
  Award,
  ChefHat
}

export default function Home() {
  const { productData, formatPrice, countryConfig, addToCart } = useStore()
  const [selectedGramId, setSelectedGramId] = useState('100g')
  const [activeFaqIndex, setActiveFaqIndex] = useState(0)
  const [activeUseIndex, setActiveUseIndex] = useState(0)

  const selectedGram =
    productData.gramVariants.find(v => v.grams === selectedGramId) ||
    productData.gramVariants[0] ||
    productData.gramVariants[1]

  const gramTabs = productData.gramVariants.map(v => ({
    id: v.grams,
    label: v.label,
    badge: v.popular ? 'Popular' : null
  }))

  const handleQuickAdd = () => {
    addToCart({
      id: 'bambaura-9x-salt',
      title: 'Bambaura 9X Bamboo Roasted Salt',
      grams: selectedGram.grams,
      grind: 'Fine Granules',
      priceUSD: selectedGram.priceUSD,
      image: selectedGram.image,
      quantity: 1
    })
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION WITH 9 ROASTING CYCLES & BROWNISH GRANULES FOCUS */}
      <HeroSection
        onSelectGram={(g) => setSelectedGramId(g)}
      />

      {/* 2. HIGHLIGHTS & TRADITION SHOWCASE SLIDER */}
      <HeroSlider />

      {/* 2. TRUST BADGE BAR (MATCHING REFERENCE MOCKUP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
            {HOME_DATA.trustBadges.map((badge, idx) => {
              const Icon = iconMap[badge.icon] || Sparkles
              return (
                <div key={idx} className="flex items-center justify-center gap-2 p-2 rounded-xl text-[#401010] dark:text-[#dfb983]">
                  <Icon className="w-4 h-4 text-[#b28346] shrink-0" />
                  <span className="font-serif font-bold tracking-tight text-[11px] sm:text-xs">
                    {badge.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. 21ST.DEV MARQUEE TICKER (NINE ROASTING CYCLES BENCHMARKS) */}
      <section className="border-y border-[#b28346]/20 bg-[#f5eedf]/60 dark:bg-[#160606] py-3">
        <Marquee speed="32s">
          {HOME_DATA.marqueeItems.map((item, idx) => {
            const Icon = iconMap[item.icon] || Sparkles
            return (
              <React.Fragment key={idx}>
                <span className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-widest text-[#401010] dark:text-[#dfb983]">
                  <Icon className="w-4 h-4 text-amber-500" /> {item.text}
                </span>
                <span className="text-[#b28346] opacity-40">•</span>
              </React.Fragment>
            )
          })}
        </Marquee>
      </section>

      {/* 4. BAMBAURA 9X TRADITIONAL BENEFITS */}
      <BenefitsSection />

      {/* 4. THE SINGLE PRODUCT HIGHLIGHT (100g, 250g, 50g, 500g ALLOCATIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Our Single Flagship Product
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Bambaura 9X Bamboo Roasted Salt
          </h2>
          <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
            Prepared through nine roasting cycles inside bamboo tubes. Recognisable by its distinctive brownish colour and fine granules, this salt brings a unique story and presentation to your kitchen.
          </p>
        </div>

        {/* 21ST.DEV ANIMATED PILL TABS FOR GRAM SWITCHER */}
        <div className="flex justify-center mb-10">
          <AnimatedPillTabs
            tabs={gramTabs}
            activeTab={selectedGramId}
            onChange={(id) => setSelectedGramId(id)}
            layoutId="homeGramPill"
          />
        </div>

        {/* ACTIVE GRAM SPOTLIGHT WITH SHINE BORDER */}
        <ShineBorder className="shadow-2xl">
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-white to-[#faf5ee] dark:from-[#1b0808] dark:to-[#120404]">
            
            <div className="lg:col-span-5 flex justify-center">
              <SpotlightCard className="w-64 h-64 sm:w-80 sm:h-80 p-6 flex items-center justify-center">
                <img
                  src={selectedGram.image}
                  alt={selectedGram.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl"
                />
              </SpotlightCard>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                  Selected Allocation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
                  {selectedGram.name}
                </h3>
                <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] mt-2">
                  {selectedGram.subtext}
                </p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#dfb983]">
                  {formatPrice(selectedGram.priceUSD)}
                </span>
                <span className="text-xs text-[#9c8378] line-through">
                  Amazon MRP {formatPrice(selectedGram.amazonUSD)}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                  Direct Reserve Savings
                </span>
              </div>

              {/* USP LIST (MATCHING USER DIRECTIVE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9]">
                  <Check className="w-4 h-4 text-[#b28346] shrink-0" />
                  <span>Nine Roasting Cycles in Bamboo Tubes</span>
                </div>
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9]">
                  <Check className="w-4 h-4 text-[#b28346] shrink-0" />
                  <span>Distinctive Natural Brownish Colour</span>
                </div>
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9]">
                  <Check className="w-4 h-4 text-[#b28346] shrink-0" />
                  <span>Fine Granule Texture for Cooking</span>
                </div>
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9]">
                  <Check className="w-4 h-4 text-[#b28346] shrink-0" />
                  <span>Free Shipping over {countryConfig.symbol}{countryConfig.freeShip}</span>
                </div>
              </div>

              {/* CALL TO ACTION BUTTONS WITH INSTANT 1-CLICK ADD TO BAG */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="py-4 px-6 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to cart — {formatPrice(selectedGram.priceUSD)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to={`/product?grams=${selectedGram.grams}`}
                  className="px-6 py-4 rounded-2xl border border-[#e6d8c4] dark:border-[#381616] text-[#401010] dark:text-[#f7ebd9] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  View Details & Packaging
                </Link>
              </div>
            </div>

          </div>
        </ShineBorder>
      </section>

      {/* 5. THE 9-STAGE ALCHEMY STORY SECTION & 4 USP CARDS */}
      <section className="bg-[#401010] dark:bg-[#120404] text-[#f7ebd9] py-20 border-y border-[#b28346]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#dfb983]">
                {HOME_DATA.alchemySection?.badge || 'The Roasting Journey'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                {HOME_DATA.alchemySection?.title || 'The Story of Nine Roasting Cycles Inside Bamboo Tubes'}
              </h2>
              {(HOME_DATA.alchemySection?.paragraphs || []).map((para, idx) => (
                <p key={idx} className="text-sm text-[#dfb983]/90 leading-relaxed">
                  {para}
                </p>
              ))}

              <div className="pt-2">
                <Link to="/process">
                  <ShimmerButton className="bg-[#b28346] text-[#240808] dark:bg-[#dfb983] dark:text-[#120404]">
                    <span>Read The Complete 9-Cycle Journey</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOME_DATA.uspCards.map((card, idx) => {
                const Icon = iconMap[card.icon] || Sparkles
                return (
                  <SpotlightCard key={idx} className="p-6 bg-white/5 border border-[#b28346]/20 space-y-2">
                    <Icon className="w-6 h-6 text-[#dfb983]" />
                    <h4 className="font-serif font-bold text-lg text-white">{card.title}</h4>
                    <p className="text-xs text-amber-100/70 leading-relaxed">{card.description}</p>
                  </SpotlightCard>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 5. DETAILED COMPARISON MATRIX (BAMBAURA 9X VS OTHER SALTS) */}
      <SaltComparison />

      {/* 6. REAL ROASTED SALT PRESENTATION (FROM USER PHOTOS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-lg">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
              Authentic Visual Inspection
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              Recognisable by its Distinctive Brownish Colour
            </h3>
            <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              When natural rock salt is repeatedly roasted inside thick mountain bamboo stalks over pine firewood, the interaction of extreme heat, bamboo sap, and mineral clay produces this characteristic brownish-amber crystalline structure.
            </p>
            <div className="pt-2">
              <Link
                to="/product"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#401010] dark:text-[#dfb983] hover:underline"
              >
                <span>View Packaging Options (100g & 250g)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-2xl border border-[#b28346]/30 shadow-md group">
              <img
                src="/images/extracted/bambaura_packaging_showcase_duo.jpg"
                alt="Bambaura 9X 100g & 250g Packaging with Gold Barrier Pouch"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-3 bg-[#faf5ee] dark:bg-[#200c0c] text-[11px] font-mono text-[#401010] dark:text-[#dfb983] flex items-center justify-between">
                <span>100g & 250g Canisters + Pouch</span>
                <span className="font-bold">Pure Salt | Richer Living</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#b28346]/30 shadow-md group">
              <img
                src="/images/extracted/bambaura_artisans_bamboo_kiln.jpg"
                alt="Traditional Mountain Bamboo Tube Roasting Over Fire"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-3 bg-[#faf5ee] dark:bg-[#200c0c] text-[11px] font-mono text-[#401010] dark:text-[#dfb983] flex items-center justify-between">
                <span>Hand-Fired in Bamboo Tubes</span>
                <span className="font-bold">Nine Cycles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE 5-DISH CULINARY PAIRING STAGE (BRIEF ITEM 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <SpotlightCard className="p-8 sm:p-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#e6d8c4] dark:border-[#381616] pb-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                Taste Profile &amp; Five Everyday Uses
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                Smoky, savoury and mineral-rich, with a gentle egg-like note.
              </h3>
              <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                A single pinch is enough. Use Bambaura 9X as an elevated finishing salt at the table, not for bulk cooking.
              </p>
            </div>

            <Link
              to="/recipes"
              className="text-xs font-bold uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983] hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>Explore All 5 Recipes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 5 DISH BUTTON SELECTORS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(RECIPES_DATA.fiveUses || []).map((use, idx) => (
              <button
                key={use.id}
                type="button"
                onClick={() => setActiveUseIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeUseIndex === idx
                    ? 'border-[#b28346] bg-[#401010] text-[#f7ebd9] dark:bg-[#dfb983] dark:text-[#120505] shadow-md font-bold scale-[1.02]'
                    : 'border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#1a0808] text-[#401010] dark:text-[#f7ebd9] hover:border-[#b28346]/60'
                }`}
              >
                <span className="text-[10px] font-mono uppercase block opacity-80">
                  0{idx + 1} • {use.category}
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm mt-1 block line-clamp-1">
                  {use.title}
                </span>
              </button>
            ))}
          </div>

          {/* ACTIVE DISH VISUAL STAGE */}
          {RECIPES_DATA.fiveUses && RECIPES_DATA.fiveUses[activeUseIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                  Recommended Pairing No. 0{activeUseIndex + 1}
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                  {RECIPES_DATA.fiveUses[activeUseIndex].title}
                </h4>
                <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                  {RECIPES_DATA.fiveUses[activeUseIndex].description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8c6027] dark:text-[#dfb983] pt-1">
                  <span className="px-3 py-1 rounded-full bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
                    Ideal Texture: <strong>{RECIPES_DATA.fiveUses[activeUseIndex].grind}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
                    Serving Size: <strong>1 Gentle Pinch</strong>
                  </span>
                </div>

                <div className="pt-2">
                  <Link to="/product">
                    <ShimmerButton>
                      <span>Order Finishing Canister — {formatPrice(24)}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </ShimmerButton>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-[#b28346]/40 shadow-xl max-h-72">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={RECIPES_DATA.fiveUses[activeUseIndex].image}
                    src={RECIPES_DATA.fiveUses[activeUseIndex].image}
                    alt={RECIPES_DATA.fiveUses[activeUseIndex].title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-72 object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>
          )}
        </SpotlightCard>
      </section>

      {/* 8. VERIFIED CUSTOMER REVIEWS (BRIEF ITEM 12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-serif font-bold text-lg text-[#401010] dark:text-[#dfb983]">
              4.96 / 5 Rating
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Real Customer Experiences
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] max-w-md mx-auto">
            Honest feedback from home cooks and food enthusiasts enjoying Bambaura 9X across India and worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SpotlightCard className="p-6 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <h4 className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
              "Unmatched smoky depth on morning eggs"
            </h4>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              The brownish granules have a subtle egg and smoky fragrance that immediately transforms fried eggs and avocado toast. You literally only need a tiny pinch.
            </p>
            <div className="pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616] text-[11px] flex justify-between items-center">
              <span className="font-semibold text-[#401010] dark:text-[#dfb983]">Aditi S. (Bangalore)</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <h4 className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
              "The 9-roast process shows in the flavour"
            </h4>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              Deeply savoury with a rich umami note. I was skeptical about bamboo roasting until I tasted it on paneer tikka. Beautiful gold pouch packaging too.
            </p>
            <div className="pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616] text-[11px] flex justify-between items-center">
              <span className="font-semibold text-[#401010] dark:text-[#dfb983]">Rohan M. (Mumbai)</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 space-y-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <h4 className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9]">
              "Incredible on grilled meats & watermelon"
            </h4>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              Sprinkled a pinch over ribeye and later cold watermelon slices. The smoky-savoury contrast with sweet fruit is incredible. Arrived quickly to London.
            </p>
            <div className="pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616] text-[11px] flex justify-between items-center">
              <span className="font-semibold text-[#401010] dark:text-[#dfb983]">David K. (London, UK)</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 9. CURATED FREQUENTLY ASKED QUESTIONS ACCORDION (ALL 7 FAQS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Questions About Bambaura 9X
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#180707] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#401010] dark:text-[#f7ebd9]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#b28346] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed border-t border-[#e6d8c4]/40 dark:border-[#381616]/40 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* 9. CULINARY PARTNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ShineBorder className="shadow-2xl">
          <div className="p-8 sm:p-10 bg-gradient-to-r from-[#401010] to-[#260808] text-[#f7ebd9] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#dfb983]">
                {HOME_DATA.ambassadorBanner?.badge || 'Culinary Creators & Chefs'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {HOME_DATA.ambassadorBanner?.title || 'Share the Bambaura Story'}
              </h3>
              <p className="text-xs text-amber-200/80 max-w-lg">
                {HOME_DATA.ambassadorBanner?.description || 'Join our Culinary Partner Circle to share authentic traditional bamboo roasted salt with food enthusiasts and home cooks.'}
              </p>
            </div>

            <Link to="/affiliate">
              <ShimmerButton className="bg-[#b28346] text-[#240808] dark:bg-[#dfb983] dark:text-[#120404]">
                <span>Learn About Partner Program</span>
              </ShimmerButton>
            </Link>
          </div>
        </ShineBorder>
      </section>

    </div>
  )
}
