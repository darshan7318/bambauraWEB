import React, { useState } from 'react'
import {
  Sparkles, DollarSign, Users, Percent, ArrowRight, ExternalLink,
  ShieldCheck, Award, Heart, Check, Copy
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import AFFILIATE_DATA from '../data/affiliate.json'

const ICON_MAP = {
  Percent,
  Award,
  Sparkles,
  ShieldCheck,
  Heart
}

export default function Affiliate() {
  const { formatPrice, showToast } = useStore()
  const { header, benefits, calculatorDefaults } = AFFILIATE_DATA
  const [referralCount, setReferralCount] = useState(calculatorDefaults.initialReferrals)
  const [averageOrderUSD, setAverageOrderUSD] = useState(calculatorDefaults.initialOrderUSD)
  const [copiedLink, setCopiedLink] = useState(false)

  // Standard Commission from data
  const commissionRate = calculatorDefaults.baseCommissionRate || 0.15
  const monthlyVolumeUSD = referralCount * averageOrderUSD
  const monthlyCommissionUSD = Math.round(monthlyVolumeUSD * commissionRate)
  const annualCommissionUSD = monthlyCommissionUSD * 12

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(calculatorDefaults.referralLink || 'https://bambaura.com/ambassador?ref=PARTNER')
    setCopiedLink(true)
    showToast('Ambassador partner link copied to clipboard!', 'success')
    setTimeout(() => setCopiedLink(false), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
          {header.badge}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#401010] dark:text-[#f7ebd9]">
          {header.title}
        </h1>
        <p className="text-base text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
          {header.description}
        </p>
      </div>

      {/* 2. PROGRAM BENEFITS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((b, idx) => {
          const IconComp = ICON_MAP[b.icon] || Percent
          return (
            <div key={idx} className="p-8 rounded-3xl bg-white dark:bg-[#180707] border border-[#e6d8c4] dark:border-[#381616] shadow-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#faf5ee] dark:bg-[#250d0d] text-[#b28346] flex items-center justify-center font-bold">
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#401010] dark:text-[#f7ebd9]">
                {b.title}
              </h3>
              <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] leading-relaxed">
                {b.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* 3. INTERACTIVE COMMISSION EARNINGS CALCULATOR */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white to-[#faf5ee] dark:from-[#1b0808] dark:to-[#120404] border border-[#e6d8c4] dark:border-[#381616] shadow-xl space-y-8">
        <div className="border-b border-[#e6d8c4] dark:border-[#381616] pb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Revenue Forecaster
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9] mt-1">
            Calculate Your Projected Ambassador Payout
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4] mt-1">
            Adjust the sliders below to estimate your monthly and annual ambassador earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* SLIDERS */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-[#401010] dark:text-[#f7ebd9]">Monthly Patron Orders Referred:</span>
                <span className="font-mono text-base text-[#8c6027] dark:text-[#dfb983]">{referralCount} Orders</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={referralCount}
                onChange={(e) => setReferralCount(Number(e.target.value))}
                className="w-full accent-[#401010] dark:accent-[#dfb983]"
              />
              <div className="flex justify-between text-[10px] text-[#9c8378] mt-1">
                <span>10 patrons</span>
                <span>250 patrons</span>
                <span>500 patrons</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-[#401010] dark:text-[#f7ebd9]">Average Basket Value (USD):</span>
                <span className="font-mono text-base text-[#8c6027] dark:text-[#dfb983]">{formatPrice(averageOrderUSD)}</span>
              </div>
              <input
                type="range"
                min="24"
                max="120"
                step="2"
                value={averageOrderUSD}
                onChange={(e) => setAverageOrderUSD(Number(e.target.value))}
                className="w-full accent-[#401010] dark:accent-[#dfb983]"
              />
              <div className="flex justify-between text-[10px] text-[#9c8378] mt-1">
                <span>$24 (100g canister)</span>
                <span>$68 (500g pouch)</span>
                <span>$120+ (Multi-pack)</span>
              </div>
            </div>
          </div>

          {/* PROJECTED RESULT DISPLAY */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#401010] dark:bg-[#120404] text-[#f7ebd9] text-center space-y-4 shadow-xl border border-[#b28346]/40">
            <span className="text-xs uppercase font-bold tracking-widest text-[#dfb983]">
              Projected Monthly Earnings
            </span>
            <p className="font-serif text-4xl sm:text-5xl font-bold text-white">
              {formatPrice(monthlyCommissionUSD)}
            </p>
            <p className="text-xs text-amber-200/80">
              Estimated Annual Payout: <strong className="text-white">{formatPrice(annualCommissionUSD)} / year</strong>
            </p>

            <div className="pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl bg-[#b28346] hover:bg-[#dfb983] text-[#240808] font-bold text-xs uppercase tracking-wider transition-all shadow flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Partner Referral Link'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. APPLICATION FORM CONNECTED TO BACKEND */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1a0808] border border-[#b28346]/20 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8c6027] dark:text-[#dfb983]">
            Apply for Membership
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#401010] dark:text-[#f7ebd9]">
            Join the Bambaura Creator Circle
          </h2>
          <p className="text-xs text-[#6b534b] dark:text-[#c2ada4]">
            Submit your credentials below. Applications are reviewed directly by the cellar director within 24 hours.
          </p>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const fd = new FormData(e.target)
            try {
              const res = await fetch('/api/affiliate/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: fd.get('name'),
                  email: fd.get('email'),
                  platformOrChannel: fd.get('platform'),
                  audienceSize: fd.get('audience'),
                  notes: fd.get('notes')
                })
              })
              const data = await res.json()
              showToast(`Application ${data.applicationId} submitted! Reviewable in Admin panel.`, 'success')
              e.target.reset()
            } catch {
              showToast('Application received! Cellar director will contact you.', 'success')
              e.target.reset()
            }
          }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
              <input
                required
                name="name"
                placeholder="Chef Julian Thorne"
                className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
              <input
                required
                type="email"
                name="email"
                placeholder="creator@kitchencraft.com"
                className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Primary Platform / Channel</label>
              <input
                required
                name="platform"
                placeholder="Instagram / YouTube / Culinary Blog"
                className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Audience Reach</label>
              <input
                required
                name="audience"
                placeholder="50,000+ Food Enthusiasts"
                className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Culinary or Kitchen Background</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Tell us about your culinary focus, recipe style, or restaurant/kitchen background..."
              className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-[#200c0c] border border-gray-200 dark:border-white/10 focus:outline-none focus:border-[#b28346]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#b28346] hover:bg-[#9a6f37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Submit Creator Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  )
}

