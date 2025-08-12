/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          primary: '#2563eb',   // Professional blue
          secondary: '#1e40af', // Darker blue
          accent: '#059669',    // Medical green
          light: '#f0f9ff',     // Light blue background
          gray: '#6b7280',      // Professional gray
          success: '#10b981',   // Success green
          warning: '#f59e0b',   // Warning amber
          error: '#ef4444',     // Error red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}