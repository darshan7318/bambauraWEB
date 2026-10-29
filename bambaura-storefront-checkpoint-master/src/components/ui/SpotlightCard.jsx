import React, { useRef, useState } from 'react'

/**
 * 21st.dev Inspired SpotlightCard Component
 * Illumination follows mouse cursor dynamically with radial ambient glow.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(223, 185, 131, 0.15)'
}) {
  const divRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-[#e6d8c4] dark:border-[#381616] bg-white dark:bg-[#180707] transition-all duration-300 ${className}`}
    >
      {/* SPOTLIGHT GLOW LAYER */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}

