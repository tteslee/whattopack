import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        subway: {
          a: '#0039A6',
          b: '#FF6319', 
          c: '#2850AD',
          d: '#FF6319',
          e: '#0039A6',
          f: '#FF6319',
          g: '#6CBE45',
          j: '#996633',
          l: '#A7A9AC',
          // Dark mode colors
          'bg': '#0B0B0C',
          'surface': '#151517',
          'card': '#1D1D21',
          'text': '#FFFFFF',
          'muted': '#9CA3AF',
          // Light mode colors
          'bg-light': '#F8F9FA',
          'surface-light': '#FFFFFF',
          'card-light': '#F1F3F4',
          'text-light': '#1F2937',
          'muted-light': '#6B7280'
        }
      },
      borderRadius: {
        '2xl': '1.25rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '2.75rem' }],
        'h1': ['1.75rem', { lineHeight: '2rem' }],
        'h2': ['1.375rem', { lineHeight: '1.625rem' }],
        'body': ['1rem', { lineHeight: '1.5rem' }],
        'caption': ['0.8125rem', { lineHeight: '1.125rem' }],
      },
      fontWeight: {
        'extrabold': '800',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};

export default config; 