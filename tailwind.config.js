/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'smash-primary': '#6366f1',
        'smash-secondary': '#8b5cf6',
        'smash-accent': '#06b6d4',
        'smash-success': '#10b981',
        'smash-warning': '#f59e0b',
        'smash-danger': '#ef4444',
        'smash-dark': '#1f2937',
        'smash-light': '#f8fafc'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      }
    },
  },
  plugins: [],
}
