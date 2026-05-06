/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        accent: '#2E86AB',
        success: '#27AE60',
        page: '#F8FAFC',
        ink: '#1E293B',
        night: '#0F172A',
        mist: '#D7E5F3',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px -24px rgba(15, 23, 42, 0.35)',
        glow: '0 24px 80px -40px rgba(46, 134, 171, 0.45)',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulseLine: {
          '0%, 100%': {
            opacity: '0.2',
          },
          '50%': {
            opacity: '1',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out',
        'pulse-line': 'pulseLine 1s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
