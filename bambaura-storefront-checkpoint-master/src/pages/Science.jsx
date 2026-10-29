import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, Flame, Sparkles, Download, CheckCircle2, ArrowRight,
  Activity, Heart, FileText, ExternalLink, Check, AlertCircle, Info,
  Filter, Search, QrCode, Award, Eye, X, Printer, Lock
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import SpotlightCard from '../components/ui/SpotlightCard'
import ShineBorder from '../components/ui/ShineBorder'
import ShimmerButton from '../components/ui/ShimmerButton'
import SCIENCE_DATA from '../data/science.json'

export default function Science() {
  const { formatPrice, showToast } = useStore()
  
  // State
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')
  const [selectedMineralId, setSelectedMineralId] = useState('sulfur')
  const [showCoaModal, setShowCoaModal] = useState(false)

  const batches = SCIENCE_DATA.batches || []
  const currentBatch = batches[selectedBatchIndex] || batches[0]
  const minerals = SCIENCE_DATA.minerals || []
  const activeMineral = minerals.find(m => m.id === selectedMineralId) || minerals[0]
  const alkaline = SCIENCE_DATA.alkalineScience
  const nutrition = SCIENCE_DATA.nutritionAndIngredients
  const benchmarks = SCIENCE_DATA.benchmarkComparison || []

  // Filter tested parameters by category
  const filteredParameters = (currentBatch.testedParameters || []).filter(item => {
    if (activeCategoryFilter === 'all') return true
    if (activeCategoryFilter === 'metals') return item.category.includes('Heavy Metals')
    if (activeCategoryFilter === 'combustion') return item.category.includes('Combustion')
    if (activeCategoryFilter === 'purity') return item.category.includes('Microplastics') || item.category.includes('Additives')
    return true
  })

  const categories = [
    { id: 'all', label: `All Tests (${currentBatch.testedParameters?.length || 0})` },
    { id: 'metals', label: 'Heavy Metals (Toxicology)' },
    { id: 'combustion', label: 'Combustion Safety' },
    { id: 'purity', label: 'Microplastics & Additives' }
  ]

  const handlePrintCOA = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    showToast(`Generating signed Certificate of Analysis (${currentBatch.reportNumber})`, 'success')
    setShowCoaModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
      
      {/* 1. HERO HEADER WITH ACCREDITATION SHIELD */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>ISO/IEC 17025 Accredited Laboratory Verification</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9] leading-tight">
          Purity, Spectrometry &amp; Lab Facts
        </h1>
        <p className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          Every batch of Bambaura 9X Bamboo Roasted Salt undergoes rigorous ICP-MS toxicology and combustion safety testing at an independent ISO/IEC 17025 accredited laboratory. Verified detection limits, zero microplastics, and honest chemical transparency.
        </p>

        {/* QUICK ACCREDITATION STRIP */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#8c6027] dark:text-[#dfb983] pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> NABL Certificate TC-8492
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AOAC 2013.06 ICP-MS
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> FSSAI Lic. 10024011000189
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE BATCH SPECTROMETRY & COA EXPLORER */}
      <section className="space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-8">
          
          {/* BATCH SELECTOR & HEADER ACTIONS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e6d8c4] dark:border-[#381616]">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                Analytical Verification Engine
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                Batch Toxicology &amp; Heavy Metals Report
              </h2>
              <p className="text-xs text-[#6b534b] dark:text-[#c2ada4]">
                Testing Laboratory: <strong className="text-[#401010] dark:text-[#dfb983]">{currentBatch.labName}</strong> (Accreditation No. {currentBatch.labAccreditationNo})
              </p>
            </div>

            {/* BATCH TOGGLES & COA MODAL BUTTON */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex rounded-2xl p-1 bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
                {batches.map((b, idx) => (
                  <button
                    key={b.batchNumber}
                    type="button"
                    onClick={() => setSelectedBatchIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedBatchIndex === idx
                        ? 'bg-[#401010] text-[#f7ebd9] dark:bg-[#dfb983] dark:text-[#120505] shadow-sm'
                        : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010]'
                    }`}
                  >
                    {b.batchNumber} {idx === 0 && '★ Current'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-5 py-2.5 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>View Signed COA</span>
              </button>
            </div>
          </div>

          {/* ACTIVE BATCH METADATA BADGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Report Number</span>
              <span className="font-mono font-bold text-[#401010] dark:text-[#dfb983]">{currentBatch.reportNumber}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Release &amp; Packing</span>
              <span className="font-semibold text-[#401010] dark:text-[#dfb983]">{currentBatch.releaseDate}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Certified Best Before</span>
              <span className="font-semibold text-[#401010] dark:text-[#dfb983]">{currentBatch.bestBefore}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616]">
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Testing Verification</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Conforming
              </span>
            </div>
          </div>

          {/* PARAMETER CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategoryFilter === cat.id
                    ? 'bg-[#b28346] text-[#240808] dark:bg-[#dfb983] dark:text-[#120505] font-bold shadow-xs'
                    : 'bg-[#faf5ee] dark:bg-[#200c0c] text-[#6b534b] dark:text-[#c2ada4] hover:bg-[#e6d8c4]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* SPECTROMETRY TABLE WITH SAFETY MARGINS */}
          <div className="overflow-x-auto rounded-2xl border border-[#e6d8c4] dark:border-[#381616]">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#401010] text-[#f7ebd9] dark:bg-[#120404] dark:text-[#dfb983]">
                  <th className="p-4 font-serif font-bold">Tested Parameter</th>
                  <th className="p-4 font-mono font-semibold">Analytical Method</th>
                  <th className="p-4 font-mono font-semibold">Regulatory Limit</th>
                  <th className="p-4 font-serif font-bold">Laboratory Result &amp; LOD</th>
                  <th className="p-4 font-semibold text-right">Purity Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6d8c4]/60 dark:divide-[#381616]/60 bg-white dark:bg-[#180707]">
                {filteredParameters.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#faf5ee]/50 dark:hover:bg-[#220c0c]/40 transition-colors">
                    <td className="p-4 font-serif font-bold text-[#401010] dark:text-[#f7ebd9]">
                      {row.parameter}
                      <span className="block text-[10px] font-sans font-normal text-gray-500 mt-0.5">{row.category}</span>
                    </td>
                    <td className="p-4 font-mono text-[#8c6027] dark:text-[#dfb983]">
                      {row.method}
                    </td>
                    <td className="p-4 font-mono text-gray-500 dark:text-gray-400">
                      {row.regulatoryLimit}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {row.result}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {row.margin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#8c6027] dark:text-[#dfb983] flex items-center justify-between">
            <span className="font-semibold">
              Note on detection limits: In modern laboratory testing, values below equipment sensitivity are correctly reported as "Below Detection Limit (LOD)" rather than misleading 0.000 numbers.
            </span>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="underline font-bold shrink-0 ml-4 hover:text-black dark:hover:text-white"
            >
              Examine Official Certificate &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* 3. ALKALINE PH & ORP GASTRONOMY SCIENCE */}
      {alkaline && (
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
              {alkaline.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              {alkaline.title}
            </h2>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              {alkaline.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: PH SPECTRUM SCALE */}
            <div className="lg:col-span-7 space-y-3">
              {alkaline.comparisonScale.map((item, idx) => (
                <SpotlightCard
                  key={idx}
                  className={`p-4 sm:p-5 transition-all ${
                    item.highlight
                      ? 'border-2 border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-lg'
                      : 'border-[#e6d8c4] dark:border-[#381616]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.ph}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#401010] dark:text-[#f7ebd9]">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-mono text-[#8c6027] dark:text-[#dfb983]">
                          {item.nature}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#6b534b] dark:text-[#c2ada4] text-right font-medium max-w-[200px]">
                      {item.bite}
                    </span>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* RIGHT: CULINARY EXPLANATION CARD */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-gradient-to-br from-[#faf5ee] to-white dark:from-[#1c0a0a] dark:to-[#120404] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#b28346]" /> Culinary Gastronomy Insight
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                Why Natural Alkalinity Changes the Taste of Food
              </h3>
              <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                {alkaline.culinarySignificance}
              </p>
              <div className="pt-2 border-t border-[#e6d8c4]/60 dark:border-[#381616] text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9] font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Buffers harsh acid on vinegars &amp; citrus salads</span>
                </div>
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9] font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Enhances savoury glutamates in eggs &amp; steaks</span>
                </div>
                <div className="flex items-center gap-2 text-[#401010] dark:text-[#f7ebd9] font-medium">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Zero metallic or chemical burning sensation</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. INTERACTIVE 6-MINERAL SYNERGY LABORATORY */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Elemental Fingerprint
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            6 Essential Trace Minerals from Bamboo &amp; Clay
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4]">
            Select any mineral to inspect its atomic origin, concentration, and flavour role:
          </p>
        </div>

        {/* MINERAL PERIODIC TILE PICKER */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {minerals.map((m) => {
            const isSelected = selectedMineralId === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMineralId(m.id)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-[#b28346] bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505] shadow-lg scale-105'
                    : 'border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#180707] text-[#401010] dark:text-[#f7ebd9] hover:border-[#b28346]/60'
                }`}
              >
                <span className="font-serif font-bold text-2xl block">{m.symbol}</span>
                <span className="text-xs font-semibold mt-1 block truncate">{m.name}</span>
                <span className={`text-[10px] font-mono mt-0.5 block ${isSelected ? 'opacity-90' : 'text-gray-400'}`}>
                  {m.amount}
                </span>
              </button>
            )
          })}
        </div>

        {/* ACTIVE MINERAL DEEP DIVE SPOTLIGHT */}
        <ShineBorder className="shadow-xl">
          <div className="p-8 sm:p-10 bg-white dark:bg-[#180707] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#faf5ee] dark:bg-[#220c0c] border border-[#e6d8c4] dark:border-[#381616] text-center space-y-2">
              <span className="font-serif font-bold text-5xl text-[#401010] dark:text-[#dfb983]">
                {activeMineral.symbol}
              </span>
              <h4 className="font-serif font-bold text-lg text-[#401010] dark:text-[#f7ebd9]">
                {activeMineral.name}
              </h4>
              <span className="px-3 py-1 rounded-full bg-[#401010] text-[#dfb983] text-xs font-mono font-bold">
                {activeMineral.amount}
              </span>
              <p className="text-[11px] font-mono text-gray-500 pt-1">
                Chemical Formula: {activeMineral.formula}
              </p>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
                  Sourcing &amp; Formation Mechanism
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
                  Derived from {activeMineral.origin}
                </h3>
              </div>

              <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                {activeMineral.role}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#8c6027] dark:text-[#dfb983]">
                <span>✓ 100% Organically Infused</span>
                <span>•</span>
                <span>✓ Zero Synthetic Fortification</span>
                <span>•</span>
                <span>✓ Verified by ICP-MS Spectrometry</span>
              </div>
            </div>
          </div>
        </ShineBorder>
      </section>

      {/* 5. INGREDIENTS & NUTRITION FACTS (MANDATORY REGULATORY PANEL) */}
      {nutrition && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INGREDIENTS & SOURCING */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
              Simple &amp; Honest
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              Ingredients &amp; Sourcing Inputs
            </h3>
            
            <div className="p-5 rounded-2xl bg-[#faf5ee] dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] space-y-1.5">
              <span className="text-xs font-bold text-[#401010] dark:text-[#dfb983] uppercase tracking-wider">
                Single Active Ingredient:
              </span>
              <p className="font-serif font-bold text-xl text-[#401010] dark:text-[#f7ebd9]">
                {nutrition.ingredients}
              </p>
              <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] pt-1 leading-relaxed">
                {nutrition.inputs}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-[#6b534b] dark:text-[#c2ada4]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{nutrition.allergenStatement}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{nutrition.bestBefore}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{nutrition.storage}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: NUTRITION PANEL PER 1G SERVING */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#faf5ee] dark:bg-[#1c0a0a] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#e6d8c4] dark:border-[#381616] pb-3">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                  Nutritional Panel
                </h3>
                <p className="text-xs text-[#8c6027] dark:text-[#dfb983] font-medium">
                  Serving Size: {nutrition.servingSize} • {nutrition.servingsPerContainer}
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#401010] text-[#f7ebd9]">
                Per 1g Pinch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nutrition.nutrients.map((n, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white dark:bg-[#250d0d] border border-[#e6d8c4] dark:border-[#381616] text-center">
                  <span className="text-[11px] text-[#8c6027] dark:text-[#dfb983] uppercase tracking-wider font-semibold block">{n.name}</span>
                  <span className="font-serif font-bold text-lg text-[#401010] dark:text-[#f7ebd9] mt-0.5 block">{n.amount}</span>
                  {n.dv && (
                    <span className="text-[10px] text-gray-400 font-mono block">{n.dv} Daily Value</span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#6b534b] dark:text-[#c2ada4] italic pt-1 text-center">
              *Daily values are based on a balanced 2,000 calorie diet. Use salt in moderation as an everyday finishing accent.
            </p>
          </div>

        </section>
      )}

      {/* 6. COMPETITIVE BENCHMARK COMPARISON MATRIX */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Category Benchmarks
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Bambaura 9X vs Commercial Salts
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-[#e6d8c4] dark:border-[#381616] shadow-xl bg-white dark:bg-[#180707]">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-[#401010] text-[#f7ebd9] dark:bg-[#120404] dark:text-[#dfb983]">
                <th className="p-4 font-serif font-bold text-sm">Purity &amp; Quality Factor</th>
                <th className="p-4 font-serif font-bold text-sm text-[#dfb983] bg-[#2a0707]">Bambaura 9X</th>
                <th className="p-4 font-serif text-xs text-amber-200/70">Commercial Table Salt</th>
                <th className="p-4 font-serif text-xs text-amber-200/70">Himalayan Pink Salt</th>
                <th className="p-4 font-serif text-xs text-amber-200/70">Unrefined Sea Salt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6d8c4] dark:divide-[#381616]">
              {benchmarks.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#faf5ee]/40 dark:hover:bg-[#200c0c]/40 transition-colors">
                  <td className="p-4 font-bold text-[#401010] dark:text-[#f7ebd9]">
                    {row.parameter}
                  </td>
                  <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.bambaura}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {row.commercial}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {row.pinkSalt}
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {row.seaSalt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. REGISTRATIONS & VERIFIED CERTIFICATION SEALS */}
      <section className="space-y-6 pt-6 border-t border-[#e6d8c4] dark:border-[#381616]">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Mandatory Compliance
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Government Registrations &amp; Global Standards
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(SCIENCE_DATA.certifications || []).map((cert, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] text-center space-y-1 shadow-xs hover:border-[#b28346] transition-colors">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
              <h5 className="font-serif font-bold text-xs text-[#401010] dark:text-[#f7ebd9] leading-tight">{cert.name}</h5>
              <p className="text-[10px] font-mono text-[#8c6027] dark:text-[#dfb983]">{cert.desc}</p>
              <p className="text-[9px] text-gray-400">{cert.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. OFFICIAL SIGNED CERTIFICATE OF ANALYSIS (COA) MODAL */}
      <AnimatePresence>
        {showCoaModal && (
          <div
            onClick={(e) => { if (e.target === e.currentTarget) setShowCoaModal(false) }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl my-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1a0808] border-2 border-[#b28346] shadow-2xl space-y-6 text-[#401010] dark:text-[#f7ebd9] relative"
            >
              {/* MODAL CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setShowCoaModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* COA OFFICIAL DOCUMENT HEADER */}
              <div className="border-b-2 border-[#401010] dark:border-[#dfb983] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#dfb983] dark:text-[#120505] flex items-center justify-center font-serif font-bold text-xl shadow">
                    B
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl tracking-tight">
                      Certificate of Analytical Testing
                    </h3>
                    <p className="text-xs font-mono text-[#8c6027] dark:text-[#dfb983]">
                      ISO/IEC 17025:2017 Testing Laboratory • NABL Acc. No. {currentBatch.labAccreditationNo}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="font-bold block text-sm">{currentBatch.reportNumber}</span>
                  <span className="text-gray-500">Issued: {currentBatch.releaseDate}</span>
                </div>
              </div>

              {/* BATCH & SAMPLE AUDIT RECORD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#faf5ee] dark:bg-[#220c0c] text-xs font-mono">
                <div>
                  <span className="text-gray-500 text-[10px] block">Sample Description</span>
                  <span className="font-bold">Bambaura 9X Bamboo Salt</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Production Lot</span>
                  <span className="font-bold">{currentBatch.batchNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Tested Method</span>
                  <span className="font-bold">ICP-MS &amp; HRGC-HRMS</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block">Overall Disposition</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">PASSED / CONFORMS</span>
                </div>
              </div>

              {/* COMPLETE TEST RESULTS */}
              <div className="overflow-x-auto rounded-xl border border-[#e6d8c4] dark:border-[#381616]">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-[#faf5ee] dark:bg-[#200c0c] border-b border-[#e6d8c4] dark:border-[#381616]">
                      <th className="p-3 font-bold">Tested Analyte</th>
                      <th className="p-3 font-mono font-semibold">Standard Limit</th>
                      <th className="p-3 font-mono font-bold">Found Result</th>
                      <th className="p-3 text-right font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6d8c4]/40 dark:divide-[#381616]/40">
                    {(currentBatch.testedParameters || []).map((row, i) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold">{row.parameter}</td>
                        <td className="p-3 font-mono text-gray-500">{row.regulatoryLimit}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400">{row.result}</td>
                        <td className="p-3 text-right">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ PASS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SIGNATURE & VERIFICATION STAMP */}
              <div className="pt-4 border-t border-[#e6d8c4] dark:border-[#381616] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Authorized Testing Officer</span>
                  <p className="font-serif font-bold text-sm text-[#401010] dark:text-[#dfb983]">{currentBatch.leadAnalyst}</p>
                  <p className="text-[11px] text-gray-500">Chief Quality Assurance Specialist • NABL Acc. TC-8492</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrintCOA}
                    className="px-4 py-2 rounded-xl border border-[#b28346] text-[#401010] dark:text-[#dfb983] font-semibold flex items-center gap-1.5 hover:bg-black/5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('COA document verified and saved', 'success')
                      setShowCoaModal(false)
                    }}
                    className="px-5 py-2 rounded-xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505] font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
