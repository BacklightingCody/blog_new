/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        background: 'var(--background-color)',
        text: 'var(--text-color)',
        'subtle-bg': 'var(--subtle-bg)',
        'border-color': 'var(--border-color)',
        'red-theme': 'var(--red-color)',
        'blue-theme': 'var(--blue-color)',
        'pink-theme': 'var(--pink-color)',
        'purple-theme': 'var(--purple-color)',
        'cyan-theme': 'var(--cyan-color)',
        'orange-theme': 'var(--orange-color)',
        'yellow-theme': 'var(--yellow-color)',
      },
      boxShadow: {
        'theme-card': 'var(--card-shadow)',
      },
    },
  },
  plugins: [],
} 