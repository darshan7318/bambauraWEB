import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: '#4b1011',
        burgundy: {
          DEFAULT: '#401010',
          light: '#5c1718',
          dark: '#260808',
          deep: '#1e0505'
        },
        cream: {
          DEFAULT: '#faf5ee',
          card: '#f5eedf',
          border: '#e6d8c4',
          pure: '#fffdf9'
        },
        sand: '#ead8bd',
        gold: {
          DEFAULT: '#b28346',
          light: '#dfb983',
          pale: '#f5ebd9',
          dark: '#8c6027'
        },
        ink: {
          DEFAULT: '#2c1714',
          muted: '#6b534b',
          faint: '#9c8378'
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif']
      },
      boxShadow: {
        luxe: '0 24px 70px rgba(65, 25, 16, .12)',
        glow: '0 0 25px rgba(223, 185, 131, 0.45)',
        'glow-burgundy': '0 0 30px rgba(64, 16, 16, 0.35)',
        card: '0 12px 35px rgba(43, 24, 20, 0.08)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.08)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
        float: 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        bambauraDark: {
          "primary": "#dfb983",
          "primary-content": "#140707",
          "secondary": "#b28346",
          "secondary-content": "#ffffff",
          "accent": "#401010",
          "accent-content": "#dfb983",
          "neutral": "#230b0b",
          "neutral-content": "#f7ebd9",
          "base-100": "#120505",
          "base-200": "#1a0808",
          "base-300": "#240d0d",
          "base-content": "#fdfbf7",
          "info": "#38bdf8",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
        bambauraLight: {
          "primary": "#401010",
          "primary-content": "#f7ebd9",
          "secondary": "#b28346",
          "secondary-content": "#ffffff",
          "accent": "#dfb983",
          "accent-content": "#401010",
          "neutral": "#401010",
          "neutral-content": "#faf5ee",
          "base-100": "#faf5ee",
          "base-200": "#f5eedf",
          "base-300": "#e6d8c4",
          "base-content": "#2c1714",
          "info": "#0284c7",
          "success": "#059669",
          "warning": "#d97706",
          "error": "#dc2626",
        }
      },
      "dark",
      "light"
    ],
    darkTheme: "bambauraDark",
    base: true,
    styled: true,
    utils: true,
  }
}
