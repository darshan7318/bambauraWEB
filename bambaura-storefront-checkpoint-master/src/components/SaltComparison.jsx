import React from 'react'
import { Check, X, Flame, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react'
import SpotlightCard from './ui/SpotlightCard'

const COMPARISON_ROWS = [
  {
    parameter: "Roasting Firings",
    bambaura: "9 Roasting Cycles (21 Days)",
    competitor: "2X to 6X Roasting Cycles",
    himalayan: "0 (Unroasted Raw Rock)",
    tableSalt: "0 (Refined by Boiling)"
  },
  {
    parameter: "Roasting Chamber",
    bambaura: "Thick Mountain Bamboo + Yellow Clay Seals",
    competitor: "Standard Bamboo Tubes",
    himalayan: "None (Mined from underground seams)",
    tableSalt: "Steel Vacuum Pan Evaporators"
  },
  {
    parameter: "Kiln Fuel & Temperature",
    bambaura: "Natural Pine Firewood (1,000°C+)",
    competitor: "Pine Wood or Gas Assisted",
    himalayan: "None (Ambient Sun Drying)",
    tableSalt: "Industrial Fossil Fuel Burners"
  },
  {
    parameter: "Natural Colour",
    bambaura: "Distinctive Brownish Amber Granules",
    competitor: "Grey / Pale Violet Powder",
    himalayan: "Mottled Pink / Orange Crystals",
    tableSalt: "Chemically Bleached Pure White"
  },
  {
    parameter: "Tasting Profile",
    bambaura: "Smoky, Savoury & Umami with Mellow Finish",
    competitor: "Mild Bamboo & Pungent Sulfur",
    himalayan: "Sharp Mineral Salty",
    tableSalt: "Harsh, Acrid Chemical Bite"
  },
  {
    parameter: "Alkaline pH",
    bambaura: "Naturally Alkaline (pH 9.5+)",
    competitor: "Alkaline (pH 9+)",
    himalayan: "Neutral / Mildly Acidic (~6.8)",
    tableSalt: "Acidic (~5.5 to 6.2)"
  },
  {
    parameter: "Microplastics & Impurities",
    bambaura: "0% (Vaporized at 1000°C+, ISO 17025 COA)",
    competitor: "Tested Low Impurities",
    himalayan: "Low (Rock Mined Seams)",
    tableSalt: "Common in Commercial Marine Salts"
  },
  {
    parameter: "Anti-Caking Additives",
    bambaura: "Zero (100% Additive-Free)",
    competitor: "Zero Additives",
    himalayan: "Usually Additive-Free",
    tableSalt: "Always Added (E535 / E551 Chemicals)"
  },
  {
    parameter: "Ideal Culinary Role",
    bambaura: "Everyday Gourmet Finishing & Tabletop Salt",
    competitor: "Wellness, Oral Care & Cooking",
    himalayan: "General Cooking & Grinding",
    tableSalt: "Bulk Commercial Food Processing"
  }
]

export default function SaltComparison() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-label="Salt Comparison Matrix">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983]">
          <Flame className="w-3.5 h-3.5" />
          <span>Why 9 Roasting Cycles Justify The Value</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#401010] dark:text-[#f7ebd9]">
          How Bambaura 9X Compares to Other Salts
        </h2>
        <p className="text-xs sm:text-sm text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          Each batch takes 21 days and nine firings inside bamboo tubes, and much of the salt is lost in the process. Here is how it compares side-by-side with other salt varieties.
        </p>
      </div>

      {/* COMPARISON TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#180707] shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#e6d8c4] dark:border-[#381616] bg-[#faf5ee] dark:bg-[#200c0c]">
              <th className="p-4 sm:p-5 font-serif font-bold text-[#401010] dark:text-[#dfb983] w-1/4">
                Comparison Feature
              </th>
              <th className="p-4 sm:p-5 font-serif font-bold text-white bg-[#401010] dark:bg-[#2c0b0b] border-x border-[#b28346]/40 w-1/4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#dfb983]" />
                  <span>Bambaura 9X Salt</span>
                </div>
                <span className="text-[10px] font-mono text-[#dfb983] block font-normal mt-0.5">
                  9 Bamboo Firings
                </span>
              </th>
              <th className="p-4 sm:p-5 font-serif font-bold text-[#401010] dark:text-[#f7ebd9] w-1/4">
                Saltify 6X / Miterra 2X
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block font-normal mt-0.5">
                  2–6 Roasts
                </span>
              </th>
              <th className="p-4 sm:p-5 font-serif font-bold text-[#401010] dark:text-[#f7ebd9] w-1/4">
                Himalayan Pink Salt
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block font-normal mt-0.5">
                  Raw Rock Salt
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6d8c4]/60 dark:divide-[#381616]">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? 'bg-transparent' : 'bg-[#faf5ee]/40 dark:bg-[#1f0909]/30'}
              >
                <td className="p-4 font-semibold text-[#401010] dark:text-[#f7ebd9]">
                  {row.parameter}
                </td>
                <td className="p-4 font-medium bg-[#401010]/5 dark:bg-[#2c0b0b]/40 border-x border-[#b28346]/20 text-[#401010] dark:text-[#dfb983]">
                  <span className="font-bold">{row.bambaura}</span>
                </td>
                <td className="p-4 text-[#6b534b] dark:text-[#c2ada4]">
                  {row.competitor}
                </td>
                <td className="p-4 text-[#6b534b] dark:text-[#c2ada4]">
                  {row.himalayan}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#8c6027] dark:text-[#dfb983] flex items-center justify-between">
        <span className="font-medium">
          "Each batch takes 21 days and nine firings, and much of the salt is lost in the process." — The Bambaura Standard
        </span>
        <a href="/science" className="font-bold underline uppercase tracking-wider shrink-0 ml-4">
          View Lab COA
        </a>
      </div>
    </section>
  )
}

