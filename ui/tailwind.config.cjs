/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      accent: '#f29f52',
      error: '#e61a30',
      gray: {
        light: '#d0d0d0',
        medium: '#909090',
        dark: '#353535',
        darker: '#303030',
        darkest: '#252525',
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
