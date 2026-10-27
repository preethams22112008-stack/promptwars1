/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./FairShift.jsx"
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9F9FB',
        surface: '#FFFFFF',
        sand: '#EFECE6',
        borderSubtle: '#E2E0D8',
        borderDefault: '#E5E7EB',
        primaryText: '#1A202C',
        secondaryText: '#4A5568',
        ochre: {
          50: '#FEFDF8',
          100: '#FEF9EC',
          200: '#FDF1CE',
          300: '#FCE4A5',
          400: '#F9D173',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
