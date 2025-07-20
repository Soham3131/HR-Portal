/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  theme: {
   extend: {
  animation: {
    'fade-in': 'fadeIn 0.5s ease-out both',
    'fade-in-down': 'fadeInDown 0.5s ease-out',
    'fade-in-up': 'fadeInUp 0.5s ease-out',
  },
  backgroundImage: {
        'gradient-light': 'linear-gradient(to right, #e0eafc, #cfdef3)',
        'gradient-dark': 'linear-gradient(to right, #1e1e2f, #2e2e3f)',
      },
  keyframes: {
    fadeInDown: {
      '0%': { opacity: 0, transform: 'translateY(-10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    fadeInUp: {
      '0%': { opacity: 0, transform: 'translateY(10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
  },
}
  },
  plugins: [],
}

