import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        springz: {
          cream: '#F5F1E8',
          green: '#2D5016',
          orange: '#CC7A00',
          'light-green': '#E8F5E8',
          'light-orange': '#FFF3E6',
          'light-yellow': '#FFFCE6',
        },
        primary: {
          DEFAULT: '#2D5016',
          foreground: '#F5F1E8',
        },
        secondary: {
          DEFAULT: '#CC7A00',
          foreground: '#F5F1E8',
        },
        background: '#F5F1E8',
        foreground: '#2D5016',
        border: '#E5E7EB',
        ring: '#2D5016',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#F3F4F6',
          foreground: '#2D5016',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#F5F1E8',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#F5F1E8',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#2D5016',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      typography: {
        display: {
          fontSize: '3.5rem',
          fontWeight: '700',
          lineHeight: '1.1',
        },
        h1: {
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '1.2',
        },
        h2: {
          fontSize: '2rem',
          fontWeight: '600',
          lineHeight: '1.3',
        },
        h3: {
          fontSize: '1.5rem',
          fontWeight: '600',
          lineHeight: '1.4',
        },
        h4: {
          fontSize: '1.25rem',
          fontWeight: '600',
          lineHeight: '1.4',
        },
        h5: {
          fontSize: '1.125rem',
          fontWeight: '600',
          lineHeight: '1.4',
        },
        h6: {
          fontSize: '1rem',
          fontWeight: '600',
          lineHeight: '1.4',
        },
        body: {
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '1.6',
        },
        small: {
          fontSize: '0.875rem',
          fontWeight: '400',
          lineHeight: '1.5',
        },
      },
    },
  },
  plugins: [],
}

export default config
