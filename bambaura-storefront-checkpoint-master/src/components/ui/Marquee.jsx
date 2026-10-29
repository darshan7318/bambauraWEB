import React from 'react'

/**
 * 21st.dev Inspired Marquee Component
 * Infinite seamless horizontal scrolling track with pause-on-hover & edge gradients
 */
export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  speed = '35s'
}) {
  return (
    <div
      className={`relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}
    >
      <div
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 py-3 animate-marquee ${
          reverse ? 'direction-reverse' : ''
        } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: speed,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 py-3 animate-marquee ${
          reverse ? 'direction-reverse' : ''
        } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: speed,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {children}
      </div>
    </div>
  )
}

