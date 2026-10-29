import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Award, Compass, Sparkles } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import ShimmerButton from '../ui/ShimmerButton'

export default function HeroEditorial({ onSelectGram }) {
  const { productData, formatPrice } = useStore()
  const [selectedGrams, setSelectedGrams] = useState('100g')

  const currentVariant =
    productData.gramVariants.find(v => v.grams === selectedGrams) ||
    productData.gramVariants[1]

  const handleSelect = (grams) => {
    setSelectedGrams(grams)
    if (onSelectGram) onSelectGram(grams)
  }

  return (
    <div className="relative w-full py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
      {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & GRAM CHOOSER */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase font-mono text-[#b28346] dark:text-[#dfb983]">
          <Compass className="w-4 h-4 text-[#b28346]" />
          <span>Vol. I — The Alchemy of Earth & Fire</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#401010] dark:text-[#fdfbf7] leading-[1.12] tracking-tight">
          Ancient Purity. <br />
          <span className="italic font-normal text-[#b28346] dark:text-[#dfb983]">Modern Mastery.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed max-w-xl">
          Harvested from unpolluted deep Himalayan mineral beds. Hand-sealed in three-year-old giant mountain bamboo with yellow forest clay and fired nine times at 1,500°C over natural resinous pine wood.
        </p>

        {/* EMBEDDED EDITORIAL GRAM SELECTOR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#1a0808]/80 border border-[#b28346]/30 backdrop-blur shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">Select Gram Size:</span>
            <span className="font-bold text-[#b28346] dark:text-[#dfb983] font-mono">
              {formatPrice(currentVariant.priceUSD)} USD
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {productData.gramVariants.map((v) => {
              const isSelected = selectedGrams === v.grams
              return (
                <button
                  key={v.grams}
                  onClick={() => handleSelect(v.grams)}
                  className={`p-2.5 rounded-xl border text-xs font-mono text-center transition-all ${
                    isSelected
                      ? 'border-[#b28346] bg-[#b28346] text-white shadow-md shadow-[#b28346]/20 font-bold'
                      : 'border-gray-200 dark:border-white/10 hover:border-[#b28346]/50 bg-white/50 dark:bg-[#200c0c]/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>{v.grams}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    ${v.priceUSD}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="text-[11px] text-gray-500 dark:text-gray-400 pt-1 flex items-center gap-1.5 font-mono">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>{currentVariant.name}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Link to={`/product?grams=${selectedGrams}`} className="w-full sm:w-auto">
            <ShimmerButton className="w-full sm:w-auto justify-center">
              <span>Shop {selectedGrams} Reserve</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </ShimmerButton>
          </Link>
          <Link
            to="/science"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[#b28346]/40 text-[#401010] dark:text-[#dfb983] text-center font-semibold text-xs tracking-wider uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Laboratory Analysis
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: DUAL-PANE ARTISANAL FRAMING */}
      <div className="lg:col-span-5 relative">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#2a0c0c] to-[#120505] border border-[#b28346]/30 p-4 aspect-[4/5] flex flex-col justify-between shadow-xl"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb983]">Signature Canister</span>
            <img
              src={currentVariant.image || '/images/extracted/hi_canister_100g.png'}
              alt="Bambaura Canister"
              className="w-full h-40 object-contain drop-shadow-xl my-auto"
            />
            <div className="text-[11px] text-[#f7ebd9] font-serif">Imperial Bamboo Culm Packaging</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#2a0c0c] to-[#120505] border border-[#b28346]/30 p-4 aspect-[4/5] flex flex-col justify-between shadow-xl mt-6"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#dfb983]">Active Crystals</span>
            <img
              src="/images/extracted/hi_salt_bowl.png"
              alt="Active Crystals"
              className="w-full h-40 object-contain drop-shadow-xl my-auto"
            />
            <div className="text-[11px] text-[#f7ebd9] font-serif">Purple-Black Sulfuric Matrix</div>
          </motion.div>
        </div>

        {/* TASTING NOTE PILL */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 dark:bg-[#1a0808]/95 border border-[#b28346]/40 rounded-xl p-3 shadow-xl backdrop-blur flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#b28346]" />
            <span className="font-serif italic font-semibold">Tasting Profile:</span>
          </div>
          <span className="font-mono text-[11px] text-gray-600 dark:text-gray-300">Smoky Umami • Zero Bitterness</span>
        </div>
      </div>
    </div>
  )
}

