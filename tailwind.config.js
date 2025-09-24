/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9cafc5',
          400: '#748ba8',
          500: '#4e6b8a',
          600: '#1e3a5f',
          700: '#172b4d',
          800: '#0f1a2e',
          900: '#0a0f1f',
          950: '#050810',
        },
        'gray': {
          50: '#fafbfc',
          100: '#f4f6f8',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0a0b0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontWeight: {
        bold: '700',
        extrabold: '800',
      },
      letterSpacing: {
        tight: '-0.025em',
        tighter: '-0.05em',
      },
    },
  },
  plugins: [],
};
