/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        korea: '#0047A0', // 대한민국 상징 블루
        koreaRed: '#CD2E3A',
      },
    },
  },
  plugins: [],
}
