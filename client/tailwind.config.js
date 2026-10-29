/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080B12',
        surface: '#151A24',
        navy: {
          950: '#05070B',
          DEFAULT: '#080B12',
          900: '#0C101A',
          800: '#111724',
          700: '#1A2234'
        },
        charcoal: {
          dark: '#0D111A',
          DEFAULT: '#151A24',
          light: '#1D2331',
          lighter: '#252D3E',
          border: '#232A3B'
        },
        coral: {
          DEFAULT: '#FF4B4B',
          hover: '#FF3333',
          dark: '#E03E3E',
          light: '#FF6E6E',
          glow: 'rgba(255, 75, 75, 0.4)'
        },
        violet: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          dark: '#6D28D9',
          light: '#A78BFA',
          glow: 'rgba(139, 92, 246, 0.4)'
        },
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B'
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'coral-glow': '0 0 25px -5px rgba(255, 75, 75, 0.4)',
        'violet-glow': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'cinematic': '0 20px 50px rgba(0, 0, 0, 0.8)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
