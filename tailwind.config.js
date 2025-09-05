/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 25% 97%)',
        accent: 'hsl(220 80% 50%)',
        primary: 'hsl(240 7% 15%)',
        surface: 'hsl(0 0% 100%)',
        'text-primary': 'hsl(210 25% 15%)',
        'text-secondary': 'hsl(210 25% 50%)',
      },
      borderRadius: {
        lg: '16px',
        md: '10px',
        sm: '6px',
      },
      boxShadow: {
        card: '0 8px 24px hsla(0, 0%, 0%, 0.12)',
      },
      spacing: {
        lg: '20px',
        md: '12px',
        sm: '8px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}