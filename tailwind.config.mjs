/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': 'var(--color-netflix-red)',
        'netflix-red-dark': 'var(--color-netflix-red-dark)',
        'netflix-black': 'var(--color-netflix-black)',
        'netflix-gray-dark': 'var(--color-netflix-gray-dark)',
        'netflix-gray': 'var(--color-netflix-gray)',
        'netflix-gray-light': 'var(--color-netflix-gray-light)',
        'netflix-white': 'var(--color-netflix-white)',
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        text: {
          DEFAULT: 'var(--text-DEFAULT)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--text-accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': 'var(--shadow-card-hover)',
        'modal': 'var(--shadow-modal)',
      }
    },
  },
  plugins: [],
};

export default config;
