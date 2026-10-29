import React, { useEffect, useState } from 'react'

/**
 * 21st.dev Inspired AnimatedCounter (Number Ticker)
 * Smoothly interpolates numeric and decimal values on mount/view
 */
export default function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  decimals = 0,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp = null
    const target = typeof value === 'number' ? value : parseFloat(value) || 0
    const hasDecimals = decimals > 0 || (target % 1 !== 0)
    const decCount = decimals || (target.toString().split('.')[1]?.length || 0)

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = easeProgress * target

      if (progress < 1) {
        setDisplayValue(hasDecimals ? current.toFixed(decCount) : Math.floor(current))
        window.requestAnimationFrame(step)
      } else {
        setDisplayValue(hasDecimals ? target.toFixed(decCount) : target)
      }
    }

    window.requestAnimationFrame(step)
  }, [value, duration, decimals])

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
