/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5f00ed',
        background: '#121212',
        surface: '#191919',
        error: '#fa5656',
        // Tag colors
        'tag-blue': '#4285F4',
        'tag-green': '#0F9D58',
        'tag-red': '#DB4437',
        'tag-yellow': '#F4B400',
        'tag-purple': '#AB47BC',
        'tag-teal': '#009688',
        'tag-orange': '#FF5722',
        'tag-pink': '#E91E63',
      },
      fontFamily: {
        header: ['Coustard', 'serif'],
        body: ['Abel', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};