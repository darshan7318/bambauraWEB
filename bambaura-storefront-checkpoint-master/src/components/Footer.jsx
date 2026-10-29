import React from 'react'
import { Link } from 'react-router-dom'
import {
  Flame, ShieldCheck, Heart, Sparkles, ArrowRight, Mail, Phone,
  MapPin, Globe, ChevronRight, Award, Truck, RotateCcw
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import NAV_DATA from '../data/navigation.json'

const ICON_MAP = {
  Flame,
  ShieldCheck,
  Sparkles,
  Heart,
  Award
}

export default function Footer() {
  const { countryConfig, productData, showToast } = useStore()
  const { footer } = NAV_DATA

  return (
    <footer className="bg-[#240808] dark:bg-[#0c0303] text-[#f7ebd9] pt-16 pb-12 border-t border-[#b28346]/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* BRAND STATEMENT & NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#b28346]/20">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#401010] border border-[#b28346] flex items-center justify-center">
                <img
                  src="/images/extracted/b_mark_full.png"
                  alt="Bambaura"
                  className="w-6 h-6 object-contain filter brightness-110"
                />
              </div>
              <span className="font-serif text-3xl font-bold tracking-tight text-[#f7ebd9]">
                bambaura
              </span>
            </div>
            
            <p className="text-sm text-[#dfb983]/90 leading-relaxed max-w-md">
              {footer.brandDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/80 pt-2">
              {footer.badges.map((badge, idx) => {
                const IconComp = ICON_MAP[badge.icon] || Sparkles
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>•</span>}
                    <span className="flex items-center gap-1.5 font-medium">
                      <IconComp className="w-4 h-4 text-[#dfb983]" /> {badge.label}
                    </span>
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-[#401010]/60 dark:bg-[#180707] p-6 sm:p-8 rounded-3xl border border-[#b28346]/30">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#dfb983]">
                Culinary Journal
              </span>
              <h4 className="font-serif text-2xl font-bold text-white mt-1 mb-2">
                Join the Bambaura Culinary Circle
              </h4>
              <p className="text-xs text-[#dfb983]/80 mb-4 max-w-lg">
                Receive private reserve allocations, chef recipes, and stories from the bamboo roasting kilns.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to Bambaura Journal! Welcome to our culinary circle.', 'success'); }} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-[#b28346]/40 text-sm text-[#f7ebd9] placeholder-amber-200/40 focus:outline-none focus:border-[#dfb983]"
                />
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-[#b28346] hover:bg-[#dfb983] text-[#240808] text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* NAVIGATION LINKS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-4 border-b border-[#b28346]/20 text-xs">
          {/* COLUMN 1: DYNAMIC FLAGSHIP VARIANTS FROM PRODUCT.JSON */}
          <div>
            <h5 className="font-serif font-bold text-sm text-[#dfb983] uppercase tracking-wider mb-4">
              Flagship Reserve
            </h5>
            <ul className="space-y-2.5 text-amber-100/70">
              <li>
                <Link to="/product" className="hover:text-[#dfb983] transition-colors">
                  All Product Sizes
                </Link>
              </li>
              {(productData.gramVariants || []).map((v) => (
                <li key={v.grams}>
                  <Link
                    to={`/product?grams=${v.grams}`}
                    className={`hover:text-[#dfb983] transition-colors ${v.popular ? 'font-medium text-amber-200' : ''}`}
                  >
                    {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNS 2, 3, 4: DYNAMIC SECTIONS FROM NAVIGATION.JSON */}
          {footer.sections.map((section, idx) => (
            <div key={idx}>
              <h5 className="font-serif font-bold text-sm text-[#dfb983] uppercase tracking-wider mb-4">
                {section.title}
              </h5>
              <ul className="space-y-2.5 text-amber-100/70">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.path} className="hover:text-[#dfb983] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MANDATORY LEGAL & COMPLIANCE SECTION FOR INDIA & GLOBAL (BRIEF ITEM 9 & 10) */}
        <div className="p-6 rounded-2xl bg-[#1d0606]/80 border border-[#b28346]/20 text-xs text-amber-100/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#b28346]/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase tracking-wider">
                fssai
              </span>
              <span className="font-mono text-xs text-[#dfb983]">
                Lic. No. 10024011000189
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-amber-200/90">
              <span>Country of Origin: <strong className="text-white">India</strong></span>
              <span>•</span>
              <span>Batch: <strong className="text-white">BAM-2026-9X-04</strong></span>
              <span>•</span>
              <span>Mfg Date: <strong className="text-white">01/2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed">
            <div>
              <p className="font-serif font-bold text-[#dfb983] uppercase tracking-wider mb-1">
                Marketer & Packer
              </p>
              <p className="text-amber-100/90">
                Bambaura Natural Foods Pvt. Ltd.<br />
                #12/4 Indiranagar, 100 Feet Road<br />
                Bangalore 560038, Karnataka, India
              </p>
            </div>

            <div>
              <p className="font-serif font-bold text-[#dfb983] uppercase tracking-wider mb-1">
                Customer Care & Concierge
              </p>
              <p className="text-amber-100/90">
                Email: <a href="mailto:care@bambaura.com" className="text-[#dfb983] underline">care@bambaura.com</a><br />
                Phone: <a href="tel:+919845012345" className="text-[#dfb983]">+91 98450 12345</a><br />
                WhatsApp: <a href="https://wa.me/919845012345" target="_blank" rel="noreferrer" className="text-emerald-400 underline">+91 98450 12345</a> (Mon–Sat 9AM–6PM IST)
              </p>
            </div>

            <div>
              <p className="font-serif font-bold text-[#dfb983] uppercase tracking-wider mb-1">
                Shipping & Replacement Guarantee
              </p>
              <p className="text-amber-100/90">
                Metros: 2–3 Days | Rest of India: 4–6 Days | International: 5–9 Days.<br />
                Free shipping on all orders over ₹999 ($50 / £40 / AED 180).<br />
                100% replacement guarantee for damaged or leaked packages.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-200/60">
          <p>© 2026 Bambaura Natural Foods Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>Delivering to {countryConfig.name} ({countryConfig.code})</span>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-200 transition-colors">Shipping & Returns</Link>
            <span>•</span>
            <span className="hover:text-amber-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-amber-200 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
