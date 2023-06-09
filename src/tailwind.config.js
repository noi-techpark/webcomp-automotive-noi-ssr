// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    fontFamily: {
      sans: ['Hind', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: 'var(--primary-color)', // variable is set in WebComponent.vue
        'primary-hover': 'var(--primary-hover)',
        secondary: '#F5F5F5',
        'secondary-hover': '#fAfAfA',
        'light-black': '#343434',
        grey: '#888888',
        green: '#31b748',
        input: '#F2F2F2',
        'input-focus': '#F0F0F0',
        'light-red': '#fff1f1',
        'light-red-focus': '#fde9e9',
        placeholder: '#eeeeee',
      },
      borderRadius: {
        button: '10px',
        box: '20px',
      },
      spacing: {
        navbar: '25rem',
      },
    },
  },
  variants: {},
  plugins: [],
}
