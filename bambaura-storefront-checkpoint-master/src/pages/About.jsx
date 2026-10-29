import React from 'react'
import { Link } from 'react-router-dom'
import {
  Flame, Mountain, Leaf, ShieldCheck, Heart, Award, ArrowRight,
  Sparkles, CheckCircle2, User, MapPin
} from 'lucide-react'
import ABOUT_DATA from '../data/about.json'

export default function About() {
  const { hero, founderNote, sourcing, sustainability } = ABOUT_DATA

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
      
      {/* 1. HERO STORY (PERSONAL & HONEST) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            {hero.badge}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9] leading-tight">
            {hero.title}
          </h1>
          {hero.paragraphs.map((p, idx) => (
            <p key={idx} className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
              {p}
            </p>
          ))}
          <div className="pt-2">
            <Link
              to="/product"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] font-semibold text-xs uppercase tracking-wider shadow-xl"
            >
              <span>Explore The Salt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative aspect-square w-full max-w-md rounded-3xl overflow-hidden border border-[#b28346]/40 shadow-2xl">
            <img
              src={hero.image}
              alt="Artisanal small-batch bamboo tube packing and kiln firing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#240808]/85 via-transparent to-transparent flex items-end p-6">
              <p className="text-xs text-[#f7ebd9] italic font-serif">
                "{hero.quote}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FOUNDER NOTE */}
      {founderNote && (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#faf5ee] to-white dark:from-[#1b0808] dark:to-[#120404] border border-[#e6d8c4] dark:border-[#381616] shadow-xl max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983] font-bold">
            <User className="w-4 h-4 text-[#b28346]" />
            <span>{founderNote.headline}</span>
          </div>
          <p className="font-serif text-lg sm:text-xl text-[#401010] dark:text-[#f7ebd9] leading-relaxed italic">
            "{founderNote.story}"
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6b534b] dark:text-[#c2ada4] border-t border-[#e6d8c4]/60 dark:border-[#381616] pt-3">
            <span className="font-bold text-[#401010] dark:text-[#dfb983]">{founderNote.signature}</span>
            <span className="flex items-center gap-1 mt-1 sm:mt-0">
              <MapPin className="w-3.5 h-3.5 text-[#b28346]" />
              {founderNote.location}
            </span>
          </div>
        </div>
      )}

      {/* 3. HONEST ORIGIN & SOURCING (NO INVENTED CLAIMS) */}
      {sourcing && (
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
              {sourcing.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
              {sourcing.title}
            </h2>
            <p className="text-xs text-[#6b534b] dark:text-[#c2ada4]">
              {sourcing.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sourcing.inputs.map((inp, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#1a0808] border border-[#e6d8c4] dark:border-[#381616] shadow-md space-y-2">
                <span className="text-xs font-mono font-bold text-[#8c6027] dark:text-[#dfb983]">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                  {inp.name}
                </h3>
                <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                  {inp.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PACKAGING & CARE */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#faf5ee] dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            {sustainability.badge}
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            {sustainability.title}
          </h3>
          <p className="text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
            {sustainability.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {sustainability.commitments.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#220d0d] border border-[#e6d8c4] dark:border-[#381616]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
              <p className="font-bold text-[#401010] dark:text-[#f7ebd9]">{item.title}</p>
              <p className="text-[#6b534b] dark:text-[#c2ada4] mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
