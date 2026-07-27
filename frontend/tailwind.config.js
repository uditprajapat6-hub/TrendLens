/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4285F4',
          green: '#34A853',
          yellow: '#FBBC05',
          red: '#EA4335',
        },
        surface: {
          light: '#FFFFFF',
          muted: '#F4F6F9',
          dark: '#0F172A',
          darkmuted: '#141C2F',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 41, 55, 0.10)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        drawline: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drawline: 'drawline 2.4s ease-out forwards',
        floaty: 'floaty 4s ease-in-out infinite',
        ticker: 'ticker 28s linear infinite',
      },
    },
  },
  plugins: [],
}
