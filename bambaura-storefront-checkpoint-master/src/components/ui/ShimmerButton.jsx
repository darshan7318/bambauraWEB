import React from 'react'
import { motion } from 'framer-motion'

/**
 * 21st.dev Inspired ShimmerButton Component
 * Luxury button with moving specular light sweep & gold glow
 */
export default function ShimmerButton({
  children,
  onClick,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.25)',
  shimmerDuration = '2.5s',
  type = 'button',
  disabled = false
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#401010] dark:bg-[#dfb983] text-[#f7ebd9] dark:text-[#140707] px-8 py-4 font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#b28346]/20 disabled:opacity-50 disabled:pointer-events-none group ${className}`}
    >
      {/* SHIMMER SPECULAR SWEEP */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer-sweep pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          animationDuration: shimmerDuration
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

