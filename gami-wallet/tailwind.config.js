const { tokens } = require('./src/design/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: tokens.color,
      fontFamily: {
        display: [tokens.type.display],
        displayXL: [tokens.type.displayXL],
        sans: [tokens.type.body],
        mono: [tokens.type.mono],
      },
      borderRadius: { none: '0', sticker: '0', pill: '9999px' },
      borderWidth: { hairline: '1px', base: '2px', thick: '3px' },
    },
  },
  plugins: [],
};
