import React from 'react'
import { motion } from 'framer-motion'

/**
 * 21st.dev Inspired AnimatedPillTabs Component
 * Uses Framer Motion layoutId for fluid sliding pill indicator
 */
export default function AnimatedPillTabs({
  tabs = [],
  activeTab,
  onChange,
  layoutId = 'pillTabActive',
  className = ''
}) {
  return (
    <div
      className={`inline-flex max-w-full p-1 sm:p-1.5 rounded-2xl bg-[#f5eedf]/80 dark:bg-[#200c0c] border border-[#e6d8c4] dark:border-[#381616] overflow-x-auto scrollbar-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-2.5 sm:px-4 py-2 text-xs font-semibold rounded-xl transition-colors duration-200 z-10 shrink-0 sm:shrink flex-1 flex items-center justify-center ${
              isActive
                ? 'text-[#f7ebd9] dark:text-[#140707]'
                : 'text-[#6b534b] dark:text-[#c2ada4] hover:text-[#401010] dark:hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-[#401010] dark:bg-[#dfb983] shadow-md -z-10"
              />
            )}
            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#b28346] text-white dark:bg-[#401010] dark:text-[#dfb983]' : 'bg-[#e6d8c4] text-[#401010] dark:bg-[#381616] dark:text-[#dfb983]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

