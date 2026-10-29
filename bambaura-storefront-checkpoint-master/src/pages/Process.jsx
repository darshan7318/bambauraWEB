import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, Sparkles, ShieldCheck, Check, X, ArrowRight, Award,
  Clock, Mountain, Layers, ChevronRight, Calendar, ShoppingBag
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import SpotlightCard from '../components/ui/SpotlightCard'
import ShineBorder from '../components/ui/ShineBorder'
import ShimmerButton from '../components/ui/ShimmerButton'
import PROCESS_DATA from '../data/process.json'

export default function Process() {
  const { formatPrice } = useStore()
  const [activeCycle, setActiveCycle] = useState(8) // Default to 9th Cycle (index 8)

  const roastingCycles = PROCESS_DATA.roastingCycles || []
  const comparisonRows = PROCESS_DATA.comparisonRows || []
  const timelineStages = PROCESS_DATA.timelineStages || []
  const currentCycle = roastingCycles[activeCycle] || roastingCycles[8]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
      
      {/* 1. PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
          Master Kiln Craftsmanship
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9] leading-tight">
          The 9X Bamboo Roasting Journey
        </h1>
        <p className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          How sustained pine firewood heat, mountain bamboo stalks, and mineral yellow clay transform natural sea salt over nine roasting cycles into fine brownish granules with distinctive culinary depth.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#8c6027] dark:text-[#dfb983] pt-2">
          <span>• 21 Days of Patient Roasting</span>
          <span>• 1,500°C Peak Fusion</span>
          <span>• 9 Fresh Bamboo Tubes</span>
          <span>• Pure Yellow Clay Seals</span>
        </div>
      </div>

      {/* 2. INTERACTIVE 9-CYCLE STEPPER & KILN METER */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6d8c4] dark:border-[#381616] pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              Step Through The Nine Cycles
            </h3>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] mt-0.5">
              Click any cycle to watch the temperature, duration, and crystal color shift:
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#401010] text-[#dfb983] self-start sm:self-auto">
            Cycle 0{activeCycle + 1} of 09 • {currentCycle.temp}
          </span>
        </div>

        {/* 9-STEP BUTTONS WITH THERMAL PROGRESSION */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {roastingCycles.map((c, i) => (
            <button
              key={c.cycle}
              type="button"
              onClick={() => setActiveCycle(i)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                activeCycle === i
                  ? 'border-[#b28346] bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] shadow-xl scale-105 ring-2 ring-[#b28346]/40'
                  : 'border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#1a0808] text-[#401010] dark:text-[#f7ebd9] hover:border-[#b28346]/60'
              }`}
            >
              <div className="text-xs font-mono font-bold">0{c.cycle}X</div>
              <div className="text-[10px] opacity-80 mt-0.5">{c.temp}</div>
            </button>
          ))}
        </div>

        {/* ACTIVE CYCLE DETAIL SPOTLIGHT WITH DYNAMIC COLOR STAGE */}
        <ShineBorder className="shadow-2xl">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-[#faf5ee] to-white dark:from-[#1d0a0a] dark:to-[#120404] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] text-xs font-bold font-mono">
                  FIRING STAGE 0{currentCycle.cycle}
                </span>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Kiln Temperature: {currentCycle.temp}
                </span>
                <span className="text-xs text-[#6b534b] dark:text-[#c2ada4] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Firing Duration: {currentCycle.duration}
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                {currentCycle.title}
              </h3>

              <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                {currentCycle.description}
              </p>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: currentCycle.color }}
                  />
                  <span className="font-semibold text-[#401010] dark:text-[#f7ebd9]">
                    Salt Appearance: {currentCycle.colorLabel}
                  </span>
                </div>
                <span className="font-mono text-[#8c6027] dark:text-[#dfb983] text-[11px]">
                  Cycle {currentCycle.cycle} / 9
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] text-xs font-semibold uppercase tracking-wider shadow-md hover:opacity-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Taste The 9X Harvest</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                <Link
                  to="/science"
                  className="px-6 py-3.5 rounded-full border border-[#e6d8c4] dark:border-[#381616] text-[#401010] dark:text-[#f7ebd9] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  View Lab COA
                </Link>
              </div>
            </div>

            {/* RIGHT: KILN VISUAL STAGE */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#faf5ee] dark:bg-[#250d0d] border-2 border-[#b28346]/40 p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-xl relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-15 blur-2xl pointer-events-none"
                  style={{ backgroundColor: currentCycle.color }}
                />
                <div className="w-20 h-20 rounded-full bg-[#401010] text-[#dfb983] flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-[#b28346]/30">
                  {currentCycle.cycle}X
                </div>
                <p className="font-serif font-bold text-xl text-[#401010] dark:text-[#f7ebd9]">
                  {currentCycle.temp}
                </p>
                <span className="text-xs text-[#8c6027] dark:text-[#dfb983] font-semibold">
                  Pine Wood Flame Kiln
                </span>
                <span className="text-[11px] font-mono text-gray-500">
                  {currentCycle.duration} sustained heat
                </span>
              </div>
            </div>

          </div>
        </ShineBorder>
      </section>

      {/* 3. 21-DAY BATCH TIMELINE ROADMAP */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Patience &amp; Precision
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            The 21 Days of Fire: Batch Roadmap
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4]">
            Why 9X salt cannot be rushed: A journey spanning three weeks from forest bamboo to finishing crystals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {timelineStages.map((t, idx) => (
            <SpotlightCard key={idx} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#401010] text-[#dfb983]">
                    STAGE {t.stage}
                  </span>
                  <span className="text-xs font-semibold text-[#8c6027] dark:text-[#dfb983]">
                    {t.days}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#401010] dark:text-[#f7ebd9] pt-1">
                  {t.title}
                </h4>
                <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                  {t.description}
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8c6027] dark:text-[#dfb983] border-t border-[#e6d8c4]/60 dark:border-[#381616] pt-2">
                Phase {idx + 1} of 5
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 4. REAL ARTISANAL KILN FIRING PRESENTATION */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Traditional Kiln Mastery
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Hand-Fired in Mountain Bamboo Tubes
          </h3>
          <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
            Every batch of Bambaura is hand-packed tightly into thick mountain bamboo stalks, sealed with pure yellow clay, and loaded over natural pine firewood. Fired through nine iterative cycles to infuse natural bamboo sap and develop its characteristic brownish colour and savoury, smoky finish.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8c6027] dark:text-[#dfb983] pt-1">
            <span>• 100% Traditional Hand-Firing</span>
            <span>• Pure Yellow Clay Seals</span>
            <span>• Nine Iterative Cycles</span>
          </div>
        </div>

        <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-[#b28346]/40 shadow-lg">
          <img
            src="/images/extracted/bambaura_artisans_bamboo_kiln.jpg"
            alt="Traditional Bamboo Packing & Kiln Firing"
            className="w-full h-80 object-cover"
          />
        </div>
      </section>

      {/* 5. WHY 9X? COMPARISON MATRIX & HONEST COST JUSTIFICATION (BRIEF ITEM 3) */}
      <section className="space-y-8 pt-12 border-t border-[#e6d8c4] dark:border-[#381616]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Understanding The Value
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Why 9x? Regular Salt vs 1x vs 3x vs 9x
          </h2>
          <p className="text-sm font-serif italic text-[#8c6027] dark:text-[#dfb983] max-w-xl mx-auto bg-[#faf5ee] dark:bg-[#1f0b0b] p-3 rounded-2xl border border-[#e6d8c4] dark:border-[#381616]">
            "Each batch takes 21 days and nine firings, and much of the salt is lost in the process."
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-x-auto rounded-3xl border border-[#e6d8c4] dark:border-[#381616] shadow-xl bg-white dark:bg-[#180707] scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-[#401010] dark:bg-[#120404] text-[#f7ebd9]">
                <th className="p-4 sm:p-5 font-serif font-bold text-sm">Criterion</th>
                <th className="p-4 sm:p-5 font-serif font-semibold text-xs text-amber-200/70">
                  Regular Salt
                </th>
                <th className="p-4 sm:p-5 font-serif font-semibold text-xs text-amber-200/80">
                  1x Bamboo Salt
                </th>
                <th className="p-4 sm:p-5 font-serif font-semibold text-xs text-amber-200/90">
                  3x Bamboo Salt
                </th>
                <th className="p-4 sm:p-5 font-serif font-bold text-sm text-[#dfb983] bg-[#2d0a0a] dark:bg-[#200808]">
                  Bambaura 9x (9 Firings)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d8c4] dark:divide-[#381616]">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf5ee]/50 dark:hover:bg-[#250d0d]/30 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#401010] dark:text-[#f7ebd9]">
                    {row.factor}
                  </td>
                  <td className="p-4 sm:p-5 text-[#9c8378]">
                    {row.regular}
                  </td>
                  <td className="p-4 sm:p-5 text-[#6b534b] dark:text-[#c2ada4]">
                    {row.oneX}
                  </td>
                  <td className="p-4 sm:p-5 text-[#6b534b] dark:text-[#c2ada4]">
                    {row.threeX}
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-[#401010] dark:text-[#dfb983] bg-[#faf5ee] dark:bg-[#220c0c]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <span>{row.nineX}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
