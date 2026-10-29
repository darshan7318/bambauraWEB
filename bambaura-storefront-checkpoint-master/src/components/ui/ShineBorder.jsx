import React from 'react'

/**
 * 21st.dev Inspired ShineBorder Component
 * Wraps content with an animated rotating specular conic gradient border.
 */
export default function ShineBorder({
  children,
  className = '',
  borderWidth = 2,
  duration = 8,
  color = ['#dfb983', '#b28346', '#401010', '#dfb983']
}) {
  const gradientColors = Array.isArray(color) ? color.join(', ') : color

  return (
    <div
      className={`relative rounded-3xl p-[1.5px] overflow-hidden group ${className}`}
      style={{
        '--border-width': `${borderWidth}px`,
        '--shine-duration': `${duration}s`
      }}
    >
      {/* ROTATING CONIC GRADIENT SHINE */}
      <div
        className="absolute inset-[-100%] animate-spin-slow pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, ${gradientColors})`,
          animationDuration: `${duration}s`
        }}
      />

      {/* INNER CONTENT CONTAINER */}
      <div className="relative w-full h-full rounded-[calc(1.5rem-1.5px)] bg-white dark:bg-[#180707] overflow-hidden z-10">
        {children}
      </div>
    </div>
  )
}

