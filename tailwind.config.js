/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#07070A',
        surface: '#0F0F14',
        elevated: '#16161C',
        border: {
          DEFAULT: '#242429',
          subtle: '#1A1A1F',
        },
        gold: {
          DEFAULT: '#C8A84B',
          dim: '#7A6830',
          bright: '#E2C06A',
          muted: '#2E2618',
        },
        text: {
          primary: '#F0F0F0',
          secondary: '#8A8A90',
          muted: '#45454C',
        },
        correct: '#22C55E',
        missed: '#EF4444',
        'correct-dim': '#14352A',
        'missed-dim': '#2D1515',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
