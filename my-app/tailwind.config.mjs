/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'transit-orange': '#FF6B00',
        'transit-beige': '#F5F3F0',
        'transit-charcoal': '#2D2D2D',
        'transit-light-orange': '#FF8533',
        'transit-dark-orange': '#CC5500',
      },
      fontFamily: {
        'pixel': ['VT323', 'Press Start 2P', 'monospace'],
        'mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
