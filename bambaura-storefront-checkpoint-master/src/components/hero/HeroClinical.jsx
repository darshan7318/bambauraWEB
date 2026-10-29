import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap, Droplet, ArrowRight, FileCheck, CheckCircle } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import ShimmerButton from '../ui/ShimmerButton'
import SpotlightCard from '../ui/SpotlightCard'

export default function HeroClinical() {
  const { formatPrice } = useStore()

  return (
    <div className="relative w-full py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
      {/* LEFT COLUMN: BIO-ACTIVE LAB SPECIFICATIONS */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Clinical Redox Matrix • Insan Medical Benchmark</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#401010] dark:text-white leading-[1.12] tracking-tight">
          The World’s Most Potent <br />
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-normal">Antioxidant Mineral Salt.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed max-w-xl">
          Standard table and sea salts generate oxidative stress (+200 mV to +400 mV ORP). Bambaura 9X Bamboo Salt reverses cellular oxidation through extraordinary reducing power (-400 mV ORP) and an alkaline pH 10.5+ buffer.
        </p>

        {/* CLINICAL GAUGES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#1a0808] border border-emerald-500/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Redox (ORP)</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#401010] dark:text-white">-400 mV</div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Cellular Free-Radical Scavenger</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#1a0808] border border-[#b28346]/20 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#b28346] text-xs font-mono uppercase mb-1">
              <Droplet className="w-3.5 h-3.5" />
              <span>Alkaline Buffer</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#401010] dark:text-white">pH 10.5+</div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Neutralizes Metabolic Acidosis</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-[#1a0808] border border-blue-500/20 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-blue-500 text-xs font-mono uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Microplastics</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">0.00%</div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Incinerated at 1,500°C Kiln</p>
          </div>
        </div>

        {/* CLINICAL CERTIFICATIONS LIST */}
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> 84+ Trace Minerals</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Bio-Available Sulfur</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Lead & Cadmium Free</span>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Link to="/product?grams=100g" className="w-full sm:w-auto">
            <ShimmerButton className="w-full sm:w-auto justify-center bg-gradient-to-r from-emerald-800 to-[#401010]">
              <span>Order Certified 9X Reserve</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </ShimmerButton>
          </Link>
          <Link
            to="/science"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-center font-semibold text-xs tracking-wider uppercase hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
          >
            <FileCheck className="w-4 h-4" />
            <span>View Lab Certificates</span>
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: TECHNICAL PRODUCT SHOWCASE */}
      <div className="lg:col-span-5 flex justify-center relative">
        <SpotlightCard className="w-full max-w-sm sm:max-w-md aspect-square p-6 sm:p-8 flex items-center justify-center border-emerald-500/30">
          <motion.img
            src="/images/extracted/hero_product_clean.png"
            alt="Bambaura Clinical 9X Salt"
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />

          {/* ACTIVE CLINICAL TEST PILL */}
          <div className="absolute top-4 right-4 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 rounded-xl px-3 py-1.5 text-[11px] font-mono flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>BIO-ACTIVE REDOX</span>
          </div>

          <div className="absolute -bottom-4 left-4 right-4 bg-white/95 dark:bg-[#180909]/95 border border-[#b28346]/30 rounded-2xl p-3.5 shadow-2xl backdrop-blur flex items-center justify-between text-xs">
            <div>
              <div className="font-serif font-bold text-gray-900 dark:text-white">Batch #BAMB-2026-9X</div>
              <div className="text-[10px] text-gray-500">Third-Party Inductively Coupled Plasma Mass Spectrometry Verified</div>
            </div>
            <span className="badge badge-success badge-sm font-mono text-[10px]">VERIFIED</span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  )
}

