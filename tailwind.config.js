/** @type {import('tailwindcss').Config} */
module.exports = {
    //here is to tell the Tailwind what files it should be scanning，and then generate as CSS
    content: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      //here to the components folder or app folder,
      //'./app/**/*.{js,jsx,ts,tsx}',
      //'./src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
      extend: {
        //DIY your own theme here  like color, gap, etc
        //colors: {
        //primary: '#ed6307',
        //secondary: '#cc3a00',
        // },
      },
    },
    plugins: [
      //put all the Tailwind official modules here
      //require('@tailwindcss/forms'),
    ],
  }
  