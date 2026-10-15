/** @type {import('tailwindcss').Config} */
const navyScale = {
  50: '#EEF3F8',
  100: '#DCE7F0',
  200: '#BDCFDF',
  300: '#94B1C8',
  400: '#6488A5',
  500: '#315B7C',
  600: '#1C4A6E',
  700: '#143D60',
  800: '#103654',
  900: '#0D3358',
  950: '#082544',
};

const tealScale = {
  50: '#E8F6F6',
  100: '#CDECEC',
  200: '#A4DDDE',
  300: '#6DC7CA',
  400: '#35ACB2',
  500: '#1A9BA1',
  600: '#18868C',
  700: '#14777C',
  800: '#105F63',
  900: '#0D4C50',
  950: '#083638',
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: navyScale,
        indigo: navyScale,
        teal: tealScale,
        ige: {
          bg: '#F8FAFC',           // Fond principal gris perle
          surface: '#FFFFFF',      // Cartes blanc pur
          border: '#E2E8F0',       // Bordures grises
          darkText: '#1A1A1A',     // Texte principal
          mutedText: '#64748B',    // Texte secondaire
          navy: '#0D3358',
          navyDark: '#082544',
          navySoft: '#E8EFF5',
          teal: '#1A9BA1',
          tealDark: '#14777C',
          tealSoft: '#E5F4F4',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        mono: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
