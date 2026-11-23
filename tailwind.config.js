/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mama: {
          pink: '#ff6584',
          'pink-light': '#ffe4e9',
          'pink-dark': '#e04868',
          lavender: '#d8b4fe',
          'lavender-light': '#f3e8ff',
          'lavender-dark': '#a855f7',
          mint: '#6ee7b7',
          'mint-light': '#d1fae5',
          'mint-dark': '#10b981',
          cream: '#fffbeb',
          'cream-dark': '#fef3c7',
          yellow: '#fde047',
          'yellow-light': '#fef9c3',
          'yellow-dark': '#eab308',
          blue: '#7dd3fc',
          'blue-light': '#e0f2fe',
          'blue-dark': '#0284c7',
          peach: '#fed7aa',
          'peach-light': '#ffedd5',
          'peach-dark': '#f97316',
        },
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#609dc9',
          500: '#3b7fb4',
          600: '#2b6697',
          700: '#23527a',
          800: '#1b4161',
          900: '#0f2b48',
          950: '#091a2d',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        bubble: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'mama': '0 6px 0px 0px rgba(0,0,0,0.15)',
        'mama-sm': '0 3px 0px 0px rgba(0,0,0,0.15)',
        'mama-lg': '0 10px 0px 0px rgba(0,0,0,0.15)',
        'mama-pink': '0 6px 0px 0px #e04868',
        'mama-yellow': '0 6px 0px 0px #ca8a04',
        'mama-mint': '0 6px 0px 0px #059669',
        'mama-blue': '0 6px 0px 0px #0284c7',
        'mama-purple': '0 6px 0px 0px #9333ea',
      },
      animation: {
        'bounce-gentle': 'bounceGentle 2s infinite ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
      },
    },
  },
  plugins: [],
}
