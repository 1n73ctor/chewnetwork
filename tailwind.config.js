/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      // Tokens are RGB channel triplets in tailwind.css, wrapped here with an
      // <alpha-value> placeholder so opacity modifiers (bg-primary/10,
      // border-accent/30, ...) actually compile.
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        // Same in both themes — for sections that are dark by design.
        'dark-panel': 'rgb(var(--dark-panel) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) * 0.5)',
        lg: 'calc(var(--radius) * 1.5)',
        xl: 'calc(var(--radius) * 2)',
        '2xl': 'calc(var(--radius) * 3)',
        '3xl': 'calc(var(--radius) * 4)',
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': '0 20px 40px rgba(0,0,0,0.1)',
        'green-glow': '0 8px 24px rgba(31, 122, 90, 0.35)',
        'orange-glow': '0 8px 24px rgba(191, 89, 37, 0.35)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};