import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ShieldCheck, Sparkles, Phone, MessageSquare } from 'lucide-react'

export default function ChatBubble() {
  const location = useLocation()
  const isProductPage = location.pathname.startsWith('/product')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState('Hello Bambaura, I have an inquiry about 9X Bamboo Roasted Salt')

  const prompts = [
    { label: '9X Salt & Usage', text: 'Hello Bambaura, I have an inquiry about 9X Bamboo Roasted Salt and how to use it.' },
    { label: 'Diwali / Wedding Gifting', text: 'Hello Bambaura, we are inquiring about custom corporate or wedding gifting hampers.' },
    { label: 'Order & Shipping Status', text: 'Hello Bambaura, I would like to track my order to India / US / UK.' },
    { label: 'Lab & Purity Standards', text: 'Hello Bambaura, could you share details regarding your ISO/IEC 17025 lab batch report?' }
  ]

  const handleStartWhatsApp = (msg = selectedPrompt) => {
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/919845012345?text=${encoded}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className={`fixed ${isProductPage ? 'bottom-20 lg:bottom-6' : 'bottom-6'} right-4 sm:right-6 z-40 flex flex-col items-end pointer-events-auto`}>
      {/* EXPANDABLE WHATSAPP CARD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] max-w-sm sm:w-92 bg-[#faf5ee] dark:bg-[#180707] border border-[#b28346]/40 rounded-3xl shadow-2xl overflow-hidden text-xs mb-3 flex flex-col"
          >
            {/* WHATSAPP HEADER */}
            <div className="bg-gradient-to-r from-[#240808] to-[#401010] text-[#f7ebd9] p-4 flex items-center justify-between border-b border-[#b28346]/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.53-.49-5.004-1.343l-5.996 1.571 1.6-5.843c-.933-1.518-1.472-3.297-1.472-5.205 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#240808]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#f7ebd9]">Bambaura Concierge</h4>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Typically replies in mins
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-amber-200/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 space-y-3">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] text-[#6b534b] dark:text-[#c2ada4] space-y-1">
                <p className="font-semibold text-[#401010] dark:text-[#dfb983] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#b28346]" />
                  Direct WhatsApp Support
                </p>
                <p className="leading-relaxed text-[11px]">
                  Connect directly with our culinary concierge on WhatsApp for quick advice on 9X bamboo salt, order tracking, or corporate gifting packages.
                </p>
              </div>

              {/* QUICK TOPIC CHIPS */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Select Quick Topic:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPrompt(p.text)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-medium transition-all text-left ${
                        selectedPrompt === p.text
                          ? 'bg-[#401010] text-[#dfb983] dark:bg-[#dfb983] dark:text-[#120505] font-bold shadow-xs'
                          : 'bg-white dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] text-[#6b534b] dark:text-[#c2ada4] hover:border-[#b28346]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE PREVIEW */}
              <div className="p-2.5 rounded-xl bg-[#faf5ee] dark:bg-[#120404] border border-[#b28346]/30 text-[11px] text-[#401010] dark:text-[#f7ebd9] italic">
                "{selectedPrompt}"
              </div>

              {/* START WHATSAPP CTA BUTTON */}
              <button
                type="button"
                onClick={() => handleStartWhatsApp(selectedPrompt)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <span>Chat on WhatsApp</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FOOTER BADGE */}
            <div className="px-4 py-2 bg-[#f5eedf]/80 dark:bg-[#100303] border-t border-[#e6d8c4]/60 dark:border-[#381616] flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> +91 98450 12345
              </span>
              <span>Mon–Sat 9AM–6PM IST</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING TRIGGER BUTTON */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative group p-3.5 sm:p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center transition-all ring-4 ring-emerald-600/20"
        aria-label="Open WhatsApp Support"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-white" />
        </span>

        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.771.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.823 0-3.53-.49-5.004-1.343l-5.996 1.571 1.6-5.843c-.933-1.518-1.472-3.297-1.472-5.205 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
        </svg>

        {/* TOOLTIP ON HOVER (DESKTOP) */}
        {!isOpen && (
          <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#240808] text-[#dfb983] text-xs font-semibold shadow-lg border border-[#b28346]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat on WhatsApp
          </span>
        )}
      </motion.button>
    </div>
  )
}
