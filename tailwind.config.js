const withMT = require('@material-tailwind/html/utils/withMT');
/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: ['./src/**/*.{html,pug}'],
  theme: {
    colors: {
      dcBlue: '#3b4890',
      dcOrange: '#d98d06',
      dcSky: '#1d90bf',
      dcPurple: '#4a55a5',
      dcDark: '#222222',
    },
  },
  plugins: [],
  daisyui: {
    themes: ['light', 'dark'], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    defaultTheme: 'light',
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: 'daisy-', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
});
