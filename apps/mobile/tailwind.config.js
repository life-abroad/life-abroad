/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        madimi: ['MadimiOne_400Regular'],
      },
      colors: {
        background: '#020202',
        'background-secondary': '#191919',
        'background-muted': '#020202',
        foreground: '#F1F5F9',
        'foreground-secondary': '#E2E8F0',
        'foreground-muted': '#94A3B8',
        card: '#191919',
        'card-foreground': '#F1F5F9',
        border: '#ffffff',
        input: '#0b1324',
        ring: '#60A5FA',
        primary: '#0055FF',
        'primary-foreground': '#ffffff',
        secondary: '#191919',
        'secondary-foreground': '#F1F5F9',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#60A5FA',
      },
    },
  },
  plugins: [],
};
