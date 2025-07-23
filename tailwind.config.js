/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin_primary: {
          DEFAULT: '#3B82F6',
        },
        admin_secondary: {
          DEFAULT: '#9333EA',
        },
        admin_accent: {
          DEFAULT: '#F43F5E',
        },
        admin_success: {
          DEFAULT: '#22C55E',
        },
        admin_background: {
          DEFAULT: '#0F172A',
        },
        admin_surface: {
          DEFAULT: '#1E293B',
        },
        admin_border: {
          DEFAULT: '#334155',
        },
        admin_text: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
        },
      }
    },
  },
  plugins: [],
}