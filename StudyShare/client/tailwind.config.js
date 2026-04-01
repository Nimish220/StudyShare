/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end SaaS Color Palette
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
        },
        navy: {
          900: '#0f172a',
          950: '#020617', // Deepest midnight for Sidebars
        },
        brand: {
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      boxShadow: {
        // Soft, multi-layered shadows for the "floating" card look
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem', // Extra rounded for that modern mobile-app feel
      }
    },
  },
  plugins: [],
}