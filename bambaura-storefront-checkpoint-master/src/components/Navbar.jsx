import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Sun, Moon, ChevronDown, Menu, X,
  LogOut, ShieldCheck, Flame, Sparkles, Check, Package,
  ChefHat, Phone, ArrowRight, Compass, BookOpen, HeartHandshake,
  Truck, Gift, Search, ExternalLink
} from 'lucide-react'
import { useStore, COUNTRIES_DATA } from '../context/StoreContext'
import NAV_DATA from '../data/navigation.json'

const ICON_MAP = {
  Compass,
  Sparkles,
  Flame,
  ShieldCheck,
  ChefHat,
  BookOpen,
  Phone,
  HeartHandshake
}

const ROTATING_ANNOUNCEMENTS = [
  { text: "Free Insured Shipping on orders over regional threshold", icon: Truck },
  { text: "Hand-Roasted 9 Times Inside Mountain Bamboo Stalks", icon: Flame },
  { text: "ISO/IEC 17025 Tested • 0% Microplastics • Zero Anti-Caking", icon: ShieldCheck },
  { text: "Corporate & Wedding Gifting Available via WhatsApp Concierge", icon: Gift }
]

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    country,
    setCountry,
    countryConfig,
    formatPrice,
    cartTotalUSD,
    productData,
    user,
    logout,
    setIsAuthModalOpen,
    cartItemsCount,
    setIsCartOpen
  } = useStore()

  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [shopMegaMenuOpen, setShopMegaMenuOpen] = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)

  const countryRef = useRef(null)
  const userRef = useRef(null)
  const shopMenuRef = useRef(null)

  // Rotating Announcement Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % ROTATING_ANNOUNCEMENTS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryDropdownOpen(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target)) {
        setShopMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShopMegaMenuOpen(false)
  }, [location.pathname])

  const navLinks = NAV_DATA.navLinks.map(link => ({
    ...link,
    icon: ICON_MAP[link.icon] || Compass
  }))

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const currentAnnouncement = ROTATING_ANNOUNCEMENTS[announcementIdx]
  const AnnounceIcon = currentAnnouncement.icon

  return (
    <>
      {/* 1. DYNAMIC ROTATING ANNOUNCEMENT BAR */}
      <div className="bg-[#2a0707] dark:bg-[#0c0202] text-[#f7ebd9] text-[11px] sm:text-xs py-2 px-3 sm:px-6 border-b border-[#b28346]/25 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* ROTATING VALUE PROPOSITION */}
          <div className="flex-1 flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <AnimatePresence mode="wait">
              <motion.div
                key={announcementIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 font-medium tracking-wide truncate text-amber-100/95"
              >
                <AnnounceIcon className="w-3.5 h-3.5 text-[#dfb983] shrink-0" />
                <span className="truncate">
                  {announcementIdx === 0
                    ? `${countryConfig.name}: Free Insured Shipping over ${countryConfig.symbol}${countryConfig.freeShip}`
                    : currentAnnouncement.text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DESKTOP HIGHLIGHTS */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono tracking-wider uppercase text-amber-200/80">
            <span>FSSAI Lic. 10024011000189</span>
            <span>•</span>
            <a
              href="https://wa.me/919845012345"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>WhatsApp Care: +91 98450 12345</span>
            </a>
          </div>

          {/* MOBILE QUICK INDICATOR */}
          <div className="flex lg:hidden items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold shrink-0">
            <span>{countryConfig.code} • Free &gt; {countryConfig.symbol}{countryConfig.freeShip}</span>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION WITH GLASSMORPHIC BLUR */}
      <header className="sticky top-0 z-40 bg-[#faf5ee]/90 dark:bg-[#120505]/90 backdrop-blur-xl border-b border-[#e6d8c4] dark:border-[#381616] transition-colors duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#401010] to-[#250808] dark:from-[#2a0c0c] dark:to-[#140404] border border-[#b28346]/60 flex items-center justify-center shadow-lg group-hover:border-[#dfb983] group-hover:scale-105 transition-all shrink-0 ring-2 ring-[#b28346]/20">
              <img
                src="/images/extracted/b_mark_full.png"
                alt="Bambaura"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter brightness-110 drop-shadow"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#401010] dark:text-[#f7ebd9] group-hover:text-[#b28346] dark:group-hover:text-[#dfb983] transition-colors leading-none">
                bambaura
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.24em] uppercase text-[#8c6027] dark:text-[#dfb983] font-sans font-semibold mt-1">
                9X Bamboo Roasted Salt
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS WITH SHOP MEGA-MENU */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((item) => {
              const active = isActive(item.path)
              const isShop = item.path === '/product'

              if (isShop) {
                return (
                  <div
                    key={item.path}
                    ref={shopMenuRef}
                    onMouseEnter={() => setShopMegaMenuOpen(true)}
                    onMouseLeave={() => setShopMegaMenuOpen(false)}
                    className="relative py-2"
                  >
                    <Link
                      to="/product"
                      className={`relative text-xs tracking-wider uppercase font-medium transition-all py-1.5 px-2 flex items-center gap-1 ${
                        active
                          ? 'text-[#401010] dark:text-[#dfb983] font-bold'
                          : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010] dark:hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3 h-3 text-[#b28346] transition-transform duration-200 ${shopMegaMenuOpen ? 'rotate-180' : ''}`} />
                      <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505]">
                        9X
                      </span>
                    </Link>

                    {/* SHOP MEGA-MENU FLYOUT */}
                    <AnimatePresence>
                      {shopMegaMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[460px] p-4 rounded-3xl bg-white dark:bg-[#180707] border border-[#b28346]/40 shadow-2xl z-50 text-xs backdrop-blur-xl"
                        >
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e6d8c4] dark:border-[#381616]">
                            <span className="font-serif font-bold text-sm text-[#401010] dark:text-[#dfb983]">
                              Explore Canister Sizes &amp; Packaging
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                              ✓ In Stock
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            {(productData.gramVariants || []).map((v) => (
                              <Link
                                key={v.grams}
                                to={`/product?grams=${v.grams}`}
                                onClick={() => setShopMegaMenuOpen(false)}
                                className="p-2.5 rounded-2xl border border-[#e6d8c4] dark:border-[#381616] hover:border-[#b28346] bg-[#faf5ee] dark:bg-[#200c0c] flex items-center gap-3 transition-all hover:scale-[1.02] group"
                              >
                                <img
                                  src={v.image}
                                  alt={v.name}
                                  className="w-12 h-12 object-contain rounded-xl bg-white dark:bg-[#160606] p-1 border border-[#e6d8c4]/60"
                                />
                                <div className="overflow-hidden">
                                  <div className="flex items-center gap-1">
                                    <span className="font-serif font-bold text-xs text-[#401010] dark:text-[#f7ebd9] group-hover:text-[#b28346]">
                                      {v.grams}
                                    </span>
                                    {v.popular && (
                                      <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-[#b28346] text-[#240808]">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#6b534b] dark:text-[#c2ada4] truncate">
                                    {v.name.split('—')[1] || v.label}
                                  </p>
                                  <p className="font-mono font-bold text-xs text-[#b28346] dark:text-[#dfb983] mt-0.5">
                                    {formatPrice(v.priceUSD)}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#e6d8c4] dark:border-[#381616] flex items-center justify-between text-[11px]">
                            <span className="text-[#6b534b] dark:text-[#c2ada4]">
                              All sizes hand-fired over nine roasting cycles.
                            </span>
                            <Link
                              to="/product"
                              className="font-bold text-[#b28346] hover:underline flex items-center gap-1"
                            >
                              <span>View All Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-xs tracking-wider uppercase font-medium transition-all py-1.5 px-2 ${
                    active
                      ? 'text-[#401010] dark:text-[#dfb983] font-bold'
                      : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010] dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505] uppercase">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#b28346] via-[#dfb983] to-[#b28346] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* DAISYUI THEME TOGGLE (LIGHT / DARK SWITCHER) */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-[#e6d8c4] dark:border-[#381616] bg-white/90 dark:bg-[#1a0808] text-[#401010] dark:text-[#dfb983] hover:border-[#b28346] hover:shadow-md transition-all flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className="hidden xl:inline text-xs font-semibold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#401010]" />
                  <span className="hidden xl:inline text-xs font-semibold">Dark</span>
                </>
              )}
            </button>

            {/* CURRENCY & REGION DROPDOWN (STRICTLY IN, US, GB) */}
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-[#e6d8c4] dark:border-[#381616] bg-white/90 dark:bg-[#1a0808] text-xs font-semibold text-[#401010] dark:text-[#f7ebd9] hover:border-[#b28346] hover:shadow-md transition-all flex items-center gap-1.5 shadow-sm shrink-0 active:scale-95"
                aria-label="Select Country and Currency"
              >
                <span className="text-sm leading-none">{countryConfig.flag}</span>
                <span className="font-mono font-bold">{countryConfig.code}</span>
                <ChevronDown className={`w-3 h-3 text-[#b28346] transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {countryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1a0808] border border-[#e6d8c4] dark:border-[#381616] shadow-2xl p-2 z-50 text-xs backdrop-blur-md"
                  >
                    <div className="px-3 py-1.5 font-bold text-[10px] uppercase tracking-wider text-[#8c6027] dark:text-[#dfb983] border-b border-[#e6d8c4]/60 dark:border-[#381616] flex items-center justify-between">
                      <span>Select Supported Region</span>
                      <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400 font-bold">Express Shipping</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {Object.entries(COUNTRIES_DATA).map(([key, data]) => {
                        const isCurrent = country === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setCountry(key)
                              setCountryDropdownOpen(false)
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                              isCurrent
                                ? 'bg-[#401010] text-[#f7ebd9] font-semibold dark:bg-[#dfb983] dark:text-[#120505]'
                                : 'text-[#2c1714] dark:text-[#f7ebd9] hover:bg-[#faf5ee] dark:hover:bg-[#280c0c]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{data.flag}</span>
                              <span>{data.name}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono font-bold">
                              <span>{data.symbol}</span>
                              <span>{data.code}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 ml-1 text-emerald-400" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <div className="pt-2 px-3 border-t border-[#e6d8c4]/60 dark:border-[#381616] text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>Free shipping over:</span>
                      <span className="font-bold text-[#b28346]">{countryConfig.symbol}{countryConfig.freeShip}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SHOPPING CART BUTTON WITH LIVE TOTAL PREVIEW */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#120505] hover:bg-[#5c1718] dark:hover:bg-[#f5ebd9] hover:shadow-lg transition-all flex items-center gap-2 shadow-md shrink-0 active:scale-95 group"
              title="Open Shopping Cart"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2.5 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow ring-2 ring-white dark:ring-[#120505]"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                Cart {cartTotalUSD > 0 && `(${formatPrice(cartTotalUSD)})`}
              </span>
            </button>

            {/* MOBILE HAMBURGER TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-[#e6d8c4] dark:border-[#381616] text-[#401010] dark:text-[#f7ebd9] hover:bg-black/5 active:scale-95 transition-all"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* 3. MOBILE FULLSCREEN NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 z-30 bg-[#faf5ee]/98 dark:bg-[#120505]/98 backdrop-blur-2xl p-6 overflow-y-auto flex flex-col justify-between border-b border-[#e6d8c4] dark:border-[#381616]"
          >
            <div className="space-y-6">
              {/* REGION QUICK SWITCHER */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a0808] border border-[#e6d8c4] dark:border-[#381616]">
                <div className="flex items-center justify-between text-xs text-[#6b534b] dark:text-[#c2ada4] mb-2 font-medium">
                  <span>Shipping Destination:</span>
                  <span className="font-bold text-[#b28346]">{countryConfig.name} ({countryConfig.symbol})</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(COUNTRIES_DATA).map(([key, data]) => {
                    const isCurrent = country === key
                    return (
                      <button
                        key={key}
                        onClick={() => setCountry(key)}
                        className={`py-2 px-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                          isCurrent
                            ? 'bg-[#401010] text-[#f7ebd9] font-bold dark:bg-[#dfb983] dark:text-[#120505] shadow'
                            : 'bg-[#faf5ee] dark:bg-[#220a0a] border border-[#e6d8c4] dark:border-[#381616] text-[#6b534b] dark:text-[#c2ada4]'
                        }`}
                      >
                        <span>{data.flag}</span>
                        <span>{data.code}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* NAVIGATION LINKS */}
              <div className="space-y-1">
                {navLinks.map((item) => {
                  const active = isActive(item.path)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        active
                          ? 'bg-[#401010] text-[#f7ebd9] font-bold dark:bg-[#dfb983] dark:text-[#120505]'
                          : 'text-[#401010] dark:text-[#f7ebd9] hover:bg-white dark:hover:bg-[#1a0808]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#b28346]" />
                        <span className="font-serif text-base">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b28346] text-[#240808]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* MOBILE FOOTER & WHATSAPP SHORTCUT */}
            <div className="pt-6 border-t border-[#e6d8c4] dark:border-[#381616] space-y-3">
              <Link
                to="/product"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#b28346] to-[#8c6027] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Shop 100g Signature Canister ({countryConfig.symbol}{countryConfig.code === 'INR' ? '1,450' : '24'})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://wa.me/919845012345"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Care: +91 98450 12345</span>
              </a>

              <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                FSSAI Lic. 10024011000189 • Batch BAM-2026-9X-04
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
