/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        success: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
          dark: '#0D9488',
          text: '#115E59',
        },
        warning: {
          DEFAULT: '#FB923C',
          light: '#FFEDD5',
          dark: '#EA580C',
          text: '#9A3412',
        },
        error: {
          DEFAULT: '#F43F5E',
          light: '#FFE4E6',
          dark: '#E11D48',
          text: '#BE123C',
        },
        info: {
          DEFAULT: '#06B6D4',
          light: '#CFFAFE',
          dark: '#0891B2',
          text: '#155E75',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(124, 58, 237, 0.05), 0 4px 6px -2px rgba(124, 58, 237, 0.025)',
        'glow': '0 0 15px -3px rgba(124, 58, 237, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};