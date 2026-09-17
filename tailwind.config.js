/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ige: {
          bg: '#F8FAFC',           // Fond principal gris perle
          surface: '#FFFFFF',      // Cartes blanc pur
          border: '#E2E8F0',       // Bordures grises
          darkText: '#1A1A1A',     // Texte principal
          mutedText: '#64748B',    // Texte secondaire
          // ─── Palette officielle IGE (charge.txt) ───
          green: '#17ce00',        // Vert IGE
          greenDark: '#12a000',    // Vert soutenu (hover / états actifs)
          greenSoft: '#e7fce4',    // Fond vert très clair (badges)
          violet: '#7c3aee',       // Violet IGE
          violetDark: '#6527d9',   // Violet soutenu (hover)
          violetSoft: '#f1e9ff',   // Fond violet très clair (badges)
          bronze: '#c17835',       // Bronze IGE
          bronzeDark: '#9d5f26',   // Bronze soutenu (hover)
          bronzeSoft: '#faeee1',   // Fond bronze très clair (badges)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
