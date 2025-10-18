/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        minecraft: {
          green: '#4ade80',
          brown: '#a3a3a3',
          stone: '#6b7280',
          dirt: '#8b4513',
          grass: '#7cb342',
          diamond: '#4fc3f7',
          gold: '#ffd700',
          redstone: '#dc2626'
        }
      },
      fontFamily: {
        'minecraft': ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}