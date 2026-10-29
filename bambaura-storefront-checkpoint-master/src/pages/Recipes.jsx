import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChefHat, Sparkles, Clock, Check, ArrowRight, Heart, Utensils
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import RECIPES_DATA from '../data/recipes.json'

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState(0)
  const recipes = RECIPES_DATA.recipes
  const currentRecipe = recipes[selectedRecipe]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-20">
      
      {/* 1. HEADER & TASTE PROFILE (EXACT USER SPEC) */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
          Taste Profile & Everyday Finishing
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9]">
          Smoky, Mineral, Savoury.
        </h1>
        <p className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          {RECIPES_DATA.tasteProfile.description}
        </p>
        <div className="inline-block px-5 py-2.5 rounded-full bg-[#faf5ee] dark:bg-[#200c0c] border border-[#b28346]/40 text-xs font-semibold text-[#8c6027] dark:text-[#dfb983] shadow-xs">
          💡 {RECIPES_DATA.tasteProfile.usageRule}
        </div>
      </div>

      {/* 2. FIVE EASY FINISHING USES */}
      <div className="space-y-6">
        <div className="border-b border-[#e6d8c4] dark:border-[#381616] pb-3 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Everyday Inspiration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
            Five Everyday Uses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(RECIPES_DATA.fiveUses || []).map((use, idx) => (
            <div
              key={use.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-md flex flex-col justify-between space-y-3 hover:border-[#b28346] transition-all group"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983] font-bold">
                  0{idx + 1} • {use.category}
                </span>
                <h4 className="font-serif font-bold text-base text-[#401010] dark:text-[#f7ebd9] group-hover:text-[#b28346] transition-colors">
                  {use.title}
                </h4>
                <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                  {use.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[#e6d8c4]/40 dark:border-[#381616]/40 text-[10px] font-mono text-[#8c6027] dark:text-[#dfb983] flex items-center justify-between">
                <span>Best with:</span>
                <span className="font-bold">{use.grind}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE 4-STEP PACKAGING & FRESHNESS RITUAL */}
      <div className="space-y-8">
        <div className="border-b border-[#e6d8c4] dark:border-[#381616] pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Freshness & Care
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
            The 4-Step Packaging & Seasoning Ritual
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] mt-1">
            How to open, season with, and reseal your canister and gold barrier pouch to keep the brownish granules crisp, dry, and aromatic.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-[#b28346]/30 shadow-xl">
          <img
            src="/images/extracted/bambaura_packaging_showcase_duo.jpg"
            alt="Bambaura 9X Official Packaging & Decanting Experience"
            className="w-full max-h-80 object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(RECIPES_DATA.decantingRitual || []).map((step, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#1a0808] border border-[#e6d8c4] dark:border-[#381616] shadow-md space-y-4 text-center">
              <div className="h-40 rounded-2xl bg-[#faf5ee] dark:bg-[#250d0d] p-3 flex items-center justify-center">
                <img src={step.image} alt={step.title} className="max-h-full object-contain" />
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#401010] text-[#f7ebd9]">
                {step.stage || `STAGE 0${step.step}`}
              </span>
              <h4 className="font-serif font-bold text-lg text-[#401010] dark:text-[#f7ebd9]">
                {step.title}
              </h4>
              <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CHEF MASTERCLASS RECIPES */}
      <div className="space-y-8 pt-12 border-t border-[#e6d8c4] dark:border-[#381616]">
        <div className="border-b border-[#e6d8c4] dark:border-[#381616] pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Culinary Repertoire
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
            Chef Masterclass Recipes
          </h2>
        </div>

        {/* RECIPE SELECTOR TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recipes.map((r, i) => (
            <button
              key={i}
              onClick={() => setSelectedRecipe(i)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedRecipe === i
                  ? 'border-[#b28346] bg-[#faf5ee] dark:bg-[#250d0d] shadow-md ring-2 ring-[#b28346]/40'
                  : 'border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#1a0808] hover:border-[#b28346]/60'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983] block">
                {r.category}
              </span>
              <p className="font-serif font-bold text-sm text-[#401010] dark:text-[#f7ebd9] mt-1 line-clamp-1">
                {r.title}
              </p>
            </button>
          ))}
        </div>

        {/* ACTIVE RECIPE SPOTLIGHT */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#e6d8c4] dark:border-[#381616] shadow-md">
              <img
                src={currentRecipe.image}
                alt={currentRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-[#401010] dark:text-[#f7ebd9]">Recommended Grind</span>
                <span className="text-[#8c6027] dark:text-[#dfb983] font-semibold">{currentRecipe.pairingGrind}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#401010] dark:text-[#f7ebd9]">Preparation Time</span>
                <span>{currentRecipe.prepTime}</span>
              </div>
            </div>

            <Link
              to="/product"
              className="w-full py-3.5 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <span>Order Pairing Salt</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                {currentRecipe.category}
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
                {currentRecipe.title}
              </h3>
              <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed mt-2">
                {currentRecipe.description}
              </p>
            </div>

            {/* INGREDIENTS */}
            <div>
              <h4 className="font-serif font-bold text-base text-[#401010] dark:text-[#dfb983] mb-3">
                Ingredients & Pairings
              </h4>
              <ul className="space-y-1.5 text-xs text-[#6b534b] dark:text-[#c2ada4]">
                {currentRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#b28346] flex-shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <h4 className="font-serif font-bold text-base text-[#401010] dark:text-[#dfb983] mb-3">
                Culinary Method
              </h4>
              <ol className="space-y-2 text-xs text-[#6b534b] dark:text-[#c2ada4]">
                {currentRecipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#401010] text-[#f7ebd9] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

